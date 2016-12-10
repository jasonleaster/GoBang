/**
 * Author   : EOF
 * File     : ArtificialIntelligence.js
 * Date     : 2016/12/2.
 */

var ConnectedType = {
    None       :0,
    SleepOne   :1, // --$*?--, --?*$--
    SleepTwo   :2, // --$**??--, --???**--,--?*?*?--,--*???*--
    SleepThree :3, // --***??--, --??***
    SleepFour  :4, // --
    WakedOne   :5, // --?*???--, --??*??--,--???*?--
    WakedTwo   :6, // --?**? --, --??**?--
    WakedThree :7, // --?***?--,
    WakedFour  :8  // --?****?--
};

var Direction = {
    Slash     : {"row": -1, "col": +1}, // "/"
    BackSlash : {"row": +1, "col": +1}, // "\"
    Horizon   : {"row":  0, "col": +1}, // "-"
    Vertical  : {"row": +1, "col":  0}  // "|"
};

function ArtificialIntelligence(boardSize, UI) {

    var DEBUG = true;
    var userInterface = UI;

    var size = boardSize;
    var envPointer = this;

    var whoseTurn = PIECES_TYPE.BLACK; // recommend to change "piece" into "stone"

    function isWhiteTurn() {
        return whoseTurn == PIECES_TYPE.WHITE;
    }

    function isBlackTurn() {
        return whoseTurn == PIECES_TYPE.BLACK;
    }

    function swithTurns() {
        if(whoseTurn == PIECES_TYPE.WHITE){
            whoseTurn = PIECES_TYPE.BLACK;
        }else{
            whoseTurn = PIECES_TYPE.WHITE;
        }
    }

    function getWhoseTurn() {
        return whoseTurn;
    }

    function isWakedOne(line, pieceType) {
        if(line.length == 5 && (line[1] == pieceType || line[2] == pieceType || line[3] == pieceType)){
            return true;
        }else{
            return false;
        }
    }

    function isSleepOne(line, pieceType) {
        return !isWakedOne(line, pieceType);
    }

    function isWakedTwo(line, pieceType) {
        if( (line.length == 5) && ((line[1] == pieceType && line[2] == pieceType)||
                                   (line[2] == pieceType && line[3] == pieceType)||
                                   (line[1] == pieceType || line[3] == pieceType))
        ){
            return true;
        }else{
            return false;
        }
    }

    function isSleepTwo(line, pieceType) {
        return !isWakedTwo(line, pieceType);
    }

    function isWakedThree(line, pieceType) {
        if( (line.length == 5) && (line[1] == pieceType && line[2] == pieceType &&line[3] == pieceType) ){
            return true;
        }else{
            return false;
        }
    }

    function isSleepThree(line, pieceType) {
        return !isWakedThree(line, pieceType);
    }

    function isWakedFour(line, pieceType) {

        if(line.length != 6){
            return false;
        }

        var condition = (
        line[0] == PIECES_TYPE.NONE && line[5] == PIECES_TYPE.NONE &&
        line[1] == pieceType        && line[2] == pieceType        &&
        line[3] == pieceType        && line[4] == pieceType);

        if(condition){
            return true;
        }else{
            return false;
        }
    }

    function isSleepFour(line, pieceType) {
        return !isWakedFour(line, pieceType);
    }

    function getPiecesOnALine(startPoint, direction, count) {
        var pieces = [];
        var row = startPoint.row;
        var col = startPoint.col;

        for(var i = 0; i < count; i++){
            if( board.legalIndex(row, col) ){
                pieces.push( board.getPiece(row, col) );
            }else{
                break
            }
            row += direction.row;
            col += direction.col;
        }

        return pieces;
    }


    /**
     *
     * @param wayToWin   某种赢法
     * @param pieceType  棋子类型
     * @param count      对应已经满足该赢法条件的棋子数量
     */
    function checkConnectedType(wayToWin, pieceType, count) {

        if(count == 0){
            return ConnectedType.None;
        }

        var startPoint = wayToWin.startPoint;
        var direction  = wayToWin.direction;
        var line;

        if(count < 4){
            line = getPiecesOnALine(startPoint, direction, 5);
        }else{
            line = getPiecesOnALine(startPoint, direction, 6);
        }


        if(count == 4 && isWakedFour(line, pieceType)){
            return ConnectedType.WakedFour;
        }

        if(count == 4 && isSleepFour(line, pieceType)){
            return ConnectedType.SleepFour;
        }

        if(count == 3 && isWakedThree(line, pieceType)){
            return ConnectedType.WakedThree;
        }

        if(count == 3 && isSleepThree(line, pieceType)){
            return ConnectedType.SleepThree;
        }

        if(count == 2 && isWakedTwo(line, pieceType)){
            return ConnectedType.WakedTwo;
        }

        if(count == 2 && isSleepTwo(line, pieceType)){
            return ConnectedType.SleepTwo;
        }

        if(count == 1 && isWakedOne(line, pieceType)){
            return ConnectedType.WakedOne;
        }

        if(count == 1 && isSleepOne(line, pieceType)){
            return ConnectedType.SleepOne;
        }

        window.alert("Error! in checkConnectedType");
    }

    var diffWayToWin = 0;
    var waysToWin    = [];

    function _init_waysToWin() {

        function wayToWinBuilder(startPoint, direction, type) {
            return {
                "startPoint"    : startPoint, //{"row":row, "col":col}
                "direction"     : direction,
                "connectedType" : type
            };
        }

        function setWayToWin(i, m, j, n, direction) {

            /*
             * m, n belongs to {-1, 0, +1}
             * */

            var x = i + m*(5 - 1);
            var y = j + n*(5 - 1);

            if(! (0 <= x && x < size &&
                0 <= y && y < size) ) {
                return;
            }

            for(var k = 0; k < 5; k++){
                x = i + m*k;
                y = j + n*k;

                waysToWin[x][y][diffWayToWin] = wayToWinBuilder({"row":i, "col":j}, direction, ConnectedType.None);
            }

            diffWayToWin++;
        }

        diffWayToWin = 0;

        for(var i = 0; i < size; i++){
            waysToWin[i] = [];
            for(var j = 0; j < size; j++){
                waysToWin[i][j] = [];
            }
        }

        for(var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                setWayToWin(i, Direction.Slash.row,     j, Direction.Slash.col,     Direction.Slash);
                setWayToWin(i, Direction.Horizon.row,   j, Direction.Horizon.col,   Direction.Horizon);
                setWayToWin(i, Direction.BackSlash.row, j, Direction.BackSlash.col, Direction.BackSlash);
                setWayToWin(i, Direction.Vertical.row,  j, Direction.Vertical.col,  Direction.Vertical);
            }
        }

        console.log("There are " + diffWayToWin + " ways to win!");
    }

    var whiteWins = [];
    var blackWins = [];

    var whiteWinsPossible = [];
    var blackWinsPossible = [];

    function _init_statisticPossibleToWin() {
        for(var k = 0; k < diffWayToWin; k++){
            whiteWins[k] = 0;
            blackWins[k] = 0;

            whiteWinsPossible[k] = true;
            blackWinsPossible[k] = true;
        }
    }

    /**
     * Evaluation for current situation
     *
     * @returns {{row: number, col: number}}
     */
    this.thinkWithOneDepth = function(){

        //Evaluation for current situation.
        var whiteScore = [];
        var blackScore = [];

        var maxScore= 0;
        var m = -1, n = -1;//position where get the max score

        for (var i = 0; i < size; i++){
            whiteScore[i] = [];
            blackScore[i] = [];
            for(var j = 0; j < size; j++){
                whiteScore[i][j] = 0;
                blackScore[i][j] = 0;
            }
        }

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                if(board.isEmptyLocation(i, j)){
                    //can drap a chess
                    for(var k = 0; k < diffWayToWin; k++){

                        wayToWin = waysToWin[i][j][k];

                        if(wayToWin && whiteWinsPossible[k]){
                            connectedType = checkConnectedType(wayToWin, PIECES_TYPE.WHITE, whiteWins[k]);

                            if(whiteWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    whiteScore[i][j] += 15;
                                }else{
                                    whiteScore[i][j] += 50;
                                }
                            }else if(whiteWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    whiteScore[i][j] += 230;
                                }else{
                                    whiteScore[i][j] += 300;
                                }

                            }else if(whiteWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    whiteScore[i][j] += 600;
                                }else{
                                    whiteScore[i][j] += 1200;
                                }
                            }else if(whiteWins[k] == 4){
                                whiteScore[i][j] += 2100;
                            }
                        }

                        if(wayToWin && blackWinsPossible[k]){
                            connectedType = checkConnectedType(wayToWin, PIECES_TYPE.BLACK, blackWins[k]);
                            if(blackWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    blackScore[i][j] += 10;
                                }else{
                                    blackScore[i][j] += 40;
                                }
                            }else if(blackWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    blackScore[i][j] += 80;
                                }else{
                                    blackScore[i][j] += 200;
                                }
                            }else if(blackWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    blackScore[i][j] += 240;
                                }else{
                                    blackScore[i][j] += 480;
                                }
                            }else if(blackWins[k] == 4){
                                blackScore[i][j] += 3000;
                            }
                        }
                    }

                    if(blackScore[i][j] > maxScore){
                        maxScore = blackScore[i][j];
                        m = i;
                        n = j;
                    } else if (blackScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && whiteScore[i][j] > whiteScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }

                    if(whiteScore[i][j] > maxScore){
                        maxScore = whiteScore[i][j];
                        m = i;
                        n = j;
                    }else if (whiteScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && blackScore[i][j] > blackScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }
                }
            }
        }

        console.log("row: " + m + ", col:" + n + " maxScore:" + maxScore);

        return {"row":m, "col":n, "score": maxScore};
    };

    function judgement(board) {

        var maxScore = 0;
        var score    = [];

        for (var i = 0; i < size; i++){
            score[i] = [];
            for(var j = 0; j < size; j++){
                score[i][j] = 0;
            }
        }

        var winsPossible;
        var wins;

        if(isWhiteTurn()){
            winsPossible = whiteWinsPossible;
            wins = whiteWins;
        }else{
            winsPossible = blackWinsPossible;
            wins = blackWins;
        }

        var x;
        var y;

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                for(var k = 0; k < diffWayToWin; k++){

                    if(waysToWin[i][j][k] && winsPossible[k]){
                        if(wins[k] == 1){
                            score[i][j] += 1;
                        }else if(wins[k] == 2){
                            score[i][j] += 10;
                        }else if(wins[k] == 3){
                            score[i][j] += 100;
                        }else if(wins[k] == 4){
                            score[i][j] += 10000;
                        }
                    }

                    if(score[i][j] > maxScore){
                        maxScore = score[i][j];
                        x = i;
                        y = j;
                    }
                }
            }
        }

        userInterface.showGrade(x, y, maxScore);
        console.log("Judgement maxScore:" + maxScore);

        return maxScore;
    }

    function oneStep(board, row, col) {
        if(isWhiteTurn()){

            if(DEBUG){
                userInterface.drawChessAtPosition(row, col, "white");
            }

            board.setPiece(row, col, PIECES_TYPE.WHITE);
        }else{

            if(DEBUG){
                userInterface.drawChessAtPosition(row, col, "black");
            }

            board.setPiece(row, col, PIECES_TYPE.BLACK);
        }

        envPointer.updateStatisticArray(row, col, whoseTurn);

        swithTurns();

        return board;
    }

    var undoTimes = 0;
    function undoStep(board, row, col, whoseTurn) {
        undoTimes++;

        console.info("whoseTurn: " + whoseTurn);

        if (! board.isEmptyLocation(row, col)) {

            for (var k = 0; k < diffWayToWin; k++) {
                if (waysToWin[row][col][k]) {

                    if(whoseTurn == PIECES_TYPE.WHITE){

                        if(whiteWins[k] == 1){
                            blackWinsPossible[k] = true;
                        }
                        if(0 < whiteWins[k]){
                            whiteWins[k]--;
                        }

                    }else {
                        if(blackWins[k] == 1){
                            whiteWinsPossible[k] = true;
                        }
                        if(0 < blackWins[k]){
                            blackWins[k]--;
                        }
                    }
                }
            }

            if(DEBUG){
                userInterface.clearChessAtPosition(row, col);
            }
            board.setPiece(row, col, PIECES_TYPE.NONE);
        }

        swithTurns();
        return board;
    }

    this.backStep = function (board, row, col, whoseTurn) {
        if(whoseTurn == PIECES_TYPE.WHITE){
            whoseTurn = PIECES_TYPE.BLACK;
        }else{
            whoseTurn = PIECES_TYPE.WHITE;
        }
        undoStep(board, row, col, whoseTurn);
    };

    var updateTimes = 0;
    this.updateStatisticArray = function (row, col, whoseTurn) {

        updateTimes++;
        if(whoseTurn == PIECES_TYPE.WHITE){

            for(var k = 0; k < diffWayToWin; k++){
                wayToWin = waysToWin[row][col][k];
                if( wayToWin ){
                    whiteWins[k]++;
                    blackWinsPossible[k] = false;
                }
            }

        }else{

            for(var k = 0; k < diffWayToWin; k++){
                if(waysToWin[row][col][k]){
                    blackWins[k]++;
                    whiteWinsPossible[k] = false;
                }
            }
        }

    };

    /**
     * 是否是平局
     */
    this.isGameTie = function () {
        for(var k = 0; k < diffWayToWin; k++){
            if(whiteWinsPossible[k] != false || blackWinsPossible[k] != false){
                return false;
            }
        }

        return true;
    };

    this.isGameOver = function () {

        if(this.isGameTie()){
            return true;
        }

        for(var k = 0; k < diffWayToWin; k++){
            if(whiteWins[k] == 5){
                winner = "User";
                gameOver = true;
                return true;
            }

            if(blackWins[k] == 5){
                winner = "black";
                gameOver = true;
                return true;
            }
        }

        return false;
    };

    /**
     * Search
     * TODO implement min-max search
     */
    function generateAllPossibleSteps(board) {

        var steps = [];

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){
                if(board.isEmptyLocation(i, j)){
                    steps.push({"row": i, "col":j});
                }
            }
        }

        return steps;
    }

    var bestStep;
    var MAX_DEPTH = 3;

    /**
     * Min-Max Search
     * @param board
     * @param depth
     * @param maximizingPlayer
     * @returns {*}
     * @constructor
     */
    var MinMaxSearch = function (board, depth, maximizingPlayer) {
        var bestValue;

        if(depth <= 0){
            bestValue = judgement(board);
            return bestValue;
        }

        if(maximizingPlayer){
            bestValue = -100000;

            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                value = MinMaxSearch(board, depth - 1, false);
                board = undoStep(board, steps[i].row, steps[i].col);

                if(bestValue < value){
                    bestValue = value;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }
            }

        } else{
            bestValue = +100000;
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                value = MinMaxSearch(board, depth - 1, true);
                board = undoStep(board, steps[i].row, steps[i].col);

                if(bestValue > value){
                    bestValue = value;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }
            }
        }

        return bestValue;
    };

    // function MinMaxSearch (player, board) {
    //
    //     var value;
    //
    //     // 后手一开始必须要防守，所以一开始先调用minSearch
    //     if(player == PIECES_TYPE.BLACK){
    //         value = _minSearch(board, MAX_DEPTH);
    //     }else{
    //         value = _maxSearch(board, MAX_DEPTH);
    //     }
    //
    //     return value;
    // }

    function AlphaBetaSearch(board, depth, alpha, beta, maximizingPlayer) {

        var player = getWhoseTurn();

        console.log("Player: " + player + " depth: " + depth);

        var value;

        if(depth <= 0){
            value = judgement(board);
            return value;
        }
        var steps = generateAllPossibleSteps(board);

        if(maximizingPlayer){
            value = -100000; // -Infinity
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                value = Math.max(value, AlphaBetaSearch(board, depth - 1, alpha, beta, false));

                board = undoStep(board, steps[i].row, steps[i].col);

                //剪枝
                alpha = Math.max(alpha, value);

                if(beta <= alpha){
                    break;
                }
            }
        } else{
            value = +100000; // +Infinity

            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                value = Math.min(value, AlphaBetaSearch(board, depth - 1, alpha, beta, true));

                board = undoStep(board, steps[i].row, steps[i].col);


                //beta = Math.min(value, beta);

                if(value < beta){
                    beta = value;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }

                if(beta <= alpha){
                    break;
                }
            }


        }

        return value;
    }

    this.takeStep = function(player, board){

        whoseTurn = PIECES_TYPE.BLACK;

        MinMaxSearch(board, MAX_DEPTH, false);

        // debugger;
        // if(whoseTurn == PIECES_TYPE.BLACK){
        //     AlphaBetaSearch(board, MAX_DEPTH, -100000, +100000, false);
        // }else{
        //     AlphaBetaSearch(board, MAX_DEPTH, -100000, +100000, true);
        // }

        console.info("updateTimes: "+ updateTimes + " undoTimes: " + undoTimes);
        return bestStep;
    };



    this.init = function() {

        _init_waysToWin();
        _init_statisticPossibleToWin();
    };

    this.init();
}