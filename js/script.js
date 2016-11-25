/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/19.
 */


/*
 * Constants in game.
 * */
var GoBang = function () {

    var _ = this;
    var size    = 15;

    var chessCanvas = document.getElementById("chessCanvas");
    var boardCanvas = document.getElementById("boardCanvas");
    var btnBackStep = document.getElementById("previousStep");
    var btnNextStep = document.getElementById("nextStep");

    var chessCanvasCtx = chessCanvas.getContext("2d");
    var boardCanvasCtx = boardCanvas.getContext("2d");

    var boardInPx = {
        width      : parseInt(chessCanvas.getAttribute("width")),
        height     : parseInt(chessCanvas.getAttribute("width")), // make sure width == height
        margin     : 15,
        chessInPx  : 30//(this.width - 2 * this.margin) / (size - 1)
    };

    var chessBoard   = [];
    var PIECES       = { NONE  : 0, WHITE : 1, BLACK : 2};
    var whoesTurn    = PIECES.WHITE;

    var winner;

    // Support back step and next step
    var historyStep = {
        currentStep:0,
        totalStep  :0,
        steps      :[]
    };


    /*--------------------------------------------------------------------*/

    function isPlayerTurn() {
        return whoesTurn == PIECES.WHITE;
    }

    //AI
    var diffWayToWin = 0;
    var waysToWin    = [];
    function _init_waysToWin() {

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
    this.initBoard = function() {

        diffWayToWin = 0;
        whoesTurn    = PIECES.WHITE;

        init_AI();

        // reset the canvas
        chessCanvasCtx.clearRect(0, 0, boardInPx.width, boardInPx.height);
        chessCanvasCtx.beginPath();

        cleanBoard();
        drawChessBoard(boardCanvasCtx);
    };


    // private method
    function cleanBoard() {
        for(var i = 0; i < size; i++){
            chessBoard[i] = [];
            for(var j = 0; j < size; j++){
                chessBoard[i][j] = PIECES.NONE;
            }
        }
    }

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

            chessCanvasCtx.clearRect( row * boardInPx.chessInPx, col * boardInPx.chessInPx,
                boardInPx.chessInPx, boardInPx.chessInPx);

            chessCanvasCtx.beginPath();

        }
    }

    function drawChessAtPosition(row, col, color) {
        m          = boardInPx.margin;
        chessWidth = boardInPx.chessInPx;

        // Draw a circle
        chessCanvasCtx.beginPath();
        chessCanvasCtx.arc(m + row * chessWidth, m + col* chessWidth, 13, 0, 2 * Math.PI);
        chessCanvasCtx.closePath();
        chessCanvasCtx.fill();

        // Add a gradient effect onto chess(the circle)
        var gradient = chessCanvasCtx.createRadialGradient(
            m    + row*chessWidth + 2, m + col*chessWidth - 2, 13,
            m-10 + row*chessWidth + 2, m + col*chessWidth - 2, 1);

        if(color == PIECES.WHITE){

            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
            chessBoard[row][col] = PIECES.WHITE;

        }else{

            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");
            chessBoard[row][col] = PIECES.BLACK;

        }

        chessCanvasCtx.fillStyle = gradient;
        chessCanvasCtx.fill();
    }


    function drawChessBoard (canvasContext) {

        canvasContext.strokeStyle = "#BFBFBF";

        m          = boardInPx.margin; // the margin of the GoBang board in pixel.
        chessWidth = boardInPx.chessInPx;

        for(var i = 0; i < size; i++){
            // this.chessCanvasCtx.moveTo(startX, startY);
            // this.chessCanvasCtx.lineTo(endX,   endY);
            // this.chessCanvasCtx.stroke();

            canvasContext.moveTo(m + i * chessWidth, m);
            canvasContext.lineTo(m + i * chessWidth, boardInPx.width - m);

            canvasContext.moveTo(m,                   m + i * chessWidth);
            canvasContext.lineTo(boardInPx.width - m, m + i * chessWidth);
            canvasContext.stroke();
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
            drawChessAtPosition(row, col, PIECES.WHITE);
        }else{
            drawChessAtPosition(row, col, PIECES.BLACK);
        }

        saveStepToHistory(row, col, whoesTurn);

        swithTurns();
    }


    chessCanvas.onclick = User_Step;

    function User_Step(e) {

        if(!isPlayerTurn()){
            return
        }

        if(historyStep.totalStep != historyStep.currentStep){
            historyStep.totalStep = historyStep.currentStep;

            for(;historyStep.steps.length > historyStep.totalStep;){
                step = historyStep.steps.pop();
            }
        }

        var x = e.offsetX;
        var y = e.offsetY;

        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);

        if(chessBoard[i][j] == 0){
            oneStep(i, j);
        }else{
            return
        }

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[i][j][k]){
                myWins[k]++;
                AIWinsPossible[k] = false;
            }
        }

        if(isGameOver()){
            window.alert("Game Over the User win!");
            //Persistance.downloadAsJson(historyStep);
            _.initBoard();
            return;
        }

        AI_Step();

        if(isGameOver()){
            window.alert("Game Over the AI win!");
            //Persistance.downloadAsJson(historyStep);
            _.initBoard();
            return;
        }
    }

    function AI_Step() {

        if(isPlayerTurn()){
            return
        }

        if(historyStep.totalStep != historyStep.currentStep){
            historyStep.totalStep = historyStep.currentStep;

            for(;historyStep.steps.length > historyStep.totalStep;){
                step = historyStep.steps.pop();
            }
        }

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

        oneStep(m, n);

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[m][n][k]){
                myWinsPossible[k] = false;
                AIWins[k]++;
            }
        }

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

    function saveStepToHistory(i, j, player) {

        historyStep.steps.push(
            {
                "row":i,
                "col":j,
                "player":player
            });

        historyStep.currentStep++;
        historyStep.totalStep = historyStep.currentStep;
    }

    this.backStep = function () {

        debugger;
        if(historyStep.currentStep == 0){
            alert("No more back step!");
            return
        }

        step = historyStep.steps[ historyStep.currentStep - 1];

        clearChessAtPosition(step.row, step.col);

        historyStep.currentStep--;

        swithTurns();

    };

    this.nextStep = function () {

        debugger;
        if(historyStep.currentStep == historyStep.totalStep){
            alert("No more next step!");
            return;
        }

        step = historyStep.steps[ historyStep.currentStep];

        if(isPlayerTurn()){
            drawChessAtPosition(step.row, step.col, PIECES.WHITE);
        }else{
            drawChessAtPosition(step.row, step.col, PIECES.BLACK);
        }

        historyStep.currentStep++;

        swithTurns();
    };

    btnBackStep.onclick = this.backStep;
    btnNextStep.onclick = this.nextStep;


};



window.onload = function () {
    var game = new GoBang();
    game.initBoard();
};