/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/19.
 */

var PIECES_TYPE = { NONE  : 0, WHITE : 1, BLACK : 2};

function Board(size) {
    var _size  = size;
    var _chessBoard = [];

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
     * Public Methods
     */

    /**
     * Check the validation of index.
     *
     * @param row
     * @param col
     * @returns {boolean}
     */
    this.legalIndex = function (row, col) {
        if(row < 0 || col < 0 ||
            row >= size || col >= size){
            return false;
        }

        return true;
    };

    /**
     * Determine whether there have a piece.
     *
     * @param row
     * @param col
     * @returns {boolean}
     */
    this.isEmptyLocation = function (row, col) {

        if(! this.legalIndex(row, col)){
            return;
        }

        return _chessBoard[row][col] == PIECES_TYPE.NONE ;
    };

    this.setPiece = function (row, col, piece) {
        if(! this.legalIndex(row, col)){
            return;
        }
        _chessBoard[row][col] = piece;
    };

    this.getPiece = function (row, col) {
        if(! this.legalIndex(row, col)){
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

var board = new Board(15);

var GoBang = function (board) {

    var size = board.getSize();

    var winner;  // Value belongs into {PIECE}
    var gameOver = false;

    var whoseTurn = PIECES_TYPE.WHITE;
    function isPlayerTurn() {
        return whoseTurn == PIECES_TYPE.WHITE;
    }

    var userInerface = new UI(size);
    var historySteps = new HistoryStep();
    var AI           = new ArtificialIntelligence(size, userInerface);
    

    // public method
    this.start = function() {

        board.Init();

        userInerface = new UI(size);
        historySteps = new HistoryStep(this);
        AI           = new ArtificialIntelligence(size, userInerface);

        userInerface.reset();
        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        var btn     = userInerface.getBtnBackStep();
        btn.onclick = this.backStep;
        // Not Support yet
        // btn         = userInerface.getBtnNextStep();
        // btn.onclick = this.nextStep;

        userInerface.setUserClickFunc(User_Step, this);
        userInerface.setBtnSaveTheBoard(historySteps.downloadAsJson, historySteps);
        userInerface.setBtnUploadHistorySteps(historySteps.uploadHistorySteps, historySteps);

        whoseTurn = PIECES_TYPE.WHITE;

        gameOver = false;
    };

    function clearChessAtPosition(row, col, whoseTurn) {

        if (! board.isEmptyLocation(row, col)) {

            AI.backStep(board, row, col, whoseTurn);

            board.setPiece(row, col, PIECES_TYPE.NONE);

            userInerface.clearChessAtPosition(row, col);
            userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
            userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        }
    }

    function swithTurns() {
        if(whoseTurn == PIECES_TYPE.WHITE){
            whoseTurn = PIECES_TYPE.BLACK;
        }else{
            whoseTurn = PIECES_TYPE.WHITE;
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

        historySteps.saveStepToHistory(row, col, whoseTurn);

        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        userInerface.showLocation(row, col);

    }

    function _stepAndUpdate(row, col) {
        
        if(board.isEmptyLocation(row, col)){
            oneStep(row, col);
        }else{
            return
        }

        AI.updateStatisticArray(row, col, whoseTurn);

        swithTurns();
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

        _stepAndUpdate(i, j);

        if(AI.isGameOver()){

            gameOver = true;
            if(AI.isGameTie()){
                window.alert("Game Over! Tie!");
            }else {
                window.alert("Game Over the User win!");
            }

            return;
        }

        AI_Step();

        if(AI.isGameOver()){
            gameOver = true;
            if(AI.isGameTie()){
                window.alert("Game Over! Tie!");
            }else {
                window.alert("Game Over the AI win!");
            }
            return;
        }
    }

    function AI_Step() {

        if(isPlayerTurn() || gameOver){
            return
        }

        historySteps.SyncHistoryToCurrentStep();

        var step = AI.thinkWithOneDepth();

        /*
        * developing
        * */
        //var step = AI.takeStep(whoseTurn, board);

        _stepAndUpdate(step.row, step.col);
    }



    this.backStep = function () {

        if(gameOver){
            gameOver = false;
        }

        var step = historySteps.stepBack();

        clearChessAtPosition(step.row, step.col, step.player);

        whoseTurn = step.player;
    };

    // Not support now
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

    this.recoverFromHistorySteps = function () {

        board.Init();

        userInerface.reset();
        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );


        var steps = historySteps.getSteps();

        whoseTurn = steps[0].player;

        for(var i = 0; i < steps.length; i++){
            step = steps[i];

            _stepAndUpdate(step.row, step.col);
        }

    };

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

    userInerface.setBtnRestart(this.start, this);
};


window.onload = function () {
    var game = new GoBang(board);
    game.start();
};