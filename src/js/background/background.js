import Download from './download'
import DownloadStatus from './downloadStatus'
import {WINDOW} from '../multi/multi'

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

 //右键菜单
 function onContextMenu(info,tab){
     //获取 url
    let element = elements.find((e)=>e.menuId==info.menuItemId)
    let url = info.srcUrl

    if(element.name=='page'){
        url = info.pageUrl
    }

    if(element.name=='link'){
        url = info.linkUrl
    }

    //开始下载
    let download = new Download({
        urls:[url]
    })

    download.start()
        //处理下载结果
        .then((result)=>{
            download.resolveStart(result)
                    .statusComplete((status)=>{
                if(status.get('errorCode')==12){
                    WINDOW.ALERT('重复的下载')
                }
            })
        })
 }

