import Download from './download'
import DownloadStatus from './downloadStatus'
import {Global,Multi} from '../multi/multi'

// console.log(console)
// let console = new Global(this)
// const path = require('path')

//["page","selection","link","editable","image","video","audio"]
const pageElements = ["link","image","video","audio"].map((e)=>{
    return {
        name:e,
        menuId:"context_"+e
    }
})

let tabStats = {},hasPageVideoMenu = false //是否添加过页面下载的菜单

chrome.runtime.onInstalled.addListener(()=>{
    //下载指定资源
    let menuItem = {};
    pageElements.forEach((e)=>{
        menuItem = {"id": e.menuId,contexts:[e.name],"title": "Download resource "+e.name}
        chrome.contextMenus.create(menuItem)
    })
    
    Multi.loadMedia()

    chrome.contextMenus.onClicked.addListener(onContextMenu)
})

//加载页面
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
    if(changeInfo.url){
        if(hasPageVideoMenu){
            chrome.contextMenus.remove("context_pagevideo")
            hasPageVideoMenu = false
        }
    }
})

// chrome.downloads.onCreated.addListener(function(downloadItem){
//     console.log(downloadItem)
// })

// chrome.webRequest.onSendHeaders.addListener((details)=>{
//     if(false)
//     console.log(details)
// },{urls: ["<all_urls>"]},[])

// chrome.webRequest.onBeforeRequest.addListener((details)=>{
//     let tabStat = tabStats[details.tabId]

//     if(tabStats[details.tabId]){
//         tabStat = tabStats[details.tabId]
//     }else{
//         tabStat = tabStats[details.tabId] || {
//             requestDownload:0,
//             downloadUrls:[]
//         }
//         tabStats[details.tabId]= tabStat 
//     }

//     let rule = Multi.mediaRule(details.url)

//     if(rule && !tabStat.patterns){//当前正在载入的页面中，包含视频
//         chrome.contextMenus.create({"id":"context_pagevideo",contexts:['page'],"type":"normal","title": "Download video"})
//         hasPageVideoMenu = true
//         tabStat.patterns = rule.patterns
//         tabStat.typeText = rule.typeText
//     }
    
//     if(tabStat && tabStat.patterns){
//         let isDownloadUrl = tabStat.patterns.find((pattern)=>{
//             return new RegExp(pattern,'g').test(details.url)
//         })
        
//         if(isDownloadUrl){
//             console.log(details.url)
//             tabStat.downloadUrls.push(details.url)
//         }

//         if(tabStat.requestDownload){//已有下载请求，立刻下载
//             Multi.download(details.url)
//         }
//     }

// },{urls: ["<all_urls>"]},[])

 //右键菜单
 function onContextMenu(info,tab){
    let urls = getUrlsFromInfo(info,tab)

    console.log(urls)

    if(urls.length)
        Multi.download(urls)

    // ,(status)=>{
    //     if(status.get('errorCode')==12){
    //         Global.ALERT('重复的下载')
    //     }
    // }
 }

 //根据点击内容获取 url
 function getUrlsFromInfo(info,tab){
     let tabStat = tabStats[tab.id],urls = []

     //下载页面视频
     if(info.menuItemId.indexOf('pagevideo')!=-1){
        
        if(tabStat.downloadUrls.length){//下载页面中获取到的所有地址
            urls = Global.copy(tabStat.downloadUrls)
        }else if(tabStat.patterns){//获取到地址时立刻下载
            tabStat.requestDownload = 1
        }
     }else{
         //下载链接

         let element = pageElements.find((e)=>e.menuId==info.menuItemId)
         let url = info.srcUrl
     
         if(element.name=='page'){
             url = info.pageUrl
         }
     
         if(element.name=='link'){
             url = info.linkUrl
         }
    
         urls.push(url)
     }

     return urls
 }

