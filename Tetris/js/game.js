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
        /**
         * 游戏结束标记
         * @type {boolean}
         */
        is_finished = true,
        /**
         * 定时任务id
         */
        internal_id,
        /**
         * 移动中方块点数组
         * @type {Array}
         */
        moving_points = [],
        /**
         * 生成的图形是否有向下移动
         * @type {boolean}
         */
        walker_once = false,
        /**
         * 得分
         * @type {number}
         */
        score = 0;

    /**
     * 生成一个像素点html元素id
     * @param i
     * @param j
     * @returns {string}
     */
    function makeId(i, j) {
        return 'g' + i + '-' + j;
    }

    /**
     * 初始化
     */
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

    /**
     * xy系坐标转化成数组中对应的ij索引
     * @param x
     * @param y
     * @returns {{i: number, j: number}}
     */
    function toIJ(x, y) {
        return {
            i: config.grids.height - y,
            j: x - 1
        };
    }

    /**
     * 记录数组中的值
     * @param i
     * @param j
     * @param value
     */
    function setGridsValue(i, j, value) {
        if (i >= 0 && i < config.grids.height && j >= 0 && j < config.grids.width) {
            grids[i][j] = value;
        }
    }

    /**
     * 判断一个值是否为undefined, 如果是则返回默认值
     * @param value
     * @param defaultValue
     * @returns {*}
     */
    function defaultValue(value, defaultValue) {
        if (typeof value == 'undefined') {
            return defaultValue;
        }
        return value;
    }

    /**
     * 通过xy坐标体系设置点
     * @param x
     * @param y
     * @param isPoint
     * @param pointValue
     */
    function setPoint(x, y, isPoint, pointValue) {
        var index = toIJ(x, y);
        setGrid(index.i, index.j, isPoint, pointValue);
    }

    /**
     * 直接设置数组值(包括样式更改)
     * @param i
     * @param j
     * @param isPoint
     * @param pointValue
     */
    function setGrid(i, j, isPoint, pointValue) {
        if (i < 0 || i >= config.grids.height || j < 0 || j >= config.grids.width) {
            return;
        }

        if (isPoint) {
            setGridsValue(i, j, defaultValue(pointValue, 1));
            $('#' + makeId(i, j)).addClass('point');
        } else {
            setGridsValue(i, j, 0);
            $('#' + makeId(i, j)).removeClass('point');
        }
    }

    /**
     * 生成一个形状
     */
    function makeShape() {
        walker_once = false;
        moving_points.push({x: 4, y: 19});
        moving_points.push({x: 4, y: 20});
        moving_points.push({x: 5, y: 19});
        moving_points.push({x: 5, y: 20});
    }

    /**
     * 判断一个点的下一个点是否可以移动
     * @param x
     * @param y
     * @param direction
     * @returns {boolean}
     */
    function couldMove(x, y, direction) {
        var next_x, next_y, index, next;
        switch (direction) {
            case -1:
                next_x = x - 1;
                index = toIJ(next_x, y);
                next = next_x > 0;
                break;
            case 1:
                next_x = x + 1;
                index = toIJ(next_x, y);
                next = next_x <= config.grids.width;
                break;
            default:
                next_y = y - 1;
                index = toIJ(x, next_y);
                next = next_y > 0;
                break;
        }

        return next && grids[index.i][index.j] != 1;
    }

    /**
     * 所有可以移动的点向下移动
     * @param  direction 移动方向,0:向下,-1向左,1向右
     */
    function pointsWalker(direction) {
        if (moving_points.length > 0) {
            direction = defaultValue(direction, 0);

            var every_point_could_move = true;
            moving_points.forEach(function (p) {
                every_point_could_move = every_point_could_move && couldMove(p.x, p.y, direction);
            });

            moving_points.forEach(function (p, i) {
                if (every_point_could_move) {
                    setPoint(p.x, p.y, false);
                    walker_once = true;

                    var x = p.x, y = p.y;
                    switch (direction) {
                        case -1:
                            x = p.x - 1;
                            break;
                        case 1:
                            x = p.x + 1;
                            break;
                        default:
                            y = p.y - 1;
                            break;
                    }
                    moving_points[i].x = x;
                    moving_points[i].y = y;
                } else {
                    if (direction == 0) {
                        setPoint(p.x, p.y, true, 1);    //固化, 使之成为不可移动的点
                    }
                }
            });

            if (every_point_could_move) {
                moving_points.forEach(function (p) {
                    setPoint(p.x, p.y, true, 2);
                });
            } else {
                scoreTest();
            }

            if (!every_point_could_move && direction == 0) {
                moving_points = [];
            }
        }
    }

    /**
     * 得分检测
     */
    function scoreTest() {
        var get_lines = 0, could_get, line_empty, is_exist, lines = [];
        for (var i = config.grids.height - 1; i >= 0; i--) {
            could_get = true;
            line_empty = true;
            for (var j = 0; j < config.grids.width; j++) {
                is_exist = grids[i][j] == 1;
                if (is_exist) {
                    line_empty = false;
                }
                could_get = could_get && is_exist;
            }
            if (could_get) {
                lines.push({line: i, get_lines: get_lines++});
            }
            if (line_empty) {
                break;
            }
        }
        getScore(lines);
    }

    /**
     * 得分计算(包含样式变化)
     * @param lines
     */
    function getScore(lines) {
        var len = lines.length;
        if (len == 0) {
            return;
        }

        lines.forEach(function (l) {
            for (var get_j = 0; get_j < config.grids.width; get_j++) {
                setGrid(l.line, get_j, false);   //删除得分行
            }
            score++;
        });

        var move_lines = 0;
        for (var i = config.grids.height - 2; i >= 0; i--) {    //所有点向下移动一位
            for (var k = 0; k < len; k++) {
                if (i <= lines[k].line) {
                    move_lines = lines[k].get_lines + 1;
                }
            }
            for (var j = 0; j < config.grids.width; j++) {
                if (grids[i][j] == 1) {
                    setGrid(i, j, false);
                    setGrid(i + move_lines, j, true, 1);
                }
            }
        }
    }

    /**
     * 做移动
     */
    this.walkerLeft = function () {
        pointsWalker(-1);
    };

    /**
     * 右移动
     */
    this.walkerRight = function () {
        pointsWalker(1);
    };

    /**
     * 下移动
     */
    this.walkerDown = function () {
        pointsWalker(0);
    };

    /**
     * 结束检测
     */
    function stopTest() {
        if (!walker_once) {
            stop();
        }
    }

    /**
     * 停止游戏
     */
    function stop() {
        is_finished = true;
        clearInterval(internal_id);
        alert('game over!');
    }

    /**
     * 开始游戏
     */
    this.start = function () {
        is_finished = false;
        internal_id = setInterval(function () {
            if (!is_finished) {
                if (moving_points.length == 0) {
                    makeShape();
                }
                pointsWalker(0);
                stopTest();
            }
        }, 200);
    }

};

(function () {
    var my_game = new game('tetris');
    my_game.start();

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                my_game.walkerLeft();
                break;
            case 39:
                my_game.walkerRight();
                break;
            case 40:
                my_game.walkerDown();
                break;
        }
    });

    /*var a = [1, 2, 3, 4];
     dd(a[4].b);*/

    /*$("html").click(function () {
     if (my_game.isFinished()) {
     my_game.start();
     } else {
     my_game.jump();
     }
     });*/

})();
