/**
 * Created by jaackie on 2017/6/10.
 */

/**
 * 控制台打印
 * @param msg
 */
function dd(msg) {
    console.log(msg);
}

/**
 * 游戏配置
 */
var config = {
    grids: {
        width: 10, /*画面长格子*/
        height: 20 /*画面高格子*/
    }
}, shape = [
    {
        name: 'line',

    }
];

var game = function (gameId) {
    var board = $('#' + gameId),
        /**
         * 画面网格
         * @type {Array}
         */
        grids = [],
        is_finished = true,
        internal_id,
        moving_points = [];


    function makeId(i, j) {
        return 'g' + i + '-' + j;
    }

    function init() {
        var table = '<table>';
        for (var i = 0; i < config.grids.height; i++) {
            table += '<tr>';
            grids[i] = [];
            for (var j = 0; j < config.grids.width; j++) {
                table += '<td id="' + makeId(i, j) + '"></td>';
                grids[i][j] = 0;
            }
            table += '</tr>';
        }
        table += '</table>';
        board.append($(table));
    }

    init();

    function setPoint(x, y, isPoint) {
        if (x > config.grids.width || x < 1 || y > config.grids.height || y < 1) {
            return;
        }
        var i = config.grids.height - y, j = x - 1;

        if (isPoint) {
            $('#' + makeId(i, j)).addClass('point');
        } else {
            $('#' + makeId(i, j)).removeClass('point');
        }
    }

    function makeShape() {
        if (moving_points.length == 0) {
            moving_points.push({x: 5, y: 20});
        }
        dd(moving_points);
    }

    function pointsWalker() {
        if (moving_points.length > 0) {
            moving_points.forEach(function (p, i) {
                var next_y = p.y - 1;
                if (next_y > 0) {
                    setPoint(p.x, p.y, false);
                    moving_points[i].y = next_y;
                    setPoint(p.x, next_y, true);
                } else {
                    moving_points = [];
                }
            })
        }
    }

    this.start = function () {
        is_finished = false;
        internal_id = setInterval(function () {
            if (!is_finished) {
                makeShape();
                pointsWalker();
            }
        }, 200);
    }


};

(function () {
    var my_game = new game('tetris');
    my_game.start();
    /*$("html").click(function () {
     if (my_game.isFinished()) {
     my_game.start();
     } else {
     my_game.jump();
     }
     });*/

})();
