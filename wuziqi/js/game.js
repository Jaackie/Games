/**
 * Created by jaackie on 2017/5/4.
 */

/**
 * 控制台打印
 * @param msg
 */
function dd(msg) {
    console.log(msg);
}

/**
 * 棋盘类
 * @param board 棋盘div的jQuery对象
 */
var board = function (board) {
    /**
     * 棋盘div的jQuery对象
     */
    this.board = board;

    /**
     * 棋盘网格数(横竖方向)
     * @type {number}
     */
    this.num = 15;

    /**
     * 棋盘状态(二维)数组,一维水平线,二维竖直线,值代表落子状态,0:无子,1:白子,2:黑子
     * @type {Array}
     */
    this.data = [];

    /**
     * 初始化数据及页面
     */
    this.init = function () {
        for (var h = 0; h < this.num; h++) {
            this.data[h] = [];
            for (var v = 0; v < this.num; v++) {
                this.data[h][v] = 0;
            }
        }
        this.draw(this.data);
    };
    /**
     * 将棋子数据画出来
     */
    this.draw = function () {
        var table = '<table>';
        for (var h in this.data) {
            table += '<tr>';
            for (var v in this.data[h]) {
                var cc = '', pv = this.data[h][v];
                if (pv == 1) {
                    cc = 'w';
                } else if (pv == 2) {
                    cc = 'b';
                }
                table += '<td class="' + cc + '" data-h="' + h + '" data-v="' + v + '">' + pv + '</td>';
            }
            table += '</tr>';
        }
        table += '</table>';
        this.board.html(table);
        return this;
    };
    this.init();

    /**
     * 设置某一坐标上的值
     * @param h
     * @param v
     * @param pv
     * @returns {boolean}
     */
    this.set = function (h, v, pv) {
        if (this.data[h][v] <= 0) {
            this.data[h][v] = pv;
            return true;
        }
        return false;
    };

    /**
     * 获取某个坐标的值
     * @param h
     * @param v
     * @returns {Number}
     */
    this.get = function (h, v) {
        return parseInt(this.data[h][v]);
    };

    /**
     * 对某个值进行5子判断
     * @param jv
     * @returns {boolean}
     */
    this.judge = function (jv) {
        for (var h in this.data) {
            for (var v in this.data[h]) {
                var pv = this.data[h][v];
                if (pv == jv) {
                    if (this.aroundJudge(h, v, pv)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    /**
     * 八个方向上的坐标变化
     * @type {*[]}
     */
    this.dir = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

    /**
     * 判断八个方向上的点是否与其相同
     * @param h
     * @param v
     * @param pv
     * @returns {boolean}
     */
    this.aroundJudge = function (h, v, pv) {
        h = +h;
        v = +v;
        for (var d in this.dir) {
            var dv = this.dir[d], hd = h + parseInt(dv[0]), vd = v + parseInt(dv[1]), count = 1;
            if (hd < 0 || vd < 0 || hd >= this.num || vd >= this.num) continue;
            if (this.data[hd][vd] == pv) {
                count = this.dVal(hd, vd, d, pv, ++count);
                if (count >= 5) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * 获取某个子周围空格下反方向的子数
     * @param h
     * @param v
     * @param pv
     * @returns {Array}
     */
    /*this.aroundCount = function (h, v, pv) {
     h = +h;
     v = +v;
     var result = {};

     for (var d in this.dir) {
     var dv = this.dir[d], hd = h + parseInt(dv[0]), vd = v + parseInt(dv[1]), count = 1;
     if (this.isOut(hd, vd)) continue;
     if (this.data[hd][vd] <= 0) {
     count = this.dVal(h, v, this.oppositeD(d), pv, count);
     result[hd + '-' + vd] = {h: hd, v: vd, count: count};
     }
     }
     return result;
     };*/

    /**
     * 坐标是否出界
     * @param h
     * @param v
     * @returns {boolean}
     */
    this.isOut = function (h, v) {
        return h < 0 || v < 0 || h >= this.num || v >= this.num;
    };

    /**
     * 获取反方向指针
     * @param d
     * @returns {number}
     */
    this.oppositeD = function (d) {
        d = +d;
        return d >= 4 ? d - 4 : d + 4;
    };

    /**
     * 判断某个方向上的点是否与其相同
     * @param hd
     * @param vd
     * @param d
     * @param pv
     * @param count
     * @returns {*}
     */
    this.dVal = function (hd, vd, d, pv, count) {
        var hdd = hd + this.dir[d][0], vdd = vd + this.dir[d][1];
        if (this.isOut(hdd, vdd)) return count;
        if (this.data[hdd][vdd] == pv) {
            return this.dVal(hdd, vdd, d, pv, ++count);
        } else {
            return count;
        }
    };

    /**
     * 判断某个方向上的点是否与其相同(包含尽头的子是否可落)
     * @param hd
     * @param vd
     * @param d
     * @param pv
     * @param count
     * @returns {number[]}
     */
    this.dValWithEnd = function (hd, vd, d, pv, count) {
        var hdd = hd + this.dir[d][0], vdd = vd + this.dir[d][1];
        //dd(hdd),dd(vdd);
        if (this.isOut(hdd, vdd)) return [count, 0];
        var val = this.data[hdd][vdd];
        if (val == pv) {
            return this.dValWithEnd(hdd, vdd, d, pv, ++count);
        } else if (val == 0) {
            return [count, 1];  //最后一个后面还可以继续落子
        } else {
            return [count, 0];
        }
    };

    /**
     * 获取某个方向上的坐标
     * @param h
     * @param v
     * @param d 方向值
     * @returns {{h: number, v: number}}
     */
    this.getDHV = function (h, v, d) {
        //h = +h, v = +v;
        return {
            h: +h + parseInt(this.dir[d][0]),
            v: +v + parseInt(this.dir[d][1])
        };
    };
};


/**
 * 落子算法
 * @param board 棋盘对象
 * @param value 算法所持子的值,1:白子,2:黑子
 */
var gameAi = function (board, value) {
    /**
     * 棋盘对象
     */
    this.board = board;

    /**
     * 己方持子值
     */
    this.my_value = value;

    /**
     * 对方持子值
     * @type {number}
     */
    this.against_vaule = value == 1 ? 2 : 1;

    /**
     * 获取某个子周围可落子数组对象
     * @param h
     * @param v
     * @returns {{}}
     */
    this.getAroundEmptyObj = function (h, v) {
        var obj = {}, h = +h, v = +v;
        for (var d in this.board.dir) {
            var dv = this.board.dir[d], hd = h + parseInt(dv[0]), vd = v + parseInt(dv[1]);
            if (this.board.isOut(hd, vd)) continue;
            if (this.board.get(hd, vd) == 0) {
                obj[d] = this.board.dir[d];
            }
        }
        return obj;
    };

    /**
     * 重置(归0)所有暂存的负数的值
     */
    this.clear = function () {
        for (var h in this.board.data) {
            for (var v in this.board.data[h]) {
                if (this.board.data[h][v] < 0) {
                    this.board.set(h, v, 0);
                }
            }
        }
    };

    /**
     * 各种情况对应的权重
     * @param countEnd
     * @param amI
     * @returns {Number}
     */
    this.weight = function (countEnd, amI) {
        var key = countEnd[0] + '-' + amI + '-' + countEnd[1], w = 0;
        switch (key) {
            case '4-1-0':
            case '4-1-1':
                w = 99999;
                break;
            case '4-0-0':
            case '4-0-1':
                w = 12000;
                break;
            case '3-1-1':
                w = 9000;
                break;
            case '3-0-1':
                w = 1400;
                break;
            case '3-1-0':
                w = 99;
                break;
            case '3-0-0':
                w = 90;
                break;
            case '2-1-1':
                w = 10;
                break;
            case '2-0-1':
                w = 5;
                break;
            case '2-1-0':
                w = 4;
                break;
            case '2-0-0':
                w = 3;
                break;
            case '1-1-1':
            case '1-0-1':
                w = 2;
                break;
            case '1-1-0':
            case '1-0-0':
                w = 1;
                break;
            default:
                w = 0;
                break;
        }
        return parseInt(w);
    };

    /**
     * 获取某个可落子格子权重
     * @param h
     * @param v
     * @returns {number}
     */
    this.getWeight = function (h, v) {
        var w = 0;
        h = +h, v = +v;
        for (var d in this.board.dir) {
            var dv = this.board.dir[d], hd = h + parseInt(dv[0]), vd = v + parseInt(dv[1]);
            if (this.board.isOut(hd, vd)) continue;
            var res_my = this.board.dValWithEnd(h, v, d, this.my_value, 0),
                res_against = this.board.dValWithEnd(h, v, d, this.against_vaule, 0),
                w_my = this.weight(res_my, 1),
                w_against = this.weight(res_against, 0);

            w += w_my + w_against;
        }
        return w;
    };

    this.calWeight = function (h, v, d) {

    };

    /**
     * AI分析出可落子的格子
     * @returns {{}}
     */
    this.getPut = function () {
        var res_list = {}, res_w = 0, res = {};
        //this.clear();
        for (var h in this.board.data) {
            for (var v in this.board.data[h]) {
                var pv = this.board.data[h][v];
                if (pv > 0) {
                    var eo = this.getAroundEmptyObj(h, v);
                    for (var d in eo) {
                        var dhv = this.board.getDHV(h, v, d),
                            key = dhv.h + '-' + dhv.v;
                        if (!res_list.hasOwnProperty(key)) {
                            var w = this.getWeight(dhv.h, dhv.v);
                            //dd(w);
                            res_list[key] = {
                                h: dhv.h,
                                v: dhv.v,
                                w: w
                            };
                        }
                    }
                }
            }
        }

        for (var i in res_list) {
            //this.board.set(res_list[i].h, res_list[i].v, -+res_list[i].w);
            if (res_w <= res_list[i].w) {
                res = res_list[i];
                res_w = res_list[i].w;
            }
        }
        //this.board.draw();
        return res;
    }
};

/**
 * 游戏对象
 * @param $board
 */
var game = function ($board) {
    var b = new board($board),  //棋盘对象
        turn_gamer = 1,         //轮到哪方持子
        is_finished = false;    //是否结束游戏

    /**
     * 根据持子值获取黑白棋名称
     * @param gamer_val
     * @returns {string}
     */
    function getColor(gamer_val) {
        return gamer_val == 1 ? '白棋' : '黑棋';
    }

    /**
     * 获取棋盘对象
     * @returns {board}
     */
    this.getBoard = function () {
        return b;
    };

    /**
     * 落子
     * @param h
     * @param v
     */
    this.put = function (h, v) {
        if (!is_finished && b.set(h, v, turn_gamer)) {
            if (b.draw().judge(turn_gamer)) {
                is_finished = true;
                alert(getColor(turn_gamer) + '胜');
            } else {
                turn_gamer = turn_gamer == 1 ? 2 : 1;
                if (turn_gamer == 2) {
                    var robot = new gameAi(b, turn_gamer);
                    var put = robot.getPut();
                    this.put(put.h, put.v);
                    dd(put.w);
                }
            }
        }
    }
};
(function () {
    var g = new game($('#board'));
    $('#board').on('click', 'td', function () {
        g.put($(this).data('h'), $(this).data('v'));
    });
    $('#board').bind("contextmenu", function () {
        return false;
    });
    /*$('#board').on('mousedown', 'td', function (e) {
     //右键为3
     if (3 == e.which) {
     var robot = new gameAi(g.getBoard(), 2);
     robot.getWeight($(this).data('h'), $(this).data('v'));
     }
     });*/
})();
