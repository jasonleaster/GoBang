/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2016/11/23.
 */

var HistoryStep = function() {

    var currentStep = 0;
    var totalStep   = 0;
    var steps       = [];

    this.SyncHistoryToCurrentStep = function () {
        if(totalStep != currentStep){
            totalStep = currentStep;

            for(;steps.length > totalStep;){
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

    this.saveStepToHistory = function (i, j, player) {

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