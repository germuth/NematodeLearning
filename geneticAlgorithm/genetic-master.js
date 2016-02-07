var PTM = 32;

var world = null;
var mouseJointGroundBody;
var canvas;
var context;
var myDebugDraw;
var myQueryCallback;
var mouseJoint = null;
var run = true;
var frameTime60 = 0;
var statusUpdateCounter = 0;
var showStats = false;
var mouseDown = false;
var shiftDown = false;
var mousePosPixel = {
    x: 0,
    y: 0
};
var prevMousePosPixel = {
    x: 0,
    y: 0
};
var mousePosWorld = {
    x: 0,
    y: 0
};
var canvasOffset = {
    x: 0,
    y: 0
};
var viewCenterPixel = {
    x:320,
    y:240
};
var currentTest = null;

function myRound(val,places) {
    var c = 1;
    for (var i = 0; i < places; i++)
        c *= 10;
    return Math.round(val*c)/c;
}

function getWorldPointFromPixelPoint(pixelPoint) {
    return {
        x: (pixelPoint.x - canvasOffset.x)/PTM,
        y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
    };
}

function updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mousePosPixel = {
        x: evt.clientX - rect.left,
        y: canvas.height - (evt.clientY - rect.top)
    };
    mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
}

function setViewCenterWorld(b2vecpos, instantaneous) {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
    var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
    var fraction = instantaneous ? 1 : 0.25;
    canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
    canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
}

function onMouseMove(canvas, evt) {
    prevMousePosPixel = mousePosPixel;
    updateMousePos(canvas, evt);
    updateStats();
    if ( shiftDown ) {
        canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
        canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
        draw();
    }
    else if ( mouseDown && mouseJoint != null ) {
        mouseJoint.SetTarget( new b2Vec2(mousePosWorld.x, mousePosWorld.y) );
    }
}

function startMouseJoint() {

    if ( mouseJoint != null )
        return;

    // Make a small box.
    var aabb = new b2AABB();
    var d = 0.001;
    aabb.set_lowerBound(new b2Vec2(mousePosWorld.x - d, mousePosWorld.y - d));
    aabb.set_upperBound(new b2Vec2(mousePosWorld.x + d, mousePosWorld.y + d));

    // Query the world for overlapping shapes.
    myQueryCallback.m_fixture = null;
    myQueryCallback.m_point = new b2Vec2(mousePosWorld.x, mousePosWorld.y);
    world.QueryAABB(myQueryCallback, aabb);

    if (myQueryCallback.m_fixture)
    {
        var body = myQueryCallback.m_fixture.GetBody();
        var md = new b2MouseJointDef();
        md.set_bodyA(mouseJointGroundBody);
        md.set_bodyB(body);
        md.set_target( new b2Vec2(mousePosWorld.x, mousePosWorld.y) );
        md.set_maxForce( 1000 * body.GetMass() );
        md.set_collideConnected(true);

        mouseJoint = Box2D.castObject( world.CreateJoint(md), b2MouseJoint );
        body.SetAwake(true);
    }
}

function onMouseDown(canvas, evt) {
    updateMousePos(canvas, evt);
    if ( !mouseDown )
        startMouseJoint();
    mouseDown = true;
    updateStats();
}

function onMouseUp(canvas, evt) {
    mouseDown = false;
    updateMousePos(canvas, evt);
    updateStats();
    if ( mouseJoint != null ) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = null;
    }
}

function onMouseOut(canvas, evt) {
    onMouseUp(canvas,evt);
}

function onKeyDown(canvas, evt) {
    console.log(evt.keyCode);
    if ( evt.keyCode == 80 ) {//p
        pause();
    }
    else if ( evt.keyCode == 82 ) {//r
        resetScene();
    }
    else if ( evt.keyCode == 83 ) {//s
        step();
    }
    else if ( evt.keyCode == 88 ) {//x
        zoomIn();
    }
    else if ( evt.keyCode == 90 ) {//z
        zoomOut();
    }
    else if ( evt.keyCode == 37 ) {//left
        canvasOffset.x += 32;
    }
    else if ( evt.keyCode == 39 ) {//right
        canvasOffset.x -= 32;
    }
    else if ( evt.keyCode == 38 ) {//up
        canvasOffset.y += 32;
    }
    else if ( evt.keyCode == 40 ) {//down
        canvasOffset.y -= 32;
    }
    else if ( evt.keyCode == 16 ) {//shift
        shiftDown = true;
    }

    if ( currentTest && currentTest.onKeyDown )
        currentTest.onKeyDown(canvas, evt);

    draw();
}

