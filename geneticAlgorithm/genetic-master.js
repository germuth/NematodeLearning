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

  currentTest = new SetupJustWorm();

  //create neural neutwork based on best genetic algorithm
  // nn = new Architect.Perceptron(9+9+2, 25, 9+9);
  nn = population.members[0].network;
  currentTest.setup(world);
}

function updateStats() {
    var fbSpan = document.getElementById('feedbackSpan');
    fbSpan.innerHTML =
        "<br>Iteration: " + iteration +
        "<br>Best: " + population.members[0].cost;
}

var iteration = 0;
var GENETIC_ALGORITHM_ITERATION_COUNT = 75;
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
  var networkJSON = population.members[0].network.toJSON();
  console.log(networkJSON);

  //allow user to save file
  var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };

  var link = document.getElementById('downloadlink');
  link.href = makeTextFile(JSON.stringify(networkJSON));
  link.download += "-" + new Date().toLocaleString() + ".json";
  link.style.display = 'block'; //make it visible

  //init(); already initiliazed
  changeTest();
  animate();
}

var population;
function start() {
  using(Box2D, "b2.+")
  init();
  population = new Population();
  var button = document.getElementById('startbutton');
  button.style.display = 'none'; //remove start button
  pump();
}
