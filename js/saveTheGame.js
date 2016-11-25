/**
 * Created by Administrator on 2016/11/23.
 */

var Persistance = {
    downloadAsJson : function (object) {

        var dataStr = "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(object, null, 2));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();
    }
};



