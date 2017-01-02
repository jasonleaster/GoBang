/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/19.
 */

var PIECES_TYPE = { NONE  : 0, WHITE : 1, BLACK : 2};

/**
 * The representation of the board.
 * @param size
 * @constructor
 */
function Board(size) {
    var _size  = size;
    var _chessBoard = [];

    /*
    * Board representation as a hash value
    * which is used for cache.
    * */
    var _hashValue = "";

    this.getHashValue = function () {
        return _hashValue + "";
    };


    /*
    * dotted line boundary which are used for AI module.
    * */
    var _lowBoundary = {"row": size, "col":size};
    var _upBoundary  = {"row": 0, "col":0};
    var MARGIN = 1;

    this.getLowBoundary = function () {
        return _lowBoundary;
    };

    this.getUpBoundary = function () {
        return _upBoundary;
    };

    function tryToUpdateLowBoundary(lowBoundary, row, col) {
        row -= MARGIN;
        col -= MARGIN;

        if(! _legalRowIndex(row)){
            row = 0;
        }

        if(! _legalColIndex(col)){
            col = 0;
        }

        if(row < lowBoundary.row){
            lowBoundary.row = row;
        }

        if(col < lowBoundary.col){
            lowBoundary.col = col;
        }

        return lowBoundary;
    }

    function tryToUpdateUpBoundary(upBoundary, row, col) {

        row += MARGIN;
        col += MARGIN;

        if(! _legalRowIndex(row)){
            row = size-1;
        }

        if(! _legalColIndex(col)){
            col = size-1;
        }

        if(row > upBoundary.row){
            upBoundary.row = row;
        }

        if(col > upBoundary.col){
            upBoundary.col = col;
        }

        return upBoundary;
    }

    /*
    * Private Methods
    * */

    /**
     * Clean the board and set all slot into none;
     */
    this.cleanBoard = function() {
        _chessBoard = [];
        for(var i = 0; i < size; i++){
            _chessBoard[i] = [];
            for(var j = 0; j < size; j++){
                _chessBoard[i][j] = PIECES_TYPE.NONE;
            }
        }
    };

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

    function _legalRowIndex(row) {
        if(row < 0 || row >= size){
            return false;
        }

        return true;
    }

    function _legalColIndex(col) {
        if(col < 0 || col >= size){
            return false;
        }

        return true;
    }

    function _legalIndex(row, col) {
        if(row < 0 || col < 0 ||
            row >= size || col >= size){
            return false;
        }

        return true;
    }
    this.legalIndex = _legalIndex;

    /**
     * Determine whether there have a piece.
     *
     * @param row
     * @param col
     * @returns {boolean}
     */
    this.isEmptyLocation = function (row, col) {

        if(! _legalIndex(row, col)){
            // should not reach here
            console.error("Illegal index row:" + row + " col: "+ col);
        }

        return _chessBoard[row][col] == PIECES_TYPE.NONE ;
    };

    this.setPiece = function (row, col, piece) {
        if(! this.legalIndex(row, col)){
            return;
        }

        _chessBoard[row][col] = piece;

        _hashValue = "";
        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){
                if(_chessBoard[i][j] == PIECES_TYPE.NONE){
                    _hashValue += "0";
                }else if(_chessBoard[i][j] == PIECES_TYPE.WHITE){
                    _hashValue += "1";
                }else if(_chessBoard[i][j] == PIECES_TYPE.BLACK){
                    _hashValue += "2";
                }
            }
        }

        this.autoSizeTheBoundary();
    };

    this.autoSizeTheBoundary = function () {
        var lowBoundary = {"row": size, "col":size};
        var upBoundary  = {"row": 0, "col":0};

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){
                if(! this.isEmptyLocation(i, j)){
                    tryToUpdateLowBoundary(lowBoundary, i, j);
                    tryToUpdateUpBoundary(upBoundary, i, j);
                }
            }
        }

        _lowBoundary = lowBoundary;
        _upBoundary  = upBoundary;
    };

    this.getPiece = function (row, col) {
        if(! _legalIndex(row, col)){
            return;
        }

        return _chessBoard[row][col];
    };

    this.getSize = function () {
        return _size;
    };


    this.Init = function (){

        this.cleanBoard();

        lowBoundary = {"row": size, "col":size};
        upBoundary  = {"row": 0,    "col":0};
    };

    this.Init();
}

var GoBang = function (board) {

    var size = board.getSize();

    var winner;  // Value belongs into {PIECE}
    var gameOver = false;

    var whoseTurn = PIECES_TYPE.WHITE;
    function isPlayerTurn() {
        return whoseTurn == PIECES_TYPE.WHITE;
    }

    var userInterface = new UI(size);
    var historySteps = new HistoryStep();
    var AI           = new ArtificialIntelligence(size, userInterface);
    

    // public method
    this.start = function() {

        board.Init();

        userInterface = new UI(size);
        historySteps = new HistoryStep(this);
        AI           = new ArtificialIntelligence(size, userInterface);

        userInterface.reset();
        userInterface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInterface.setTotalStepinUI(   historySteps.getTotalStep() );

        var btn     = userInterface.getBtnBackStep();
        btn.onclick = this.backStep;
        // Not Support yet
        // btn         = userInterface.getBtnNextStep();
        // btn.onclick = this.nextStep;

        userInterface.setUserClickFunc(User_Step, this);
        userInterface.setBtnSaveTheBoard(historySteps.downloadAsJson, historySteps);
        userInterface.setBtnUploadHistorySteps(historySteps.uploadHistorySteps, historySteps);

        whoseTurn = PIECES_TYPE.BLACK;

        _stepAndUpdate(Math.floor(size/2), Math.floor(size/2));

        gameOver = false;
    };

    function clearChessAtPosition(row, col, whoseTurn) {

        if (! board.isEmptyLocation(row, col)) {

            AI.backStep(board, row, col, whoseTurn);

            board.setPiece(row, col, PIECES_TYPE.NONE);

            userInterface.clearChessAtPosition(row, col);
            userInterface.setCurrentStepinUI( historySteps.getCurrentStep() );
            userInterface.setTotalStepinUI(   historySteps.getTotalStep() );

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
            userInterface.drawChessAtPosition(row, col, "white");
            board.setPiece(row, col, PIECES_TYPE.WHITE);
        }else{
            userInterface.drawChessAtPosition(row, col, "black");
            board.setPiece(row, col, PIECES_TYPE.BLACK);
        }

        historySteps.saveStepToHistory(row, col, whoseTurn);

        userInterface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInterface.setTotalStepinUI(   historySteps.getTotalStep() );

        userInterface.showLocation(row, col);

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

        //var step = AI.thinkWithOneDepth();

        /*
        * developing
        * */
        var step = AI.takeStep(whoseTurn, board);

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

        userInterface = new UI(size);
        //  historySteps = new HistoryStep(this);
        AI           = new ArtificialIntelligence(size, userInterface);

        userInterface.reset();
        userInterface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInterface.setTotalStepinUI(   historySteps.getTotalStep() );

        var btn     = userInterface.getBtnBackStep();
        btn.onclick = this.backStep;
        // Not Support yet
        // btn         = userInterface.getBtnNextStep();
        // btn.onclick = this.nextStep;

        userInterface.setUserClickFunc(User_Step, this);
        userInterface.setBtnSaveTheBoard(historySteps.downloadAsJson, historySteps);
        userInterface.setBtnUploadHistorySteps(historySteps.uploadHistorySteps, historySteps);

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

    userInterface.setBtnRestart(this.start, this);
};

var board = new Board(9);

window.onload = function () {
    var game = new GoBang(board);
    game.start();
};