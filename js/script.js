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
    var chess   = document.getElementById("chess");
    var context = chess.getContext("2d");

    var boardInPx = {
        width      : parseInt(chess.getAttribute("width")),
        height     : parseInt(chess.getAttribute("width")), // make sure width == height
        margin     : 15,
        chessInPx  : 30//(this.width - 2 * this.margin) / (size - 1)
    };

    var chessBoard   = [];
    var PIECES       = { NONE  : 0, WHITE : 1, BLACK : 2};
    var whoesTurn    = PIECES.WHITE;

    var winner;


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
    function _init_statisticPossibleToWin() {
        for(var i = 0; i < diffWayToWin; i++){
            myWins[i] = 0;
            AIWins[i] = 0;
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
        context.clearRect(0, 0, boardInPx.width, boardInPx.height);
        context.beginPath();
        cleanBoard();
        drawChessBoard();
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


    function drawChessBoard () {

        context.strokeStyle = "#BFBFBF";

        m          = boardInPx.margin; // the margin of the GoBang board in pixel.
        chessWidth = boardInPx.chessInPx;

        for(var i = 0; i < size; i++){
            // this.context.moveTo(startX, startY);
            // this.context.lineTo(endX,   endY);
            // this.context.stroke();

            context.moveTo(m + i * chessWidth, m);
            context.lineTo(m + i * chessWidth, boardInPx.width - m);

            context.moveTo(m,                   m + i * chessWidth);
            context.lineTo(boardInPx.width - m, m + i * chessWidth);
            context.stroke();
        }
    }

    function swithTurns() {
        if(whoesTurn == PIECES.WHITE){
            whoesTurn = PIECES.BLACK;
        }else{
            whoesTurn = PIECES.WHITE;
        }
    }

    function oneStep (i, j) {

        m          = boardInPx.margin;
        chessWidth = boardInPx.chessInPx;

        // Draw a circle
        context.beginPath();
        context.arc(m + i * chessWidth, m + j* chessWidth, 13, 0, 2 * Math.PI);
        context.closePath();
        context.fill();

        // Add a gradient effect onto chess(the circle)
        var gradient = context.createRadialGradient(
            m    + i*chessWidth + 2, m + j*chessWidth - 2, 13,
            m-10 + i*chessWidth + 2, m + j*chessWidth - 2, 1);

        if(isPlayerTurn()){
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");

            chessBoard[i][j] = PIECES.WHITE;
        }else{
            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");

            chessBoard[i][j] = PIECES.BLACK;
        }

        context.fillStyle = gradient;
        context.fill();

        swithTurns();
    }


    chess.onclick = User_Step;

    function User_Step(e) {

        if(! isPlayerTurn()){
            return;
        }

        var x = e.offsetX;
        var y = e.offsetY;

        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);

        if(chessBoard[i][j] == 0){
            oneStep(i, j);
        }

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[i][j][k]){
                myWins[k]++;
                AIWins[k] = 6;
            }
        }

        if(isGameOver()){
            window.alert("Game Over the User win!");
            _.initBoard();
            return;
        }

        AI_Step();

        if(isGameOver()){
            window.alert("Game Over the AI win!");
            _.initBoard();
            return;
        }
    }

    function AI_Step() {

        debugger;
        //Evaluation for current situation.
        var myScore = [];
        var AIScore = [];

        var maxScore= 0;
        var m = 0, n = 0;//position where get the max score

        for (var i = 0; i < 15; i++){
            myScore[i] = [];
            AIScore[i] = [];
            for(var j = 0; j < 15; j++){
                myScore[i][j] = 0;
                AIScore[i][j] = 0;
            }
        }

        for(var i = 0; i < 15; i++){
            for(var j = 0; j < 15; j++){

                if(chessBoard[i][j] == PIECES.NONE){
                    //can drap a chess
                    for(var k = 0; k < diffWayToWin; k++){
                        if(waysToWin[i][j][k]){
                            if(myWins[k] == 1){
                                myScore[i][j] += 210;
                            }else if(myWins[k] == 2){
                                myScore[i][j] += 420;
                            }else if(myWins[k] == 3){
                                myScore[i][j] += 850;
                            }else if(myWins[k] == 4){
                                myScore[i][j] += 10000;
                            }
                        }

                        if(waysToWin[i][j][k]){
                            if(AIWins[k] == 1){
                                AIScore[i][j] += 200;
                            }else if(AIWins[k] == 2){
                                AIScore[i][j] += 400;
                            }else if(AIWins[k] == 3){
                                AIScore[i][j] += 800;
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

        debugger;
        oneStep(m, n);

        for(var k = 0; k < diffWayToWin; k++){
            if(waysToWin[m][n][k]){
                myWins[k] = 6;
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

};



window.onload = function () {
    var game = new GoBang();
    game.initBoard();
};