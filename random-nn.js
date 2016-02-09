function createWorld() {

    if ( world != null )
        Box2D.destroy(world);

    //var gravity = new b2Vec2(0.0, -10.0);
    var gravity = new b2Vec2(0.0, 0.0);
    world = new b2World( gravity );
    world.SetDebugDraw(myDebugDraw);

    mouseJointGroundBody = world.CreateBody( new b2BodyDef() );

    //var e = document.getElementById("testSelection");
    //var v = e.options[e.selectedIndex].value;

    //eval( "currentTest = new "+v+"();" );
    //eval( "currentTest = new embox2dTest_dominos();" );
    currentTest = new embox2dTest_dominos();

    //create random neural neutwork
    this.nn = new Architect.Perceptron(9+9, 25, 9+9);
    currentTest.setup();
}

function updateStats() {

}
