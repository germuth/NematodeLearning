var POPULATION_SIZE = 50;
var Population = function() {
    this.members = [];
    this.generationNumber = 0;
    var size = POPULATION_SIZE;
    while (size--) { //randomly create population
        // var gene = new Gene(new Architect.Perceptron(9+9+2, 25, 9));
        // var gene = new Gene(new Architect.Perceptron(9+9, 25, 9));
        //neuron takes in angle and speed of every joint
        //turns it into speed and torque of every joint

        //if worm has 3 bodies, it has two joints
        //each joint has an angle and speed
        var neurons = (WORM_LENGTH-1) * 2;
        var gene = new Gene(new Architect.Perceptron(neurons/2, 25, neurons));
        this.members.push(gene);
    }
};
Population.prototype.display = function() {
    document.body.innerHTML = '';
    document.body.innerHTML += ("<h2>Generation: " + this.generationNumber + "</h2>");
    document.body.innerHTML += ("<ul>");
    for (var i = 0; i < this.members.length; i++) {
        document.body.innerHTML += ("<li>" + this.members[i].code + " (" + this.members[i].cost + ")");
    }
    document.body.innerHTML += ("</ul>");
};
Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}
Population.prototype.generation = function(iter) {
    //no crossover for now
    //var children = this.members[0].mate(this.members[1]);
    //this.members.splice(this.members.length - 2, 2, children[0], children[1]);

    //create copy and mutate all
    for (var i = 0; i < POPULATION_SIZE; i++) {
        var mutated = this.members[i].clone();
        mutated.mutate();
        this.members.push(mutated);
    }

    var average = 0;
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].calcCost();
        average += this.members[i].cost;
    }

    this.sort();

    console.log(iter + ". avg: " + Math.round((average/(POPULATION_SIZE*2))*100)/100 +
      " best: " + Math.round(this.members[0].cost*100)/100);

    if (this.members[0].cost <= -5.0) {
        return true;
    }

    // this.members.length = POPULATION_SIZE; //only keep 50 best
    this.members.splice(50, 50); //remove last 50 elements
    this.generationNumber++;
    return false;
};
