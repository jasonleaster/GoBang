/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/19.
 */

var PIECES_TYPE = { NONE  : 0, WHITE : 1, BLACK : 2};

function Board(size) {
    var _size  = size;
    var _chessBoard = [];
    var width  = _size;
    var height = _size;

    /*
    * Private Methods
    * */

    /**
     * Clean the board and set all slot into none;
     */
    function cleanBoard() {
        _chessBoard = [];
        for(var i = 0; i < size; i++){
            _chessBoard[i] = [];
            for(var j = 0; j < size; j++){
                _chessBoard[i][j] = PIECES_TYPE.NONE;
            }
        }
    }

    /**
     * Check the validation of index.
     *
     * @param row
     * @param col
     * @returns {boolean}
     */
    function legalIndex(row, col) {
        if(row < 0 || col < 0 ||
            row > size || col > size){
            return false;
        }

        return true;
    }

    /**
     * Private Methods
     */

    /**
     * Determine whether there have a piece.
     *
     * @param row
     * @param col
     * @returns {boolean}
     */
    this.isEmptyLocation = function (row, col) {

        if(!legalIndex()){
            return;
        }

        return _chessBoard[row][col] == PIECES_TYPE.NONE ;
    };

    this.setPiece = function (row, col, piece) {
        if(!legalIndex(row, col)){
            return;
        }
        _chessBoard[row][col] = piece;
    };

    this.getPiece = function (row, col) {
        if(!legalIndex(row, col)){
            return;
        }
        return _chessBoard[row][col];
    };

    this.getSize = function () {
        return _size;
    };

    this.Init = function (){
        cleanBoard();
    };

    this.Init();
}

var board = new Board(5);

