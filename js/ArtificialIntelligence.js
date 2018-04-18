/**
    MIT License

    Copyright (c) 2017 EOF

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

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
    Cur_SleepOne   :1,
    Cur_SleepTwo   :10,
    Cur_SleepThree :100,
    Cur_SleepFour  :3200,
    Cur_WakedOne   :10,
    Cur_WakedTwo   :60,
    Cur_WakedThree :1700,
    Cur_WakedFour  :80000,

    // Grade results for opponent player
    Opp_SleepOne   :1,
    Opp_SleepTwo   :10,
    Opp_SleepThree :100,
    Opp_SleepFour  :3200,
    Opp_WakedOne   :8,
    Opp_WakedTwo   :40,
    Opp_WakedThree :1700,
    Opp_WakedFour  :80000,

    Five           :1000000  // Game Over

};

var Direction = {
    Slash     : {"row": -1, "col": +1}, // "/"
    BackSlash : {"row": +1, "col": +1}, // "\"
    Horizon   : {"row":  0, "col": +1}, // "-"
    Vertical  : {"row": +1, "col":  0}  // "|"
};

function ArtificialIntelligence(boardSize) {

    var DEBUG = false;

    var size = boardSize;
    var envPointer = this;

    var cacheTable = [];

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
        if(line.length != 6){
            return false
        }

        var condition1 = (line[1] == pieceType && line[2] == pieceType && line[3] == pieceType);

        var condition2 = (line[2] == pieceType && line[3] == pieceType && line[4] == pieceType);

        var condition3 = (line[0] == PIECES_TYPE.NONE && line[1] == pieceType && line[2] == pieceType &&
                          line[3] == PIECES_TYPE.NONE && line[4] == pieceType && line[5] == PIECES_TYPE.NONE);

        var condition4 = (line[0] == PIECES_TYPE.NONE && line[1] == pieceType && line[2] == PIECES_TYPE.NONE &&
                          line[3] == pieceType && line[4] == pieceType && line[5] == PIECES_TYPE.NONE);

        if(condition1 || condition2 || condition3 || condition4){
            return true;
        }

        return false;
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
     * @param count      对应已经  满足该赢法条件的棋子数量
     */
    function checkConnectedType(wayToWin, pieceType, count) {

        if(count == 0){
            return ConnectedType.None;
        }

        var startPoint = wayToWin.startPoint;
        var direction  = wayToWin.direction;
        var line;

        if(count != 4 && count != 3){
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

        var lowBoundary = board.getLowBoundary();
        var upBoundary  = board.getUpBoundary();

        for(var i = lowBoundary.row; i <= upBoundary.row; i++){
            for(var j = lowBoundary.col; j <= upBoundary.col; j++){

                if(board.getPiece(i, j) == whoseTurn){

                    for(var k = 0; k < diffWayToWin; k++){

                        wayToWin = waysToWin[i][j][k];

                        if(wayToWin && currentPlayerWinsPossible[k]){

                            connectedType = checkConnectedType(wayToWin, currentPlayer, currentPlayerWins[k]);

                            if(currentPlayerWins[k] == 5){
                                maxScore_CurrentPlayer += GradeTable.Five;
                            } else if(currentPlayerWins[k] == 4){

                                if(connectedType == ConnectedType.SleepFour){
                                    maxScore_CurrentPlayer += GradeTable.Cur_SleepFour;
                                }else{
                                    maxScore_CurrentPlayer += GradeTable.Cur_WakdFour;
                                }

                            } else if(currentPlayerWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    maxScore_CurrentPlayer += GradeTable.Cur_SleepThree;
                                }else{
                                    maxScore_CurrentPlayer += GradeTable.Cur_WakedThree;
                                }
                            } else if(currentPlayerWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    maxScore_CurrentPlayer += GradeTable.Cur_SleepTwo;
                                }else{
                                    maxScore_CurrentPlayer += GradeTable.Cur_WakedTwo;
                                }
                            } else if(currentPlayerWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    maxScore_CurrentPlayer += GradeTable.Cur_SleepOne;
                                }else{
                                    maxScore_CurrentPlayer += GradeTable.Cur_WakedOne;
                                }
                            }
                        }
                    }
                }else if (! board.isEmptyLocation(i, j)){
                    for(var k = 0; k < diffWayToWin; k++){

                        wayToWin = waysToWin[i][j][k];

                        if(wayToWin && opponentPlayerWinsPossible[k]){

                            connectedType = checkConnectedType(wayToWin, opponentPlayer, opponentPlayerWins[k]);

                            if(opponentPlayerWins[k] == 5){

                                maxScore_OpponentPlayer += GradeTable.Five;
                            }else if(opponentPlayerWins[k] == 4){

                                if(connectedType == ConnectedType.SleepFour){
                                    maxScore_OpponentPlayer += GradeTable.Opp_SleepFour;
                                }else{
                                    maxScore_OpponentPlayer += GradeTable.Opp_WakedFour;
                                   
                                }

                            }else if(opponentPlayerWins[k] == 3){
                                if(connectedType == ConnectedType.SleepThree){
                                    maxScore_OpponentPlayer += GradeTable.Opp_SleepThree;
                                }else{
                                    maxScore_OpponentPlayer += GradeTable.Opp_WakedThree;
                                }
                            }else if(opponentPlayerWins[k] == 2){
                                if(connectedType == ConnectedType.SleepTwo){
                                    maxScore_OpponentPlayer += GradeTable.Opp_SleepTwo;
                                }else{
                                    maxScore_OpponentPlayer += GradeTable.Opp_WakedTwo;
                                }

                            }else if(opponentPlayerWins[k] == 1){
                                if(connectedType == ConnectedType.SleepOne){
                                    maxScore_OpponentPlayer += GradeTable.Opp_SleepOne;
                                }else{
                                    maxScore_OpponentPlayer += GradeTable.Opp_WakedOne;
                                }
                            }
                        }

                     
                    }
                }
            }
        }

        return maxScore_CurrentPlayer - maxScore_OpponentPlayer;
    }

    function oneStep(board, row, col) {
        if(isWhiteTurn()){

            board.setPiece(row, col, PIECES_TYPE.WHITE);
        }else{

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

    function closeToAnyoneExistedPiece(row, col) {

        // if( !board.isEmptyLocation(row - 1, col - 1) ||
        //     !board.isEmptyLocation(row - 1, col)     ||
        //     !board.isEmptyLocation(row - 1, col + 1) ||
        //     !board.isEmptyLocation(row    , col - 1) ||
        //
        //     !board.isEmptyLocation(row    , col + 1) ||
        //     !board.isEmptyLocation(row + 1, col - 1) ||
        //     !board.isEmptyLocation(row + 1, col)     ||
        //     !board.isEmptyLocation(row + 1, col + 1)
        // ){
        //     return true;
        // }else{
        //     return false;
        // }

        var lowBoundary = board.getLowBoundary();
        var upBoundary  = board.getUpBoundary();
        var distance = 0;

        for(var i = lowBoundary.row; i <= upBoundary.row; i++){
            for(var j = lowBoundary.col; j <= upBoundary.col; j++){
                if(!board.isEmptyLocation(i, j)){

                    distance = (row - i) * (row - i) + (col - j) * (col - j);

                    /*
                    * 这里必须设置为3不能跳过距离平方等于2的情况。
                    * 因为距离等于2的情况是对角线。
                    * */
                    if(distance >= 4)
                    {
                        continue;
                    }else{
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function generateAllPossibleSteps(board) {

        var steps = [];

        var lowBoundary = board.getLowBoundary();
        var upBoundary  = board.getUpBoundary();

        for(var i = lowBoundary.row; i <= upBoundary.row; i++){
            for(var j = lowBoundary.col; j <= upBoundary.col; j++){
                if(board.isEmptyLocation(i, j) && closeToAnyoneExistedPiece(i, j)){
                    steps.push({"row": i, "col":j});
                }
            }
        }

        return steps;
    }

    function generateSortedOptionalSteps(board) {
        var steps = generateAllPossibleSteps(board);

        var alpha = -100000;
        var beta  = +100000;
        for(var i = 0; i < steps.length; i++){

            board = oneStep(board, steps[i].row, steps[i].col);

            result = AlphaBetaSearch(board, 1, alpha, beta, false);

            value = result.bestValue;

            board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

            steps[i].score = value;
        }

        /*
        * Sort the steps array by score
        * */

        for(var i = 0; i < steps.length; i++){
            for(var j = i + 1; j < steps.length; j++){
                if(steps[i].score < steps[j].score){
                    tmp = steps[i];
                    steps[i] = steps[j];
                    steps[j] = tmp;
                }
            }
        }

        var savedStep = 2;
        if(steps.length > savedStep)
        {
            steps = steps.slice(0, savedStep);
        }

        return steps;
    }

    var bestStep;
    var MAX_DEPTH = 5;

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
        var bestStep;

        if(depth <= 0){
            bestValue = judgement(board);
            return {"bestValue": bestValue, "bestStep": -1};
        }

        if(maximizingPlayer){

            bestValue = -1000000;
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                result= MinMaxSearch(board, depth - 1, false);
                value = result.bestValue;
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue < value){
                    bestValue = value;
                    bestStep = steps[i];
                }
            }

        } else{

            bestValue = +1000000;
            var steps = generateAllPossibleSteps(board);
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);
                result= MinMaxSearch(board, depth - 1, true);
                value = result.bestValue;
                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());
                if(bestValue > value) {
                    bestValue = value;
                    bestStep = steps[i];
                }

            }
        }

        return {"bestValue": bestValue, "bestStep": bestStep};
    };



    function AlphaBetaSearch(board, depth, alpha, beta, maximizingPlayer) {

        var bestValue;
        var bestStep;

        if(depth <= 0){
            evaluationTimes++;
            var key = board.getHashValue();
            if(key in cacheTable){
                hitCacheTimes++;
                return {"bestValue": cacheTable[key], "bestStep":-1};
            }

            bestValue = judgement(board);

            cacheTable[key] = bestValue;

            return {"bestValue": bestValue, "bestStep":-1};
        }

        var steps = generateAllPossibleSteps(board);

        if(maximizingPlayer){

            bestValue = -1000000;
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                result = AlphaBetaSearch(board, depth - 1, alpha, beta, false);

                value = result.bestValue;

                hashKey = board.getHashValue();
                if(! (hashKey in cacheTable)){
                    cacheTable[hashKey] = value;
                }

                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue < value){
                    bestValue = value;
                    bestStep  = steps[i];
                }

                //剪枝
                alpha = Math.max(alpha, value);

                if(beta <= alpha){
                    break;
                }
            }

        } else{

            bestValue = +1000000;
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                result = AlphaBetaSearch(board, depth - 1, alpha, beta, true);

                value = result.bestValue;

                hashKey = board.getHashValue();
                if(! (hashKey in cacheTable)){
                    cacheTable[hashKey] = value;
                }

                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue > value) {
                    bestValue = value;
                    bestStep  = steps[i];
                }

                beta = Math.min(value, beta);

                if(beta <= alpha){
                    break;
                }

            }
        }

        hashKey = board.getHashValue();
        if(! (hashKey in cacheTable)){
            cacheTable[hashKey] = value;
        }

        return {"bestValue": bestValue, "bestStep":bestStep};
    }


    var evaluationTimes = 0;
    var hitCacheTimes = 0;
    var curOffTimes = 0;
    function PrincipalVariationSearch(board, depth, alpha, beta, maximizingPlayer) {

        var bestValue;
        var bestStep;

        if(depth <= 0 || ( GradeTable.Cur_WakedThree <= (alpha - beta))){
            evaluationTimes++;
            var key = board.getHashValue();
            if(key in cacheTable){
                hitCacheTimes++;
                return {"bestValue": cacheTable[key], "bestStep":-1};
            }

            bestValue = judgement(board);

            cacheTable[key] = bestValue;

            return {"bestValue": bestValue, "bestStep":-1};
        }

        var steps = generateSortedOptionalSteps(board);

        if(maximizingPlayer){

            bestValue = -1000000;
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                hashKey = board.getHashValue();
                if(! (hashKey in cacheTable)){
                    value = cacheTable[hashKey];
                }else{
                    result = PrincipalVariationSearch(board, depth - 1, alpha, beta, false);
                    value = result.bestValue;
                    cacheTable[hashKey] = value;
                }

                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue < value){
                    bestValue = value;
                    bestStep  = steps[i];
                }

                //剪枝
                alpha = Math.max(alpha, value);

                if(beta <= alpha){
                    curOffTimes++;
                    break;
                }
            }

        } else{

            bestValue = +1000000;
            for(var i = 0; i < steps.length; i++){

                board = oneStep(board, steps[i].row, steps[i].col);

                hashKey = board.getHashValue();
                if(! (hashKey in cacheTable)){
                    value = cacheTable[hashKey];
                }else{
                    result = PrincipalVariationSearch(board, depth - 1, alpha, beta, true);
                    value = result.bestValue;
                    cacheTable[hashKey] = value;
                }

                board = undoStep(board, steps[i].row, steps[i].col, getOpponentPlayer());

                if(bestValue > value) {
                    bestValue = value;
                    bestStep  = steps[i];
                }

                beta = Math.min(value, beta);

                if(beta <= alpha){
                    curOffTimes++;
                    break;
                }

            }
        }

        hashKey = board.getHashValue();
        if(! (hashKey in cacheTable)){
            cacheTable[hashKey] = value;
        }

        return {"bestValue": bestValue, "bestStep":bestStep};
    }

    var stepsNum = 0;
    this.takeStep = function(player, board){

        evaluationTimes = 0;
        hitCacheTimes   = 0;
        curOffTimes     = 0;

        var startTime = performance.now();

        whoseTurn = PIECES_TYPE.BLACK;

        //var SearchFunc = AlphaBetaSearch;
        var SearchFunc = PrincipalVariationSearch;
        if(whoseTurn == PIECES_TYPE.BLACK){

            // Try to find killer threat
            result = SearchFunc(board, MAX_DEPTH, -100000, +100000, true);

            value = result.bestValue;

            if(Math.abs(value) > (GradeTable.Cur_WakedThree - GradeTable.Cur_WakedTwo)) {
                bestStep = result.bestStep;
            }else{

                MAX_DEPTH = 3;

                result = SearchFunc(board, MAX_DEPTH, -100000, +100000, false);
                bestStep = result.bestStep;
            }

        }else{
            /*
            * Only called when AI to AI
            * */
            SearchFunc(board, MAX_DEPTH, -100000, +100000, true);
        }

        stepsNum++;
        console.info("Evaluation Times: " + evaluationTimes + " Hit Cache Times :" + hitCacheTimes);

        var endTime = performance.now();
        console.log("Call to AI takeSteps function took " + (endTime - startTime) + " milliseconds.");
        console.log("Cut Branches: "+ curOffTimes);
        return bestStep;
    };
    
    this.init = function() {

        _init_waysToWin();
        _init_statisticPossibleToWin();
    };

    this.init();
}