function onKeyUp(canvas, evt) {
    if ( evt.keyCode == 16 ) {//shift
        shiftDown = false;
    }

    if ( currentTest && currentTest.onKeyUp )
        currentTest.onKeyUp(canvas, evt);
}

function zoomIn() {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    PTM *= 1.1;
    var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    draw();
}

function zoomOut() {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    PTM /= 1.1;
    var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    draw();
}

function updateDebugDrawCheckboxesFromWorld() {
    var flags = myDebugDraw.GetFlags();
}

function updateWorldFromDebugDrawCheckboxes() {
    var flags = 0;
    if ( document.getElementById('drawShapesCheck').checked )
        flags |= e_shapeBit;
    if ( document.getElementById('drawJointsCheck').checked )
        flags |= e_jointBit;
    if ( document.getElementById('drawAABBsCheck').checked )
        flags |= e_aabbBit;
    /*if ( document.getElementById('drawPairsCheck').checked )
        flags |= e_pairBit;*/
    if ( document.getElementById('drawTransformsCheck').checked )
        flags |= e_centerOfMassBit;
    myDebugDraw.SetFlags( flags );
}

function updateContinuousRefreshStatus() {
    showStats = ( document.getElementById('showStatsCheck').checked );
    if ( !showStats ) {
        var fbSpan = document.getElementById('feedbackSpan');
        fbSpan.innerHTML = "";
    }
    else
        updateStats();
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext( '2d' );

    canvasOffset.x = canvas.width/2;
    canvasOffset.y = canvas.height/2;

    canvas.addEventListener('mousemove', function(evt) {
        onMouseMove(canvas,evt);
    }, false);

    canvas.addEventListener('mousedown', function(evt) {
        onMouseDown(canvas,evt);
    }, false);

    canvas.addEventListener('mouseup', function(evt) {
        onMouseUp(canvas,evt);
    }, false);

    canvas.addEventListener('mouseout', function(evt) {
        onMouseOut(canvas,evt);
    }, false);

    canvas.addEventListener('keydown', function(evt) {
        onKeyDown(canvas,evt);
    }, false);

    canvas.addEventListener('keyup', function(evt) {
        onKeyUp(canvas,evt);
    }, false);

    myDebugDraw = getCanvasDebugDraw();
    myDebugDraw.SetFlags(e_shapeBit);

    myQueryCallback = new b2QueryCallback();

    Box2D.customizeVTable(myQueryCallback, [{
    original: Box2D.b2QueryCallback.prototype.ReportFixture,
    replacement:
        function(thsPtr, fixturePtr) {
            var ths = Box2D.wrapPointer( thsPtr, b2QueryCallback );
            var fixture = Box2D.wrapPointer( fixturePtr, b2Fixture );
            if ( fixture.GetBody().GetType() != Box2D.b2_dynamicBody ) //mouse cannot drag static bodies around
                return true;
            if ( ! fixture.TestPoint( ths.m_point ) )
                return true;
            ths.m_fixture = fixture;
            return false;
        }
    }]);
}

function changeTest() {
    resetScene();
    if ( currentTest && currentTest.setNiceViewCenter )
        currentTest.setNiceViewCenter();
    updateDebugDrawCheckboxesFromWorld();
    draw();
}


function resetScene() {
    createWorld();
    draw();
}

function createWorld(){
  if ( world != null )
  Box2D.destroy(world);

  //var gravity = new b2Vec2(0.0, -10.0);
  var gravity = new b2Vec2(0.0, 0.0);
  world = new b2World( gravity );
  world.SetDebugDraw(myDebugDraw);

  mouseJointGroundBody = world.CreateBody( new b2BodyDef() );

  //var e = document.getElementById("testSelection");
  //var v = e.options[e.selectedIndex].value;

  currentTest = new geneticAlgorithm();

  //create neural neutwork based on best genetic algorithm
  // this.nn = new Architect.Perceptron(9+9+2, 25, 9);
  this.nn = population.members[0].network;
  currentTest.setup(world);
}