var GoBang = function (board) {

    var chessBoard = board;

    var size = board.getSize();

    var winner;  // Value belongs into {PIECE}
    var gameOver = false;

    var whoesTurn = PIECES_TYPE.WHITE;
    function isPlayerTurn() {
        return whoesTurn == PIECES_TYPE.WHITE;
    }

    var userInerface = new UI(size);
    var historySteps = new HistoryStep();

    function legalIndex(row, col) {
        if(row < 0 || col < 0 ||
            row > size || col > size){
            return false;
        }

        return true;
    }
    
    /*--------------------------------------------------------------------*/
    //AI
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

    var myWins = [];
    var AIWins = [];

    var myWinsPossible = [];
    var AIWinsPossible = [];

    function _init_statisticPossibleToWin() {
        for(var k = 0; k < diffWayToWin; k++){
            myWins[k] = 0;
            AIWins[k] = 0;

            myWinsPossible[k] = true;
            AIWinsPossible[k] = true;
        }
    }

    function init_AI() {

        _init_waysToWin();
        _init_statisticPossibleToWin();
    }

    // public method
    this.start = function() {

        userInerface = new UI(size);
        historySteps = new HistoryStep();

        userInerface.reset();

        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        whoesTurn = PIECES_TYPE.WHITE;

        init_AI();

        gameOver = false;
    };

    function clearChessAtPosition(row, col) {
        if(!legalIndex()){
            return ;
        }

        if (! board.isEmptyLocation(row, col)) {

            for (var k = 0; k < diffWayToWin; k++) {
                if (waysToWin[row][col][k]) {

                    /**
                     * 由于计算机在瞬间就完成下子
                     * 用户触发回退的按钮时，其实 whoseTurn已经变成用户了
                     * 但是还是要回退，这里其实是用户强迫电脑撤销下子，所以
                     * 这里isPlayerTurn() 取反，对应用户情况
                     * **/
                    if(!isPlayerTurn()){

                    	if(myWins[k] == 1){
                            AIWinsPossible[k] = true;
                        }
                        if(0 < myWins[k] && myWins[k] < 5){
                            myWins[k]--;
                        }

                    }else {
                    	if(AIWins[k] == 1){
                            myWinsPossible[k] = true;
                        }
                        if(0 < AIWins[k] && AIWins[k] < 5){
                            AIWins[k]--;
                        }
                    }
                }
            }

            board.setPiece(row, col, PIECES_TYPE.NONE);

            userInerface.clearChessAtPosition(row, col);
            userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
            userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        }
    }

    function swithTurns() {
        if(whoesTurn == PIECES_TYPE.WHITE){
            whoesTurn = PIECES_TYPE.BLACK;
        }else{
            whoesTurn = PIECES_TYPE.WHITE;
        }
    }

    function oneStep (row, col) {

        if(isPlayerTurn()){
            userInerface.drawChessAtPosition(row, col, "white");
            board.setPiece(row, col, PIECES_TYPE.WHITE);
        }else{
            userInerface.drawChessAtPosition(row, col, "black");
            board.setPiece(row, col, PIECES_TYPE.BLACK);
        }

        historySteps.saveStepToHistory(row, col, whoesTurn);

        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        userInerface.showLocation(row, col);

        swithTurns();
    }

    function _User_step(row, col) {
        
        if(board.isEmptyLocation(row, col)){
            oneStep(row, col);
        }else{
            return
        }

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[row][col][k]){
                myWins[k]++;
                AIWinsPossible[k] = false;
            }
        }
    }

    function User_Step(e) {

        if(!isPlayerTurn() || gameOver){
            return
        }

        historySteps.SyncHistoryToCurrentStep();

        var x = e.offsetX;
        var y = e.offsetY;

        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);


        _User_step(i, j);


        if(isGameOver()){
            if(isGameTie()){
                window.alert("Game Over! Tie!");
            }else {
                window.alert("Game Over the User win!");
            }

            return;
        }

        AI_Step();

        if(isGameOver()){
            if(isGameTie()){
                window.alert("Game Over! Tie!");
            }else {
                window.alert("Game Over the AI win!");
            }
            return;
        }
    }

    function _AI_Step(row, col) {

        if(!legalIndex()){
            return;
        }
        
        oneStep(row, col);

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[row][col][k]){//
                myWinsPossible[k] = false;
                AIWins[k]++;
            }
        }
    }

    /**
     * 局面评估
     * @returns {{row: number, col: number}}
     */
    function judgement() {

        //Evaluation for current situation.
        var myScore = [];
        var AIScore = [];

        var maxScore= 0;
        var m = -1, n = -1;//position where get the max score

        for (var i = 0; i < size; i++){
            myScore[i] = [];
            AIScore[i] = [];
            for(var j = 0; j < size; j++){
                myScore[i][j] = 0;
                AIScore[i][j] = 0;
            }
        }

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                if(board.isEmptyLocation(i, j)){
                    //can drap a chess
                    for(var k = 0; k < diffWayToWin; k++){
                        if(waysToWin[i][j][k] && myWinsPossible[k]){
                            if(myWins[k] == 1){
                                myScore[i][j] += 1;
                            }else if(myWins[k] == 2){
                                myScore[i][j] += 9;
                            }else if(myWins[k] == 3){
                                myScore[i][j] += 73;
                            }else if(myWins[k] == 4){
                                myScore[i][j] += 10000;
                            }
                        }

                        if(waysToWin[i][j][k] && AIWinsPossible[k]){
                            if(AIWins[k] == 1){
                                AIScore[i][j] += 1;
                            }else if(AIWins[k] == 2){
                                AIScore[i][j] += 10;
                            }else if(AIWins[k] == 3){
                                AIScore[i][j] += 60;
                            }else if(AIWins[k] == 4){
                                AIScore[i][j] += 20000;
                            }
                        }
                    }

                    if(AIScore[i][j] > maxScore){
                        maxScore = AIScore[i][j];
                        m = i;
                        n = j;
                    } else if (AIScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && myScore[i][j] > myScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }

                    if(myScore[i][j] > maxScore){
                        maxScore = myScore[i][j];
                        m = i;
                        n = j;
                    }else if (myScore[i][j] == maxScore){
                        if((m >= 0 && n >= 0 ) && AIScore[i][j] > AIScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }
                }
            }
        }

        console.log("row: " + m + ", col:" + n + " maxScore:" + maxScore);

        return {"row":m, "col":n, "score": maxScore};
    }

    function AI_Step() {

        debugger;
        if(isPlayerTurn() || gameOver){
            return
        }

        historySteps.SyncHistoryToCurrentStep();

        var step = judgement();
        //var step = Search.MinMaxSearch();

        _AI_Step(step.row, step.col);
    }

    /**
     * 是否是平局
     */
    function isGameTie() {
        for(var k = 0; k < diffWayToWin; k++){
            if(myWinsPossible[k] != false || AIWinsPossible[k] != false){
                return false;
            }
        }

        return true;
    }
    
    function isGameOver() {

        if(isGameTie()){
            return true;
        }

        for(var k = 0; k < diffWayToWin; k++){
            if(myWins[k] == 5){
                winner = "User";
                gameOver = true;
                return true;
            }

            if(AIWins[k] == 5){
                winner = "AI";
                gameOver = true;
                return true;
            }
        }

        return false;
    }

    this.backStep = function () {

        var step = historySteps.stepBack();

        clearChessAtPosition(step.row, step.col);

        swithTurns();
    };

    // this.nextStep = function () {
    //
    //     var step = historySteps.stepNext();
    //
    //     if(isPlayerTurn()){
    //         _User_step(step.row, step.col);
    //     }else {
    //         _AI_Step(step.row, step.col);
    //     }
    // };

    /*
    * Search
    * */
    var Search = (function () {
        debugger;
        var bestVal = 0;

        function generateAllPossibleSteps() {

            var steps = [];

            for(var i = 0; i < size; i++){
                for(var j = 0; j < size; j++){
                    if(isEmptyLocation(i, j)){
                        steps.push({"row": i, "col":j});
                    }
                }
            }

            return steps;
        }

        var _minSearch = function (depth) {

            if(depth <= 0){
                return judgement();
            }else{
                var steps = generateAllPossibleSteps();
                for(var i = 0; i < steps.length; i++){
                    _maxSearch(depth - 1);
                }
            }
        };

        var _maxSearch = function (depth) {
            if(depth <= 0){
                return judgement();
            }else{
                var steps = generateAllPossibleSteps();
                for(var i = 0; i < steps.length; i++){
                    _minSearch(depth - 1);
                }
            }
        };

        this.MinMaxSearch = function () {
            if(isPlayerTurn()){
                _maxSearch(3);
            }else{
                _minSearch(3);
            }

        };

    })();


    var btn     = userInerface.getBtnBackStep();
    btn.onclick = this.backStep;
    // Not Support yet
    // btn         = userInerface.getBtnNextStep();
    // btn.onclick = this.nextStep;

    userInerface.setUserClickFunc(User_Step);
    userInerface.setBtnRestart(this.start);
    userInerface.setBtnSaveTheBoard(historySteps.downloadAsJson);


    function isGameOver_Native() {

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                if(board.isEmptyLocation(i, j)){
                    continue;
                }

                var m = i;
                var n = j;
                var continueRepeats = 1;

                // TODO wait to refactor
                // Direction 1
                for(m = i, n = j; 0 <= m-1 && m-1 < size &&
                                  0 <= n+1 && n+1 < size; m--, n++){

                    if(board.getPiece(m, n) == board.getPiece(m -1, n + 1)){
                        continueRepeats++;

                        if(continueRepeats == 5){
                            return true; // game over
                        }

                    }else{
                        continueRepeats = 1;
                        break;
                    }
                }

                // Direction 2
                for(m = i, n = j; 0 <= m+1 && m+1 < size; m++){
                    if(board.getPiece(m, n) == board.getPiece(m+1, n)){
                        continueRepeats++;

                        if(continueRepeats == 5){
                            return true; // game over
                        }

                    }else{
                        continueRepeats = 1;
                        break;
                    }
                }

                // Direction 3
                for(m = i, n = j; 0 <= m+1 && m+1 < size &&
                                  0 <= n+1 && n+1 < size; n++, m++){
                    if(board.getPiece(m, n) == board.getPiece(m+1, n+1)){
                        continueRepeats++;

                        if(continueRepeats == 5){
                            return true; // game over
                        }

                    }else{
                        continueRepeats = 1;
                        break;
                    }
                }

                // Direction 4
                for(m = i, n = j; 0 <= n && n < size; n++){
                    if(board.getPiece(m, n) == board.getPiece(m, n+1)){
                        continueRepeats++;

                        if(continueRepeats == 5){
                            return true; // game over
                        }

                    }else{
                        continueRepeats = 1;
                        break;
                    }
                }


            }
        }

        return false;
    }


};


window.onload = function () {
    var game = new GoBang(board);
    game.start();
};