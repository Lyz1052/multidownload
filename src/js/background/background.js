import Download from './download'
import DownloadStatus from './downloadStatus'
import {Global,Multi} from '../multi/multi'

// console.log(console)
// let console = new Global(this)
// const path = require('path')

//["page","selection","link","editable","image","video","audio"]
const elements = ["page","link","image","video","audio"].map((e)=>{
    return {
        name:e,
        menuId:"context_"+e
    }
})

let tabStats = {}

chrome.runtime.onInstalled.addListener(()=>{
    // ["page","selection","link","editable","image","video","audio"]
    elements.forEach((e)=>{
        chrome.contextMenus.create({"title": "Download resource "+e.name, "contexts":[e.name],"id": e.menuId})
    })

    Multi.loadMedia()

    chrome.contextMenus.onClicked.addListener(onContextMenu)
})


chrome.webRequest.onBeforeRequest.addListener((details)=>{
    let tabStat

    if(tabStats[details.tabId]){
        tabStat = tabStats[details.tabId]
    }else{
        tabStat = tabStats[details.tabId] || {
            requestDownload:0,
            downloadUrls:[]
        }
        tabStats[details.tabId]= tabStat 
    }

    let patterns = Multi.mediaPatterns(details.url)
    if(patterns){//当前正在载入的页面中，包含视频
        tabStat.patterns = patterns
    }

    if(tabStat.patterns){
        let isDownloadUrl = tabStat.patterns.find((pattern)=>{
            return new RegExp(pattern,'g').test(details.url)
        })

        if(isDownloadUrl){
            tabStat.downloadUrls.push(details.url)
        }

        if(tabStat.requestDownload){//已有下载请求，立刻下载
            Multi.download(details.url)
        }
    }

},{urls: ["<all_urls>"]},[])

 //右键菜单
 function onContextMenu(info,tab){
    let urls = getUrlsFromInfo(info)

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

     if(tabStat){
        if(tabStat.downloadUrls){//下载页面中获取到的所有地址
            urls = Global.copy(tabStat.downloadUrls)
        }else if(tabStat.patterns){//获取到地址时立刻下载
            tabStat.requestDownload = 1
        }
     }else{
         let element = elements.find((e)=>e.menuId==info.menuItemId)
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

