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
 * 游戏配置
 */
var config = {
    grids: {
        width: 10, /*画面长格子*/
        height: 20 /*画面高格子*/
    },
    speed: 1000 / 2  /*下落速度, 越大越慢*/
};

var shape = function () {

    var /**
         * 形状的名字, 同时也是索引
         */
        name,
        /**
         * 基础点位置
         * @type {{x,y}}
         */
        base_point = {},
        /**
         * 变换形状的索引
         * @type {number}
         */
        trans_index = 0,
        /**
         * 形状点的具体位置数组
         * @type {Array}
         */
        points = [],
        /**
         * 所有形状对象集合
         * @type {{}}
         */
        shapes = {
            line: {
                /*直线*/
                relative_points: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}], /*相对基础点的位置*/
                trans: [/*可变换形状的变换数组*/
                    [{x: 1, y: -1}, {x: 0, y: 0}, {x: -1, y: 1}, {x: -2, y: -2}],
                    [{x: -1, y: 1}, {x: 0, y: 0}, {x: 1, y: -1}, {x: 2, y: 2}]
                ],
                bp: {
                    /*基础点位置计算*/
                    x: Math.floor(config.grids.width / 2) - 1,
                    y: config.grids.height
                }
            },
            square: {
                /*正方形*/
                relative_points: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
                trans: [],
                bp: {
                    x: Math.floor(config.grids.width / 2),
                    y: config.grids.height
                }
            },
            z: {
                /*z形*/
                relative_points: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 2, y: -1}],
                trans: [
                    [{x: 2, y: 1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}],
                    [{x: -2, y: -1}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: 0}]
                ],
                bp: {
                    x: Math.floor(config.grids.width / 2) - 1,
                    y: config.grids.height
                }
            },
            oz: {
                /*反的z形*/
                relative_points: [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}],
                trans: [
                    [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: -2, y: 1}],
                    [{x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 2, y: -1}]
                ],
                bp: {
                    x: Math.floor(config.grids.width / 2),
                    y: config.grids.height
                }
            },
            j: {
                /*J形*/
                relative_points: [{x: 0, y: 0}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1}],
                trans: [
                    [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 2}],
                    [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: -2, y: -1}],
                    [{x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: -2}],
                    [{x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 2, y: 1}]
                ],
                bp: {
                    x: Math.floor(config.grids.width / 2) - 1,
                    y: config.grids.height
                }
            },
            l: {
                /*L形*/
                relative_points: [{x: 0, y: 0}, {x: 0, y: -1}, {x: -1, y: -1}, {x: -2, y: -1}],
                trans: [
                    [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}],
                    [{x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 2, y: -1}],
                    [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: -2}],
                    [{x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}, {x: -2, y: 1}]
                ],
                bp: {
                    x: Math.floor(config.grids.width / 2) + 1,
                    y: config.grids.height
                }
            },
            t: {
                /*T形*/
                relative_points: [{x: 0, y: 0}, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}],
                trans: [
                    [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 2}],
                    [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: -2, y: -1}],
                    [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: -2}],
                    [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 2, y: 1}]
                ],
                bp: {
                    x: Math.floor(config.grids.width / 2),
                    y: config.grids.height
                }
            }
        };

    /**
     * 获取各点变换的数组
     * @returns {Array}
     */
    this.getTrans = function () {
        var trans = shapes[name].trans[trans_index];
        if (typeof trans == 'undefined') {
            trans = [];
        }
        return trans;
    };

    /**
     * 变换计算
     */
    this.trans = function () {
        trans_index++;
        /*索引指向下一位变换数组*/
        if (typeof shapes[name].trans[trans_index] == 'undefined') {
            trans_index = 0;
            /*如果不存在下一位切换回第1位*/
        }
    };

    /**
     * 初始化
     * @param shapeName
     * @param shape
     */
    function init(shapeName, shape) {
        name = shapeName;
        base_point = shape.bp;
        initPoints(shape.relative_points);
    }

    /**
     * 初始化所有点
     * @param relativePoints
     */
    function initPoints(relativePoints) {
        relativePoints.forEach(function (p) {
            points.push({
                x: base_point.x + p.x,
                y: base_point.y + p.y
            })
        });
    }

    /**
     * 返回初始点数组
     * @returns {Array}
     */
    this.getPoints = function () {
        return points;
    };

    /**
     * 随机生成一个形状并初始化对象
     */
    this.random = function () {
        var /**
             * 随机最大值
             * @type {Number}
             */
            max = Object.getOwnPropertyNames(shapes).length,
            /**
             * 获取随机值
             * @type {number}
             */
            r = Math.floor(Math.random() * max),
            /**
             * 迭代计数
             * @type {number}
             */
            i = 0,
            /**
             * 形状对象
             */
            obj,
            /**
             * 形状名字
             */
            name;

        for (var s in shapes) {
            if (i == r) {
                name = s;
                obj = shapes[s];
                break;
            }
            i++;
        }

        init(name, obj);
    }
};


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
        score = 0,
        /**
         * 移动中形状对象
         */
        moving_shape;

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
        moving_shape = new shape();
        moving_shape.random();
        moving_points = moving_shape.getPoints();
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
            moving_points.forEach(function (p) {    /*分析每个点是否可移动*/
                every_point_could_move = every_point_could_move && couldMove(p.x, p.y, direction);
            });

            moving_points.forEach(function (p, i) { /*计算每个移动的点*/
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
                        setPoint(p.x, p.y, true, 1);    //向下移动时,不能再继续移动, 固化, 使之成为不可移动的点
                    }
                }
            });

            if (every_point_could_move) {
                moving_points.forEach(function (p) {
                    setPoint(p.x, p.y, true, 2);
                    /*刷新移动的点*/
                });
            } else {
                scoreTest();
                /*不可移动时得分检测*/
            }

            if (!every_point_could_move && direction == 0) {
                moving_points = [];
                /*清空可移动的点*/
            }
        }
    }

    /**
     * 得分检测
     */
    function scoreTest() {
        var /**
             * 已得分的行数
             * @type {number}
             */
            get_lines = 0, could_get, line_empty, is_exist,
            /**
             * 得分行数组
             * @type {Array}
             */
            lines = [];
        for (var i = config.grids.height - 1; i >= 0; i--) {
            could_get = true;
            /*是否可得分*/
            line_empty = true;
            /*分析行是否为空, 为空的话后面的循环可以不用再继续了*/
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
                /*跳出判断循环*/
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
                setGrid(l.line, get_j, false);
                /*删除得分行*/
            }
            score++;
            /*得分累计*/
        });

        var move_lines = 0;
        for (var i = config.grids.height - 2; i >= 0; i--) {    /*所有点向下移动*/
            for (var k = 0; k < len; k++) {
                if (i <= lines[k].line) {
                    move_lines = lines[k].get_lines + 1;
                    /*计算可向下移动的位数*/
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
     * 检测是否可以变换形状
     * @param transPoints
     * @returns {boolean}
     */
    function couldTrans(transPoints) {
        var could = true;
        moving_points.forEach(function (p, ii) {
            var x = p.x + transPoints[ii].x,
                y = p.y + transPoints[ii].y,
                index = toIJ(x, y),
                i = index.i,
                j = index.j;
            could = could && i >= 0 && i < config.grids.height && j >= 0 && j < config.grids.width && grids[i][j] != 1
        });
        return could;
    }

    /**
     * 形状变换
     */
    this.trans = function () {
        var trans_points = moving_shape.getTrans();
        if (trans_points.length == 0) {
            return;
        }
        if (!couldTrans(trans_points)) {
            return;
        }
        moving_points.forEach(function (p, ii) {
            setPoint(p.x, p.y, false);
            var x = p.x + trans_points[ii].x,
                y = p.y + trans_points[ii].y;
            moving_points[ii].x = x;
            moving_points[ii].y = y;
            setPoint(x, y, true, 2);
        });

        moving_shape.trans();
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
        if (confirm('game over! your score is ' + score + ', start game again?')) {
            location.reload();
        }
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
        }, config.speed);
    }

};

(function () {
    var my_game = new game('tetris');
    my_game.start();

    $(document).keydown(function (e) {
        switch (e.which) {
            case 38:
                my_game.trans();
                break;
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

})();
