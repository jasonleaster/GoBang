/**
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