var snake = {
	pos: [ [20, 20] ],
	dir: 'r',

	move: function () {
		var nextX;
		var nextY;
		switch (this.dir) {
			case 'r':
				nextX = this.pos[0][0];
				nextY = this.pos[0][1] + 1;
				break;
			case 'l':
				nextX = this.pos[0][0];
				nextY = this.pos[0][1] - 1;
				break;
			case 'u':
				nextX = this.pos[0][0] - 1;
				nextY = this.pos[0][1];
				break;
			case 'd':
				nextX = this.pos[0][0] + 1;
				nextY = this.pos[0][1];
				break;
		}
		//if next location has food, extend worm
		if (grid[nextX][nextY] === 'F') {
            this.pos.unshift([nextX, nextY]);
            food.generate();
        } else {
            this.propagate();
            this.pos[0][0] = nextX;
            this.pos[0][1] = nextY;
        }
    },
    propagate: function () {
        //replace 2nd with 1st, 3rd with 2nd, etc
        for (k = this.pos.length - 1; k > 0; k--) {
            this.pos[k] = this.pos[k - 1].slice();
        }

    }
};
var food = {
    x: 20,
    y: 24,
    generate: function() {
        this.x = Math.floor((Math.random() * 40));
        this.y = Math.floor((Math.random() * 40));
    }
};
var grid = [];
var resetGrid = function () {
    for (i = 0; i < 40; i++) {
        grid[i] = [];
        for (j = 0; j < 40; j++) {
            found = false;
            for (k = 0; k < snake.pos.length; k++) {
                if (snake.pos[k][0] === i && snake.pos[k][1] === j) {
                    found = true;
                    break;
                }
            }
            if (found) {
                grid[i][j] = 'O';
            } else if(food.x === i && food.y === j){
                grid[i][j] = 'F';
            }else {
                grid[i][j] = ' ';
				}
        }
    }
};


var render = function () {
    $('#container').empty();
    for (i = 0; i < 40; i++) {
        $('#container').append('<div id=row' + i + '></div>');
        for (j = 0; j < 40; j++) {
            $('#row' + i).append('<div class="tile">' + grid[i][j] + '</div>');
        }
    }
};
var gameloop = function () {
    snake.move();
    resetGrid();
    render();
    setTimeout(gameloop, 400);
};

$('document').ready(function () {
    document.onkeydown = function (e) {
        e = e || window.event;
        if (e.keyCode == '38') {
            snake.dir = 'u';
        } else if (e.keyCode == '40') {
            snake.dir = 'd';
        } else if (e.keyCode == '37') {
            snake.dir = 'l';
        } else if (e.keyCode == '39') {
            snake.dir = 'r';
        }
    };

    resetGrid();
    grid[20][20] = 'O';
    grid[20][24] = 'F';


    render();
    setTimeout(gameloop, 400);
});
