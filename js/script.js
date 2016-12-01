/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/19.
 */

var GoBang = function () {

    var envPointer = this;
    var size    = 15;

    var chessBoard   = [];
    var PIECES       = { NONE  : 0, WHITE : 1, BLACK : 2};
    var winner;

    var whoesTurn    = PIECES.WHITE;
    function isPlayerTurn() {
        return whoesTurn == PIECES.WHITE;
    }

    var userInerface = new UI(size);
    var historySteps = new HistoryStep();

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

    function cleanBoard() {
        for(var i = 0; i < size; i++){
            chessBoard[i] = [];
            for(var j = 0; j < size; j++){
                chessBoard[i][j] = PIECES.NONE;
            }
        }
    }

    function isEmptyLocation(row, col) {

        return chessBoard[row][col] == PIECES.NONE ;
    }

    // public method
    this.start = function() {

        userInerface = new UI(size);
        historySteps = new HistoryStep();

        userInerface.reset();

        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        whoesTurn    = PIECES.WHITE;

        init_AI();
        cleanBoard();

    };


    function clearChessAtPosition(row, col) {

        debugger;
        if (chessBoard[row][col] != PIECES.NONE) {

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


            chessBoard[row][col] = PIECES.NONE;

            userInerface.clearChessAtPosition(row, col);
            userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
            userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        }
    }

    function swithTurns() {
        if(whoesTurn == PIECES.WHITE){
            whoesTurn = PIECES.BLACK;
        }else{
            whoesTurn = PIECES.WHITE;
        }
    }

    function oneStep (row, col) {

        if(isPlayerTurn()){
            userInerface.drawChessAtPosition(row, col, "white");
            chessBoard[row][col] = PIECES.WHITE;
        }else{
            userInerface.drawChessAtPosition(row, col, "black");
            chessBoard[row][col] = PIECES.BLACK;
        }

        historySteps.saveStepToHistory(row, col, whoesTurn);

        userInerface.setCurrentStepinUI( historySteps.getCurrentStep() );
        userInerface.setTotalStepinUI(   historySteps.getTotalStep() );

        userInerface.showLocation(row, col);

        swithTurns();
    }

    function _User_step(row, col) {
        if(isEmptyLocation(row, col)){
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

        debugger;
        if(!isPlayerTurn()){
            return
        }

        historySteps.SyncHistoryToCurrentStep();

        var x = e.offsetX;
        var y = e.offsetY;

        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);


        _User_step(i, j);


        if(isGameOver()){
            window.alert("Game Over the User win!");
            envPointer.start();
            return;
        }

        AI_Step();

        if(isGameOver()){
            window.alert("Game Over the AI win!");
            envPointer.start();
            return;
        }
    }

    function _AI_Step(row, col) {
        oneStep(row, col);

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[row][col][k]){//
                myWinsPossible[k] = false;
                AIWins[k]++;
            }
        }
    }

    function AI_Step() {

        if(isPlayerTurn()){
            return
        }

        historySteps.SyncHistoryToCurrentStep();

        //Evaluation for current situation.
        var myScore = [];
        var AIScore = [];

        var maxScore= 0;
        var m = 0, n = 0;//position where get the max score

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

                if(chessBoard[i][j] == PIECES.NONE){
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
                        if(myScore[i][j] > myScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }

                    if(myScore[i][j] > maxScore){
                        maxScore = myScore[i][j];
                        m = i;
                        n = j;
                    }else if (myScore[i][j] == maxScore){
                        if(AIScore[i][j] > AIScore[m][n]){
                            m = i;
                            n = j;
                        }
                    }
                }
            }
        }

        console.log("The AI pick best score is: " + maxScore + " location(m, n): " + n + ", " + m);

        _AI_Step(m, n);

    }

    function isGameOver() {

        for(var k = 0; k < diffWayToWin; k++){
            if(myWins[k] == 5){
                winner = "User";
                return true;
            }

            if(AIWins[k] == 5){
                winner = "AI";
                return true;
            }
        }

        return false;
    }

    function isGameOver_Native() {

        for(var i = 0; i < size; i++){
            for(var j = 0; j < size; j++){

                if(chessBoard[i][j] == PIECES.NONE){
                    continue;
                }

                var m = i;
                var n = j;
                var continueRepeats = 1;

                // Direction 1
                for(m = i, n = j; 0 <= m-1 && m-1 < size &&
                0 <= n+1 && n+1 < size; m--, n++){
                    if(chessBoard[m][n] == chessBoard[m - 1][n + 1]){
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
                    if(chessBoard[m][n] == chessBoard[m + 1][n]){
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
                    if(chessBoard[m][n] == chessBoard[m + 1][n + 1]){
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
                    if(chessBoard[m][n] == chessBoard[m][n + 1]){
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

    var btn     = userInerface.getBtnBackStep();
    btn.onclick = this.backStep;
    // Not Support yet
    // btn         = userInerface.getBtnNextStep();
    // btn.onclick = this.nextStep;

    userInerface.setUserClickFunc(User_Step);
    userInerface.setBtnRestart(this.start);
    userInerface.setBtnSaveTheBoard(historySteps.downloadAsJson);

};

window.onload = function () {
    var game = new GoBang();
    game.start();
};