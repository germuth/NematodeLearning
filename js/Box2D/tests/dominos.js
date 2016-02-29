
var embox2dTest_dominos = function() {
    //constructor
    this.wormBody = new Array();
    this.wormJoints = new Array();
}

embox2dTest_dominos.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 26;
    setViewCenterWorld( new b2Vec2(0,8), true );
}

embox2dTest_dominos.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created

    var shape = new b2EdgeShape();
    shape.Set(new b2Vec2(-40.0, 0.0), new b2Vec2(40.0, 0.0));

    var ground = world.CreateBody(new b2BodyDef());
    ground.CreateFixture(shape, 0.0);

    shape = new b2PolygonShape();
	//domino platform
    shape.SetAsBox(1.8, 0.25, new b2Vec2(-1.5, 10.0), 0);
    ground.CreateFixture(shape, 0.0);

    shape.SetAsBox(7.0, 0.25, new b2Vec2(1.0, 6.0), 0.3);
    ground.CreateFixture(shape, 0.0);

    shape.SetAsBox(0.25, 1.5, new b2Vec2(-7.0, 4.0), 0.0);
    ground.CreateFixture(shape, 0.0);

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
        shape.SetAsBox(0.5, 0.125);

        var fd = new b2FixtureDef();
        fd.set_shape(shape);
        fd.set_density(20.0);
        fd.set_friction(0.5);
        // fd.get_filter().set_categoryBits(0x0001);
        // fd.get_filter().set_maskBits(0xFFFF & ~0x0002);

        var jd = new b2RevoluteJointDef();
        jd.set_collideConnected(false);
        jd.set_enableMotor(true);
        jd.set_maxMotorTorque(500.0);
        jd.set_motorSpeed(0.0);

        var N = 10;
        var y = 15.0;
        //var ropeDef = new b2RopeJointDef();
        //ropeDef.get_localAnchorA().Set(0.0, y);

        var prevBody;
        var wormJoint;
        for (var i = 0; i < N; ++i)
        {
            var bd = new b2BodyDef();
            bd.set_type(b2_dynamicBody);
            bd.set_position(new b2Vec2(0.5 + 1.0 * i, y));
            var body = world.CreateBody(bd);
            body.SetLinearDamping(0.5);
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
            frictionj.set_maxForce(50.5);
            frictionj.set_maxTorque(50.5);
            world.CreateJoint(frictionj);

            prevBody = body;
            this.wormBody.push(prevBody);//complexity?
        }

        //ropeDef.set_localAnchorB(new b2Vec2(0,0));

        //var extraLength = 0.01;
        //ropeDef.set_maxLength(N - 1.0 + extraLength);
        //ropeDef.set_bodyB(prevBody);
    }

    {
        //ropeDef.set_bodyA(ground);
        //world.CreateJoint(ropeDef);
    }

    var jd = new b2RevoluteJointDef();

    //see-saw
    var seesawBody;
    {
        var shape = new b2PolygonShape();
        shape.SetAsBox(6.0, 0.125);

        var bd = new b2BodyDef();
        bd.set_type(b2_dynamicBody);
        bd.set_position(new b2Vec2(-0.9, 1.0));
        bd.set_angle(-0.15);

        seesawBody = world.CreateBody(bd);
        seesawBody.CreateFixture(shape, 10.0);

        var anchor = new b2Vec2(-2.0, 1.0);
        jd.Initialize(ground, seesawBody, anchor);
        jd.set_collideConnected(true);
        world.CreateJoint(jd);
    }
}
