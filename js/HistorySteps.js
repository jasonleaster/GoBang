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
 * Date     : 2016/11/23.
 *
 * The module of storing the history steps
 * which will be used to download all records
 * and recovering from
 */

var HistoryStep = function(goBang) {
    var game = goBang;

    var currentStep = 0;
    var totalStep   = 0;
    var steps       = [];

    var isRecoverFromFiles = false;

    this.SyncHistoryToCurrentStep = function () {
        if(totalStep != currentStep){
            totalStep = currentStep;

            for(; steps.length > totalStep;){
                step = steps.pop();
            }
        }
    };

    this.getCurrentStep = function () {
        return currentStep;
    };

    this.getTotalStep = function () {
        return totalStep;
    };

    /**
     * Return a copy but not a reference of history steps.
     *
     * @returns {Array}
     */
    this.getSteps = function () {
        var stepsCopy = [];

        for(var i = 0; i < steps.length; i++){
            stepsCopy.push(steps[i]);
        }

        return stepsCopy;
    };

    this.saveStepToHistory = function (i, j, player) {

        if(isRecoverFromFiles){
            return;
        }

        steps.push(
            {
                "row":i,
                "col":j,
                "player":player
            });

        currentStep++;
        if(currentStep > totalStep){
            totalStep = currentStep;
        }
    };

    this.downloadAsJson = function () {
        var dataStr = "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(steps, null, 2));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "HistorySteps.json");
        dlAnchorElem.click();
    };

    this.uploadHistorySteps = function (event) {

        var reader = new FileReader();

        reader.onload = function (event){

            isRecoverFromFiles = true;

            steps = JSON.parse(event.target.result);

            totalStep = steps.length;
            currentStep = totalStep;

            game.recoverFromHistorySteps();

            isRecoverFromFiles = false;
        };

        reader.readAsText(event.target.files[0]);
    };

    this.stepBack = function () {

        if(currentStep > 0){

            return steps[--currentStep];
        }else{
            alert("No more back step!");
            return {
                "row": -1,
                "col": -1,
                "player": "error"
            };
        }
    };

    // this.stepNext = function () {
    //     debugger;
    //     if(currentStep == totalStep){
    //         alert("No more next step!");
    //         return {
    //             "row": -1,
    //             "col": -1,
    //             "player": "error"
    //         };
    //     }else{
    //         return steps[currentStep];
    //     }
    // }
};