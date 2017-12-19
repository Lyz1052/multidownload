const path = require('path')

//["page","selection","link","editable","image","video","audio"]
const elements = ["page","link","image","video","audio"].map((e)=>{
    return {
        name:e,
        menuId:"context_"+e
    }
})
/**
 * event page script
 * 1.add contextmenu on runtime installed
 * 2.add click listener on context menu
 */

//add contextmenu on installing extension
chrome.runtime.onInstalled.addListener(function(){
    // ["page","selection","link","editable","image","video","audio"]
    elements.forEach((e)=>{
        chrome.contextMenus.create({"title": "Download resource "+e.name, "contexts":[e.name],"id": e.menuId})
    })
})
 
 chrome.contextMenus.onClicked.addListener(onContextMenu)

 function onContextMenu(info,tab){
     let element = elements.find((e)=>e.menuId==info.menuItemId)
     let url = info.srcUrl
     let options = {

     }
     if(element.name=='page'){
        url = info.pageUrl
     }

     console.log(path.basename(url))

     $.jsonRPC.setup({
        endPoint: 'http://localhost:6800/jsonrpc',
        namespace: 'aria2'
      });

        //     ARIA2.request("addTorrent", [torrent, [], options],
        // function(result) {
        //   //console.debug(result);
        //   ARIA2.refresh();
        //   $("#add-task-modal").modal('hide');
        //   YAAW.add_task.clean();
        // }, 
        // function(result) {
        //   //console.debug(result);

        //   var error_msg = get_error(result);

        //   $("#add-task-alert .alert-msg").text(error_msg);
        //   $("#add-task-alert").show();
        //   console.warn("add task error: "+error_msg);
        // });

      $.jsonRPC.request('addUri', {
        params: [[url],options],
        success: function(result) {
            //addUri
            //{id: 1, jsonrpc: "2.0", result: "f0790a3827d9ee9c"}
            debugger
            console.log(result)
        },
        error: function(result) {
            debugger
            console.log(result)
          // Result is an RPC 2.0 compatible response object
        }
      });

    //  http://localhost:6800/jsonrpc
    //  chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)
     
    // if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
    //     console.log("radio item " + info.menuItemId +
    //                 " was clicked (previous checked state was "  +
    //                 info.wasChecked + ")");
    //   } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
    //     console.log(JSON.stringify(info));
    //     console.log("checkbox item " + info.menuItemId +
    //                 " was clicked, state is now: " + info.checked +
    //                 " (previous state was " + info.wasChecked + ")");
    
    //   } else {
    //     console.log("item " + info.menuItemId + " was clicked");
    //     console.log("info: " + JSON.stringify(info));
    //     console.log("tab: " + JSON.stringify(tab));
    //   }
 }

