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
    currentTest = new SetupJustWorm();

    //create neural neutwork
    // this.nn = new Architect.Perceptron(9+9, 25, 9+9);
    currentTest.setup(world);
}

function loadNetwork(network){
  var f = network[0];
  if (f) {
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result; //file contents as a string
      var object = JSON.parse(contents);
      nn = Network.fromJSON(object);

      //SHOW WORM
      init();
      changeTest();
      animate();
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function updateStats() {

}
