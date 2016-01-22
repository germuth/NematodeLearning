//mutate 10% of connections
var MUTATE_PERCENT = 0.10;
//whether perturbations or complete resets are used
var MUTATE_WITH_PERTURB = true;
//how much to perturb by
var PERTURB_PERCENT = 0.10;

var Gene = function(network) {
    this.isUpdated = false;
    this.cost = 9999;
    this.network = network;
};
Gene.prototype.clone = function() {
    var copy = new Gene(this.network.clone());
    copy.cost = this.cost;
    copy.isUpdated = this.isUpdated;
    return copy;
}
Gene.prototype.mutate = function() {
    this.isUpdated = false;
    var neurons = this.network.neurons();
    var a = 0;
    for(var i = 0; i < neurons.length; i++){
        //get all links outgoing from neuron
        var connections = neurons[i].neuron.connections.projected;
        for(var name in connections){
            //single link in the network
            var connection = connections[name];
            //a++;
            if(Math.random() <= MUTATE_PERCENT){ //mutate 10% of connections
                if(MUTATE_WITH_PERTURB){
                    if(Math.random() <= 0.5){
                        connection.weight += connection.weight * PERTURB_PERCENT;
                    } else{
                        connection.weight -= connection.weight * PERTURB_PERCENT;
                    }
                } else{ //completely reset value
                    connection.weight = Math.random();
                }
            }
        }
    }
    //console.log(a);
};
//this is probably the dirtiest code you have ever written
Gene.prototype.crossover = function(other) {
    var child1 = new Gene(this.network.clone());
    var child2 = new Gene(other.network.clone());

    var this_neurons = this.network.neurons();
    var other_neurons = other.network.neurons();
    var ch1_neurons = child1.network.neurons();
    var ch2_neurons = child2.network.neurons();
    for(var i = 0; i < this_neurons.length; i++){
        //get all links outgoing from neuron
        var this_conns = this_neurons[i].neuron.connections.projected;
        var other_conns = other_neurons[i].neuron.connections.projected;
        var ch1_conns = ch1_neurons[i].neuron.connections.projected;
        var ch2_conns = ch2_neurons[i].neuron.connections.projected;
        for(var name in connections){
            //single link in the network
            var this_conn = this_conns[name];
            var other_conn = other_conns[name];
            var ch1_conn = ch1_conns[name];
            var ch2_conn = ch2_conns[name];
            if(Math.random() <= 0.50){ //swap genes 50% of the time
                ch1_conn.weight = other_conn.weight;
                ch2_conn.weight = this_conn.weight;
            }
        }
    }
    return [child1, child2];
};
Gene.prototype.calcCost = function() {
    if(this.isUpdated) return;

    //set up box2d world
    using(Box2D, "b2.+")
    var world = new b2World( new b2Vec2(0.0, 0.0) );
    //world.SetDebugDraw(myDebugDraw);
    //mouseJointGroundBody = world.CreateBody( new b2BodyDef() );
    var currentTest = new geneticAlgorithm();
    currentTest.setup(world);

    //give the worm 20 seconds to get somewhere
    for(var i = 0; i < 60*20; i++){
        var angles = currentTest.wormJoints.map(
            function(currentValue, index, array){
                return currentValue.GetJointAngle();
        });

        //what are the current angles
        var speeds = currentTest.wormJoints.map(
            function(currentValue, index, array){
                return currentValue.GetMotorSpeed();
        });

        //where am i (vector) (heads position)
        var pos = currentTest.wormBody[0].GetPosition();

        var input = angles.concat(speeds).concat(pos.get_x()).concat(pos.get_y());
        var nn_output = this.network.activate(input);
        for(var j = 0; j < currentTest.wormJoints.length; j++){
            var output = nn_output[j];
            //is from [0-1], scale to [-1 1]
            output -= 0.5;
            output *= 2;
            currentTest.wormJoints[j].SetMotorSpeed(output);
        }
        //advance simulation 1/60 of a second
        world.Step(1/60, 3, 2);
    }
    //clean up memory
    var body = world.GetBodyList();
    while(Box2D.getPointer(body)) {
        var next = body.GetNext();
        //delete all fixture
        var fixture = body.GetFixtureList();
        //all my objects have a single fixture
        // while(Box2D.getPointer(fixture)){
        //     var nnext = fixture.GetNext();
        //     body.DestroyFixture(nnext);
        //     fixture = nnext;
        // }
        if(Box2D.getPointer(fixture)){
            body.DestroyFixture(fixture);
        }
        var x = Box2D.castObject( body, b2Body );
        world.DestroyBody(x);
        body = next;
    }
    //joints deleted with bodies

    //get position of head
    var head_pos = currentTest.wormBody[0].GetPosition();
    // //cost is distance to origin
    // this.cost = Math.sqrt(Math.pow(head_pos.get_x(),2) + Math.pow(head_pos.get_y(),2));
    // cost is how far to the left you can travel (more negative is good)
    this.cost = head_pos.get_x();
};
