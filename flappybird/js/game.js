/**
 * Created by jaackie on 2017/6/8.
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
    board: {
        width: 800, /*画面长度px*/
        height: 600 /*画面高度px*/
    },
    bird_size: 20, /*小鸟大小px*/
    fps: 100, /*画面刷新帧率*/
    bird_speed: 400, /*小鸟向上弹起初速度, 越大越快*/
    g: 800, /*向下重力加速度, 越大下落越快*/
    pipe: {
        speed: 1, /*水管移动速度*/
        gap: 200, /*上下间隔*/
        width: 50, /*水管宽度*/
        length: 200 /*两水管间隔*/
    }
};

/**
 * 水管html
 * @type {string}
 */
var pipe = "<div class='pipe'><div class='top'><div class='body'></div><div class='header'></div></div><div class='bottom'><div class='header'></div><div class='body'></div></div></div>";

var game = function (gameId) {
    var board = $('#' + gameId),
        /**
         * 小鸟初始纵坐标
         * @type {number}
         */
        init_y = (config.board.height - config.bird_size) / 2,
        /**
         * 小鸟html
         * @type {*}
         */
        bird = $("<div class='bird'></div>"),
        /**
         * 小鸟横坐标
         * @type {number}
         */
        bird_x = 200,
        /**
         * 小鸟纵坐标
         * @type {number}
         */
        bird_y = init_y,
        /**
         * 游戏是否结束
         * @type {boolean}
         */
        is_finished = true,
        /**
         * 画面刷新任务id
         */
        interval_id,
        /**
         * 时间
         * @type {number}
         */
        time = 0,
        /**
         * 弹跳偏移量
         * @type {number}
         */
        jump_y = init_y,
        /**
         * 水管数组
         * @type {Array}
         */
        pipes = [],
        score = 0;

    /**
     * 小鸟移动(以画板的左下角为原点, 单位为像素点)
     */
    var birdMoveTo = function () {
        /*计算小鸟相对纵坐标*/
        var top = config.board.height - config.bird_size - bird_y;
        bird.css({"left": bird_x + "px", "top": top + 'px'});
    };

    /**
     * 初始化
     */
    this.init = function () {
        /*添加小鸟节点*/
        board.append(bird);

        birdMoveTo();
    };

    this.init();

    /**
     * 生成一个水管
     */
    function makePipe() {
        var p = $(pipe),
            /**
             * 产生随机的一个上水管体的高度
             * @type {number}
             */
            top_body_height = Math.ceil(100 + Math.random() * 100),
            /**
             * 计算下水管体的高度
             * @type {number}
             */
            bottom_body_height = config.board.height - 16 - 60 - config.pipe.gap - top_body_height,
            /**
             * 计算上水管底部y坐标
             * @type {number}
             */
            top_bottom_y = config.board.height - top_body_height - 8 - 30;

        $($(p[0].firstChild)[0].firstChild).css("height", top_body_height + "px");
        $($(p[0].lastChild)[0].lastChild).css("height", bottom_body_height + "px");
        $($(p[0].lastChild)).css("margin-top", config.pipe.gap + "px");

        board.append(p);

        /*将水管节点放入数组中*/
        pipes.push({
            x: config.board.width, /*最左边的点*/
            obj: p, /*水管对象*/
            y: top_bottom_y, /*顶部水管最低纵坐标,相对小鸟纵坐标,用于碰撞检测*/
            is_over: false/*是否越过了,用于计算得分*/
        });
    }

    /**
     * 水管监控(根据条件产生水管)
     */
    function pipesWatcher() {
        var len = pipes.length;
        /*水管数组中如果没有水管或者距离上一个超过间隔距离将生成一个新的水管*/
        if (len == 0 || config.board.width - pipes[len - 1].x >= config.pipe.length) {
            makePipe();
        }
    }

    /**
     * 水管移动(用于移动所有水管)
     */
    function pipesWalker() {
        pipes.forEach(function (pipe, i) {
            /*计算水管移动的位置*/
            var x = pipe.x - config.pipe.speed;
            if (x >= -config.pipe.width) {
                /*移动水管*/
                pipes[i].obj.css("left", x + "px");
                pipes[i].x = x;
            } else {/*超出范围则清除该水管*/
                pipes[i].obj.remove();
                pipes.shift()
            }
        })
    }

    /**
     * 碰撞检测以及得分计算
     */
    function impactTest() {
        pipes.forEach(function (pipe, i) {
            if (pipe.x <= bird_x + config.bird_size && bird_x <= pipe.x + config.pipe.width) {
                if (bird_y <= pipe.y - config.pipe.gap || bird_y + config.bird_size >= pipe.y) { /*碰撞*/
                    finish();
                }
            } else if (bird_x > pipe.x + config.pipe.width) {  /*得分*/
                if (!pipe.is_over) {
                    score++;
                    pipes[i].is_over = true;
                    $("#score").html(score);
                }
            }
        })
    }

    /**
     * 开始游戏
     */
    this.start = function () {
        /*已经在游戏中或是有刷新任务则不再开始*/
        if (!is_finished && interval_id >= 1) return;

        is_finished = false;
        interval_id = setInterval(function () {
            if (!is_finished) {
                pipesWatcher();
                pipesWalker();

                time = time + (1 / config.fps);
                var top_border = config.board.height - config.bird_size;
                if (top_border >= bird_y && bird_y >= 0) {
                    bird_y = jump_y + (config.bird_speed * time) - (0.5 * config.g * time * time);
                } else {
                    time = 0;
                    bird_y = 0;
                    finish();
                }

                birdMoveTo();
                impactTest();
            }
        }, 1000 / config.fps)
    };

    /**
     * 获取是否结束属性
     * @returns {boolean}
     */
    this.isFinished = function () {
        return is_finished;
    };

    /**
     * 停止游戏
     */
    function finish() {
        is_finished = true;
        jump_y = init_y;
        clearInterval(interval_id);
        confirm('game over! your score is ' + score + ', start again?');
        location.reload();
    }

    /**
     * 点击跳跃
     */
    this.jump = function () {
        if (!is_finished) {
            jump_y = bird_y;
            time = 0;
        }
    }
};

(function () {
    var my_game = new game('game');
    $("html").click(function () {
        if (my_game.isFinished()) {
            my_game.start();
        } else {
            my_game.jump();
        }
    });

})();
