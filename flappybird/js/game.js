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
    bird_speed: 600, /*小鸟向上弹起初速度*/
    g: 1000, /*向下重力加速度*/
    pipe: {
        speed: 1, /*水管移动速度*/
        gap: 200, /*上下间隔*/
        width: 50, /*水管宽度*/
        length: 200 /*两水管间隔*/
    }
};

var pipe = "<div class='pipe'><div class='top'><div class='body'></div><div class='header'></div></div><div class='bottom'><div class='header'></div><div class='body'></div></div></div>";

var game = function (gameId) {
    var board = $('#' + gameId),
        /**
         * 小鸟初始纵坐标
         * @type {number}
         */
        init_y = (config.board.height - config.bird_size) / 2,
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
        pipes = [];

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
            top_body_height = 100 + Math.random() * 100,
            bottom_body_height = config.board.height - 8 - 60 - config.pipe.gap - top_body_height;

        /*dd(top_body_height);
        dd(bottom_body_height);*/
        p.children(".top .body").css("height", top_body_height);
        p.children(".bottom .body").css("height", bottom_body_height);
        board.append(p);
        /*将水管节点放入数组中*/
        pipes.push({
            x: config.board.width,
            obj: p
        });
        dd(pipes);
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
                    //alert('game over');
                    finish();
                }
                birdMoveTo();
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
    }

    /**
     * 停止游戏
     */
    /*this.stop = function () {
     finish();
     };*/

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
    /*$("#start").click(function () {
     my_game.start();
     });
     $("#stop").click(function () {
     my_game.stop();
     });*/
    $("#game").click(function () {
        if (my_game.isFinished()) {
            my_game.start();
        } else {
            my_game.jump();
        }
    });

})();
