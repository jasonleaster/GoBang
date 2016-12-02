/**
 * Created by Administrator on 2016/12/2.
 */

function ArtificialIntelligence(boardSize) {

    var size = boardSize;
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

    this.takeStep = function(){
        return judgement();
    };

    this.updateStatisticArray = function (row, col, whoseTurn) {

        if(whoseTurn == PIECES_TYPE.WHITE){

            for(var k = 0; k < diffWayToWin; k++){
                if(waysToWin[row][col][k]){
                    myWins[k]++;
                    AIWinsPossible[k] = false;
                }
            }

        }else{

            for(var k = 0; k < diffWayToWin; k++){
                if(waysToWin[row][col][k]){
                    myWinsPossible[k] = false;
                    AIWins[k]++;
                }
            }
        }

    };

    /**
     * 是否是平局
     */
    this.isGameTie = function () {
        for(var k = 0; k < diffWayToWin; k++){
            if(myWinsPossible[k] != false || AIWinsPossible[k] != false){
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
    };

    this.init = function() {

        _init_waysToWin();
        _init_statisticPossibleToWin();
    };

    this.init();
}