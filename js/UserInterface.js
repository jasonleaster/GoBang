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
 * File     : script.js
 * Date     : 2016/11/24.
 *
 * The module of user interface.
 */

var UI = function (boardSize) {

    var PieceInPixel = 30;  // px
    var size = boardSize;

    var BoardInPixel = {
        width : boardSize * PieceInPixel,
        height: boardSize * PieceInPixel,
        margin: PieceInPixel/2
    };

    var chessCanvas    = document.getElementById("chessCanvas");
    var boardCanvas    = document.getElementById("boardCanvas");

    var audio = document.getElementById("dropPieceVoice");

    var chessCanvasCtx = chessCanvas.getContext("2d");
    var boardCanvasCtx = boardCanvas.getContext("2d");

    chessCanvas.setAttribute("width",  BoardInPixel.width);
    chessCanvas.setAttribute("height", BoardInPixel.height);

    boardCanvas.setAttribute("width",  BoardInPixel.width);
    boardCanvas.setAttribute("height", BoardInPixel.height);

    var panelShowCurStep   = document.getElementById("currentStep");
    var panelShowTolStep   = document.getElementById("totalStep");
    var panelShowWhoseTurn = document.getElementById("whoseTurn");

    this.setCurrentStepinUI = function (step) {
        panelShowCurStep.innerHTML = "Current Step: " + step;
    };

    this.setTotalStepinUI = function (step) {
        panelShowTolStep.innerHTML = "Total Steps: " + step;
    };

    var btnBackStep         = document.getElementById("previousStep");
    var btnNextStep         = document.getElementById("nextStep");
    var btnSaveTheBoard     = document.getElementById("saveTheBoard");
    var btnRestart          = document.getElementById("restart");
    var btnUpLoadChessBoard = document.getElementById('uploadChessBoard');

    this.getBtnBackStep = function () {
        return btnBackStep;
    };

    this.getBtnNextStep = function () {
        return btnNextStep;
    };

    this.setBtnSaveTheBoard = function (func, obj) {
        return btnSaveTheBoard.onclick = function (e) {
            e.preventDefault();
            func.call(obj);
        };
    };

    this.setBtnRestart = function (func, obj) {
        btnRestart.onclick = function(e){
            e.preventDefault();
            func.call(obj);
        }
    };

    this.setBtnUploadHistorySteps = function (func, obj) {
        btnUpLoadChessBoard.addEventListener('change', func);
    };


    this.clearChessAtPosition = function (row, col) {

        chessCanvasCtx.clearRect( row * PieceInPixel, 
                                  col * PieceInPixel,
                                  PieceInPixel, PieceInPixel);

        chessCanvasCtx.beginPath();
    };

    function playVoice() {
        audio.play();
    }

    this.drawChessAtPosition = function (row, col, color) {

        if(row < 0 || row > size ||
           col < 0 || col > size ||
            (color != "white" && color != "black")){
            return
        }

        m          = BoardInPixel.margin;
        chessWidth = PieceInPixel;

        // Draw a circle
        chessCanvasCtx.beginPath();
        chessCanvasCtx.arc(m + row * chessWidth, m + col* chessWidth, 13, 0, 2 * Math.PI);
        chessCanvasCtx.closePath();
        chessCanvasCtx.fill();

        // Add a gradient effect onto chess(the circle)
        var gradient = chessCanvasCtx.createRadialGradient(
            m    + row*chessWidth + 2, m + col*chessWidth - 2, 13,
            m-10 + row*chessWidth + 2, m + col*chessWidth - 2, 1);

        if(color == "white"){

            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");

        }else{

            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");

        }

        chessCanvasCtx.fillStyle = gradient;
        chessCanvasCtx.fill();

        //playVoice();
    };

    function drawChessBoard(color) {

        if (color == null){
            color = "#BFBFBF";
        }

        canvasContext = boardCanvasCtx;

        canvasContext.strokeStyle = color;

        m          = BoardInPixel.margin; // the margin of the GoBang board in pixel.
        chessWidth = PieceInPixel;

        for(var i = 0; i < size; i++){
            // this.chessCanvasCtx.moveTo(startX, startY);
            // this.chessCanvasCtx.lineTo(endX,   endY);
            // this.chessCanvasCtx.stroke();

            canvasContext.moveTo(m + i * chessWidth, m);
            canvasContext.lineTo(m + i * chessWidth, BoardInPixel.width - m);

            canvasContext.moveTo(m,                   m + i * chessWidth);
            canvasContext.lineTo(BoardInPixel.width - m, m + i * chessWidth);
            canvasContext.stroke();
        }
    }

    this.setUserClickFunc =  function (func) {
        chessCanvas.onclick = func;
    };

    this.reset = function () {
        chessCanvasCtx.clearRect(0, 0, BoardInPixel.width, BoardInPixel.height);
        chessCanvasCtx.beginPath();

        drawChessBoard();
    };

    this.showLocation = function(row, col){

        canvasContext = boardCanvasCtx;

        canvasContext.clearRect( 0, 0, BoardInPixel.width, BoardInPixel.height);

        canvasContext.beginPath();

        m          = BoardInPixel.margin; // the margin of the GoBang board in pixel.
        chessWidth = PieceInPixel;

        drawChessBoard();

        canvasContext.beginPath();

        canvasContext.strokeStyle = "red";

        canvasContext.moveTo(m + row * chessWidth, m);
        canvasContext.lineTo(m + row * chessWidth, BoardInPixel.width - m);

        canvasContext.moveTo(m,                      m + col * chessWidth);
        canvasContext.lineTo(BoardInPixel.width - m, m + col * chessWidth);
        canvasContext.stroke();
    };

    this.showGrade = function (row, col, grade) {
        canvasContext = boardCanvasCtx;

        m          = BoardInPixel.margin; // the margin of the GoBang board in pixel.
        chessWidth = PieceInPixel;

        canvasContext.font = "20px Georgia";
        canvasContext.beginPath();
        canvasContext.fillText("" + grade, Math.floor(m*0.6) + row * chessWidth, Math.floor(m*1.5) + col*chessWidth);
    }
};