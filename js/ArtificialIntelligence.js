/**
 * Created by Administrator on 2016/12/2.
 */

function ArtificialIntelligence(boardSize, UI) {

    var DEBUG = true;
    var userInterface = UI;

    var size = boardSize;
    var envPointer = this;

    var whoesTurn = PIECES_TYPE.BLACK;
    function isWhiteTurn() {
        return whoesTurn == PIECES_TYPE.WHITE;
    }

    function isBlackTurn() {
        return whoesTurn == PIECES_TYPE.BLACK;
    }

    function swithTurns() {
        if(whoesTurn == PIECES_TYPE.WHITE){
            whoesTurn = PIECES_TYPE.BLACK;
        }else{
            whoesTurn = PIECES_TYPE.WHITE;
        }
    }

    function getWhoseTurn() {
        return whoesTurn;
    }

    var diffWayToWin = 0;
    var waysToWin    = [];

    function _init_waysToWin() {

        diffWayToWin = 0;

        for(var i = 0; i < size; i++){
            waysToWin[i] = [];
            for(var j = 0; j < size; j++){
                waysToWin[i][j] = [];
            }
        }

        function setWayToWin(i, m, j, n) {

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

                waysToWin[x][y][diffWayToWin] = true;
            }
            diffWayToWin++;
        }

        for(var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                setWayToWin(i, -1, j, +1);
                setWayToWin(i,  0, j, +1);
                setWayToWin(i, +1, j, +1);
                setWayToWin(i, +1, j,  0);
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
                        if(waysToWin[i][j][k] && whiteWinsPossible[k]){
                            if(whiteWins[k] == 1){
                                whiteScore[i][j] += 1;
                            }else if(whiteWins[k] == 2){
                                whiteScore[i][j] += 9;
                            }else if(whiteWins[k] == 3){
                                whiteScore[i][j] += 73;
                            }else if(whiteWins[k] == 4){
                                whiteScore[i][j] += 1000;
                            }
                        }

                        if(waysToWin[i][j][k] && blackWinsPossible[k]){
                            if(blackWins[k] == 1){
                                blackScore[i][j] += 1;
                            }else if(blackWins[k] == 2){
                                blackScore[i][j] += 10;
                            }else if(blackWins[k] == 3){
                                blackScore[i][j] += 60;
                            }else if(blackWins[k] == 4){
                                blackScore[i][j] += 2000;
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

                userInterface.showGrade(i, j, maxScore);
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
                    }
                }
            }
        }

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

        envPointer.updateStatisticArray(row, col, whoesTurn);

        swithTurns();

        return board;
    }

    var undoTimes = 0;
    function undoStep(board, row, col) {
        undoTimes++;

        console.info("whoseTurn: " + whoesTurn);

        if (! board.isEmptyLocation(row, col)) {

            for (var k = 0; k < diffWayToWin; k++) {
                if (waysToWin[row][col][k]) {

                    if(isWhiteTurn()){

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

    this.backStep = function (board, row, col) {
        undoStep(board, row, col);
    };

    var updateTimes = 0;
    this.updateStatisticArray = function (row, col, whoseTurn) {

        updateTimes++;
        if(whoseTurn == PIECES_TYPE.WHITE){

            for(var k = 0; k < diffWayToWin; k++){
                if(waysToWin[row][col][k] ){
                    whiteWins[k]++;
                    blackWinsPossible[k] = false;
                }

                if(blackWins[k] == 5){
                    debugger;
                }
            }

        }else{

            for(var k = 0; k < diffWayToWin; k++){
                if(waysToWin[row][col][k]){
                    blackWins[k]++;
                    whiteWinsPossible[k] = false;
                }

                if(blackWins[k] == 4){
                    debugger;
                }

                if(blackWins[k] == 5){
                    debugger;
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
     * Min Search
     * @param board
     * @param depth
     * @returns {number}
     * @private
     */
    var _minSearch = function (board, depth) {
        var retValue;
        var bestValue = +10000;

        if(depth <= 0){
            bestValue = judgement(board);
            return bestValue;
        }else{
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                retValue = _maxSearch(board, depth - 1);

                if(bestValue > retValue){
                    bestValue = retValue;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }

                board = undoStep(board, steps[i].row, steps[i].col);
            }

        }

        return bestValue;
    };

    /**
     *
     * @param board
     * @param depth
     * @returns {number}
     * @private
     */
    var _maxSearch = function (board, depth) {
        var retValue;
        var bestValue = -10000;

        if(depth <= 0){
            bestValue = judgement(board);
            return bestValue;
        }else{
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                retValue = _minSearch(board, depth - 1);

                if(bestValue < retValue){
                    bestValue = retValue;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }

                board = undoStep(board, steps[i].row, steps[i].col);
            }
        }

        return bestValue;
    };

    function MinMaxSearch (player, board) {

        var value;

        // 后手一开始必须要防守，所以一开始先调用minSearch
        if(player == PIECES_TYPE.BLACK){
            value = _minSearch(board, MAX_DEPTH);
        }else{
            value = _maxSearch(board, MAX_DEPTH);
        }

        return value;
    }

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

        MinMaxSearch(player, board);

        // debugger;
        // if(whoesTurn == PIECES_TYPE.BLACK){
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