function step(timestamp) {

  if ( currentTest && currentTest.step )
    currentTest.step();

  //adjust worm motors to output of nn
  var nn_output = worm();
  var worm_length = currentTest.wormJoints.length;
  for(var i = 0; i < worm_length; i++){
    var speed = nn_output[i];
    var torque = nn_output[i + worm_length];
    //outputs are from [0-1], scale speed to [-2 2], torque to [0, 500]
    speed = 4 * (speed - 0.5);
    torque *= 500;
    currentTest.wormJoints[i].SetMotorSpeed(speed);
    currentTest.wormJoints[i].SetMaxMotorTorque(torque);
  }

  world.Step(1/60, 3, 2);
  draw();
  return;
}

//every step nn is asked what to do again, based on where it is
function worm() {
  //what are the current angles
  var angles = currentTest.wormJoints.map(
    function(currentValue, index, array){
      //returns an angle from [-3 3] radians. Scale to [0 1]
      var x = currentValue.GetJointAngle() / 6; //[-.5 .5]
      x += 0.5; //[0 1]
      return x;
  });

  //what are the current speeds
  var speeds = currentTest.wormJoints.map(
    function(currentValue, index, array){
      //returns a speed from [-2 2]
      var x = currentValue.GetMotorSpeed() / 4; // [-.5 .5]
      x += 0.5; // [0 1]
      return x;
  });

  //where am i (vector) (heads position)
  var pos = currentTest.wormBody[0].GetPosition();

  //where do i want to go
  // var dest = new b2Vec2(0.0, 0.0);

  // var input = angles.concat(speeds).concat(pos.get_x()).concat(pos.get_y());
  //don't need to put position in, just get to 0.0 0.0 in 10 seconds
  var input = angles.concat(speeds);
  return this.nn.activate(input);
}

function draw() {

    //black background
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect( 0, 0, canvas.width, canvas.height );

    context.save();
        context.translate(canvasOffset.x, canvasOffset.y);
        context.scale(1,-1);
        context.scale(PTM,PTM);
        context.lineWidth /= PTM;

        drawAxes(context);

        context.fillStyle = 'rgb(255,255,0)';
        world.DrawDebugData();

        if ( mouseJoint != null ) {
            //mouse joint is not drawn with regular joints in debug draw
            var p1 = mouseJoint.GetAnchorB();
            var p2 = mouseJoint.GetTarget();
            context.strokeStyle = 'rgb(204,204,204)';
            context.beginPath();
            context.moveTo(p1.get_x(),p1.get_y());
            context.lineTo(p2.get_x(),p2.get_y());
            context.stroke();
        }

    context.restore();
}

function updateStats() {
    var fbSpan = document.getElementById('feedbackSpan');
    fbSpan.innerHTML =
        "<br>Iteration: " + iteration +
        "<br>Best: " + population.members[0].cost;
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

function animate() {
    if ( run )
        requestAnimFrame( animate );
    step();
}

var iteration = 0;
var GENETIC_ALGORITHM_ITERATION_COUNT = 10;
function doCalculation() {
    population.generation(iteration);
    updateStats();
    iteration++;
    return iteration;
}

function pump() {
    var percent_complete = doCalculation();
    //maybe update a progress meter here!
    //carry on pumping?
    if (percent_complete < GENETIC_ALGORITHM_ITERATION_COUNT) {
        setTimeout(pump, 50);
    }else{
      displayResults();
    }
}

function displayResults(){
  //print json to console to save nn
  console.log("output neural network with cost: " + population.members[0].cost);
  console.log(population.members[0].network.toJSON());
  //init(); already initiliazed
  changeTest();
  animate();
}

var population;
function start() {
  using(Box2D, "b2.+")
  init();
  population = new Population();
  pump();
}

function pause() {
    run = !run;
    if (run)
        animate();
    updateStats();
}
