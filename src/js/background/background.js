import Download from './download'
import DownloadStatus from './downloadStatus'

// const path = require('path')

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
    if(element.name=='page'){
        url = info.pageUrl
    }

    if(element.name=='link'){
        url = info.linkUrl
    }

    $.jsonRPC.setup({
        endPoint: 'http://localhost:6800/jsonrpc',
        namespace: 'aria2'
    });
    
    let download = new Download([url])
    download.start().then((result)=>{
        
        download.status = new DownloadStatus()

        download.status.getAll(result.result).then((results)=>{
            console.log(results)
        })
    },(err)=>{
        console.log(err)
    })
 }

