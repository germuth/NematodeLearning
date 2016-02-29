

//this is a poor name, it should be called solo-worm or someone
var SetupJustWorm = function() {
    //constructor
    this.wormBody = new Array();
    this.wormJoints = new Array();
}

SetupJustWorm.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 26;
    setViewCenterWorld( new b2Vec2(0,8), true );
}

SetupJustWorm.prototype.setup = function(world) {
    //set up the Box2D scene here - the world is already created
    //create the floor for friction
    var floor;
    {
      var shape = new b2PolygonShape();
      shape.SetAsBox(15.0, 15.0);
      var bd = new b2BodyDef();
      bd.set_type(b2_staticBody);
      bd.set_position(new b2Vec2(0.0, 10.0));
      floor = world.CreateBody(bd);
      //don't want collisions with floor so don't make fixture
      //floor.CreateFixture(shape, 0.0);
    }
    //create the worm
    {
        var shape = new b2PolygonShape();
        shape.SetAsBox(0.4, 0.125);

        var fd = new b2FixtureDef();
        fd.set_shape(shape);
        // fd.set_density(20.0);
        fd.set_density(10.0);
        // fd.set_friction(0.5);
        fd.set_friction(0.5);

        var jd = new b2RevoluteJointDef();
        jd.set_collideConnected(false);
        jd.set_enableMotor(true);
        jd.set_maxMotorTorque(500.0);
        jd.set_motorSpeed(0.0);

        var y = 15.0;

        var prevBody;
        var wormJoint;
        for (var i = 0; i < WORM_LENGTH; ++i)
        {
            var bd = new b2BodyDef();
            bd.set_type(b2_dynamicBody);
            bd.set_position(new b2Vec2(0.5 + 1.0 * i, y));
            var body = world.CreateBody(bd);
            // body.SetLinearDamping(5.5);
            // body.SetAngularDamping(5.5);
            body.CreateFixture(fd);

            if(i != 0){
              var anchor = new b2Vec2(i, y);
              jd.Initialize(prevBody, body, anchor);
              wormJoint = Box2D.castObject( world.CreateJoint(jd), b2RevoluteJoint );
              this.wormJoints.push(wormJoint);
            }

            //add friction to the floor
            var frictionj = new b2FrictionJointDef();
            frictionj.Initialize(body, floor, new b2Vec2(0,0));
            frictionj.set_maxForce(5.5);
            frictionj.set_maxTorque(5.5);
            world.CreateJoint(frictionj);

            prevBody = body;
            this.wormBody.push(prevBody);//complexity?
        }
    }
}
