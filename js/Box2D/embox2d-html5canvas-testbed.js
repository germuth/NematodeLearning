
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
    //updateDebugDrawCheckboxesFromWorld();
    draw();
}

function createWorld() {

    if ( world != null )
        Box2D.destroy(world);

    var gravity = new b2Vec2(0.0, -10.0);
    //var gravity = new b2Vec2(0.0, 0.0);
    world = new b2World(gravity);
    world.SetDebugDraw(myDebugDraw);

    mouseJointGroundBody = world.CreateBody( new b2BodyDef() );

    //var e = document.getElementById("testSelection");
    //var v = e.options[e.selectedIndex].value;

    //eval( "currentTest = new "+v+"();" );
    eval( "currentTest = new embox2dTest_dominos();" );

    currentTest.setup()
}

function resetScene() {
    createWorld();
    draw();
}

function step(timestamp) {

    if ( currentTest && currentTest.step )
        currentTest.step();

    if ( ! showStats ) {
        world.Step(1/60, 3, 2);
        draw();
        return;
    }

    var current = Date.now();
    world.Step(1/60, 3, 2);
    var frametime = (Date.now() - current);
    frameTime60 = frameTime60 * (59/60) + frametime * (1/60);

    draw();
    statusUpdateCounter++;
    if ( statusUpdateCounter > 20 ) {
        updateStats();
        statusUpdateCounter = 0;
    }
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

function pause() {
    run = !run;
    if (run)
        animate();
    updateStats();
}