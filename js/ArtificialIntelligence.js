/**
 * Author   : EOF
 * File     : ArtificialIntelligence.js
 * Date     : 2016/12/2.
 */


var ConnectedType = {
    None       :0,
    SleepOne   :1,
    SleepTwo   :2,
    SleepThree :3,
    SleepFour  :4,
    WakedOne   :5, // --?*???--, --??*??--,--???*?--
    WakedTwo   :6, // --?**? --, --??**?--
    WakedThree :7, // --?***?--,
    WakedFour  :8, // --?****?--
    Five       :9  // Game Over
};

var GradeTable = {
    None           :0,

    // Grade results for current player
    Cur_SleepOne   :15,
    Cur_SleepTwo   :100,
    Cur_SleepThree :600,
    Cur_SleepFour  :1600,
    Cur_WakedOne   :50,
    Cur_WakedTwo   :230,
    Cur_WakedThree :1600,
    Cur_WakedFour  :100000,

    // Grade results for opponent player
    Opp_SleepOne   :10,
    Opp_SleepTwo   :80,
    Opp_SleepThree :480,
    Opp_SleepFour  :1800,
    Opp_WakedOne   :40,
    Opp_WakedTwo   :200,
    Opp_WakedThree :1500,
    Opp_WakedFour  :100000,

    Five           :1000000  // Game Over

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

    function getCurrentPlayer() {
        return whoseTurn;
    }

    function getOpponentPlayer() {
        if(isWhiteTurn()){
            return PIECES_TYPE.BLACK;
        }else{
            return PIECES_TYPE.WHITE;
        }
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

    function isFive(line, pieceType) {
        if( (line.length == 5) && (line[0] == pieceType && line[1] == pieceType &&
            line[2] == pieceType &&line[3] == pieceType && line[4] == pieceType) ){
            return true;
        }else{
            return false;
        }
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

        if(count != 4){
            line = getPiecesOnALine(startPoint, direction, 5);
        }else{
            line = getPiecesOnALine(startPoint, direction, 6);
        }

        if(count == 5 && isFive(line, pieceType)){
            return ConnectedType.Five;
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

        console.error("Error! in checkConnectedType");
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

        var action = "";

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
                                    blackScore[i][j] += 680;
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
                        action = "attack";
                    } else if (blackScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && whiteScore[i][j] > whiteScore[m][n]){
                            m = i;
                            n = j;
                            action = "defense";
                        }
                    }

                    if(whiteScore[i][j] > maxScore){
                        maxScore = whiteScore[i][j];
                        m = i;
                        n = j;
                        action = "defense";
                    }else if (whiteScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && blackScore[i][j] > blackScore[m][n]){
                            m = i;
                            n = j;
                            action = "attack";
                        }
                    }
                }
            }
        }

        console.log("row: " + m + ", col:" + n + " maxScore:" + maxScore + " action: " + action);

        return {"row":m, "col":n, "score": maxScore};
    };

    function judgement(board) {

        var currentPlayer = getCurrentPlayer();
        var opponentPlayer= getOpponentPlayer();

        var maxScore_CurrentPlayer = 0;
        var maxScore_OpponentPlayer= 0;
        var currentPlayerScore    = [];
        var opponentPlayerScore   = [];

        for (var i = 0; i < size; i++){
            currentPlayerScore[i]  = [];
            opponentPlayerScore[i] = [];

            for(var j = 0; j < size; j++){
                currentPlayerScore[i][j]  = 0;
                opponentPlayerScore[i][j] = 0;
            }
        }

        var currentPlayerWinsPossible;
        var currentPlayerWins;
        var opponentPlayerWinsPossible;
        var opponentPlayerWins;

        if(isWhiteTurn()){
            currentPlayerWinsPossible  = whiteWinsPossible;
            currentPlayerWins          = whiteWins;

            opponentPlayerWinsPossible = blackWinsPossible;
            opponentPlayerWins         = blackWins;
        }else{
            currentPlayerWinsPossible  = blackWinsPossible;
            currentPlayerWins          = blackWins;

            opponentPlayerWinsPossible = whiteWinsPossible;
            opponentPlayerWins         = whiteWins;
        }

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                if(board.getPiece(i, j) == whoseTurn){

                    for(var k = 0; k < diffWayToWin; k++){

                        wayToWin = waysToWin[i][j][k];

                        if(wayToWin && currentPlayerWinsPossible[k]){

                            connectedType = checkConnectedType(wayToWin, currentPlayer, currentPlayerWins[k]);

                            if(currentPlayerWins[k] == 5){

                                currentPlayerScore[i][j] += GradeTable.Five;
                                maxScore_CurrentPlayer = currentPlayerScore[i][j];
                                break;
                            } else if(currentPlayerWins[k] == 4){

                                if(connectedType == ConnectedType.SleepFour){
                                    currentPlayerScore[i][j] += GradeTable.Cur_SleepFour;
                                }else{
                                    currentPlayerScore[i][j] += GradeTable.Cur_WakedFour;
                                }

                            } else if(currentPlayerWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    currentPlayerScore[i][j] += GradeTable.Cur_SleepThree;
                                }else{
                                    currentPlayerScore[i][j] += GradeTable.Cur_WakedThree;
                                }
                            } else if(currentPlayerWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    currentPlayerScore[i][j] += GradeTable.Cur_SleepTwo;
                                }else{
                                    currentPlayerScore[i][j] += GradeTable.Cur_WakedTwo;
                                }
                            } else if(currentPlayerWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    currentPlayerScore[i][j] += GradeTable.Cur_SleepOne;
                                }else{
                                    currentPlayerScore[i][j] += GradeTable.Cur_WakedOne;
                                }
                            }
                        }

                        if(currentPlayerScore[i][j] > maxScore_CurrentPlayer){
                            maxScore_CurrentPlayer = currentPlayerScore[i][j];
                        }
                    }
                }else if (! board.isEmptyLocation(i, j)){
                    for(var k = 0; k < diffWayToWin; k++){

                        wayToWin = waysToWin[i][j][k];

                        if(wayToWin && opponentPlayerWinsPossible[k]){

                            connectedType = checkConnectedType(wayToWin, opponentPlayer, opponentPlayerWins[k]);

                            if(opponentPlayerWins[k] == 5){

                                opponentPlayerScore[i][j] += GradeTable.Five;
                                maxScore_OpponentPlayer = opponentPlayerScore[i][j];
                                break;

                            }else if(opponentPlayerWins[k] == 4){

                                if(connectedType == ConnectedType.SleepFour){
                                    opponentPlayerScore[i][j] += GradeTable.Opp_SleepFour;
                                }else{
                                    opponentPlayerScore[i][j] += GradeTable.Opp_WakedFour;
                                }

                            }else if(opponentPlayerWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    opponentPlayerScore[i][j] += GradeTable.Opp_SleepThree;
                                }else{
                                    opponentPlayerScore[i][j] += GradeTable.Opp_WakedThree;
                                }
                            }else if(opponentPlayerWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    opponentPlayerScore[i][j] += GradeTable.Opp_SleepTwo;
                                }else{
                                    opponentPlayerScore[i][j] += GradeTable.Opp_WakedTwo;
                                }

                            }else if(opponentPlayerWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    opponentPlayerScore[i][j] += GradeTable.Opp_SleepOne;
                                }else{
                                    opponentPlayerScore[i][j] += GradeTable.Opp_WakedOne;
                                }
                            }
                        }

                        if(opponentPlayerScore[i][j] > maxScore_OpponentPlayer){
                            maxScore_OpponentPlayer = opponentPlayerScore[i][j];
                        }
                    }
                }
            }
        }

        return maxScore_CurrentPlayer - maxScore_OpponentPlayer;
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

        //console.info("whoseTurn: " + whoseTurn);

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
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

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
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());
                if(bestValue > value) {
                    bestValue = value;
                    if (depth == MAX_DEPTH) {
                        bestStep = steps[i];
                    }
                }

            }
        }

        return bestValue;
    };


    function AlphaBetaSearch(board, depth, alpha, beta, maximizingPlayer) {

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
                value = AlphaBetaSearch(board, depth - 1, alpha, beta, false);
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue < value){
                    bestValue = value;
                    if(depth == MAX_DEPTH){
                        bestStep = steps[i];
                    }
                }

                //剪枝
                alpha = Math.max(alpha, value);

                if(beta <= alpha){
                    break;
                }
            }

        } else{

            bestValue = +100000;
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                value = MinMaxSearch(board, depth - 1, alpha, beta, true);
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());
                if(bestValue > value) {
                    bestValue = value;
                    if (depth == MAX_DEPTH) {
                        bestStep = steps[i];
                    }
                }

                beta = Math.min(value, beta);

                if(beta <= alpha){
                    break;
                }

            }
        }

        return bestValue;
    }

    this.takeStep = function(player, board){

        whoseTurn = PIECES_TYPE.BLACK;


        // MinMaxSearch(board, MAX_DEPTH, false);

        if(whoseTurn == PIECES_TYPE.BLACK){

            value = judgement(board);
            if(value > 1000) {

                MAX_DEPTH = 1; // Try to find killer threat
                AlphaBetaSearch(board, MAX_DEPTH, -100000, +100000, false);
            }else{

                MAX_DEPTH = 3;
                AlphaBetaSearch(board, MAX_DEPTH, -100000, +100000, false);
            }

        }else{
            /*
            * Only called when AI to AI
            * */
            AlphaBetaSearch(board, MAX_DEPTH, -100000, +100000, true);
        }

        return bestStep;
    };



    this.init = function() {

        _init_waysToWin();
        _init_statisticPossibleToWin();
    };

    this.init();
}