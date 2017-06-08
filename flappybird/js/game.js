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

var config = {
    board: {
        width: 800,
        height: 600
    },
    bird_size: 20,
    fps: 100,
    bird_speed: 800,
    g: 1000
};

var game = function (gameId) {
    var board = $('#' + gameId),
        bird = $("<div class='bird'></div>"),
        bird_x = 100,
        bird_y = 0,
        is_finished = false,
        interval_id,
        time = 0;

    var birdMoveTo = function () {
        var top = config.board.height - config.bird_size - bird_y;
        bird.css({"left": bird_x + "px", "top": top + 'px'});
    };

    this.init = function () {
        board.append(bird);
        birdMoveTo();
    };

    this.init();

    this.start = function () {
        is_finished = false;
        interval_id = setInterval(function () {
            if (!is_finished) {
                time = time + (1 / config.fps);

                if (bird_y >= 0) {
                    bird_y = (config.bird_speed * time) - (0.5 * config.g * time * time);
                } else {
                    time = 0;
                    bird_y = 0;
                }

                //dd(bird_y);
                birdMoveTo();
            }
        }, 1000 / config.fps)
    };

    this.stop = function () {
        is_finished = true;
        clearInterval(interval_id);
    };
};

(function () {
    var my_game = new game('game');
    //my_game.start();
    $("#start").click(function () {
        my_game.start();
    });
    $("#stop").click(function () {
        my_game.stop();
    });

})();
