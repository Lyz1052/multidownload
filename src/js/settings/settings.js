import {utils,Global,Multi} from '../multi/multi'
import Download from '../background/download'
import { setTimeout } from 'timers';
import {_} from '../lib/lodash.min.js'

const Status = {
  connecting:{text:'Connecting',info:'maybe your aria2 did not started'},
  dowloading:{text:'Downloading',info:'view downloading items..'}
}

let data = {
  status:Status.connecting,
  filter:{},
  downloads:[]
}

$(()=>{
  
  var win = new Global(this)

  $('body').on('click','#itemTable',function(){
    refresh()
  })

  $('#testButtons li').click((ev)=>{
    let eventObj = $(ev.target).closest('li').find('a'),event = eventObj.html()

    if(event == 'refresh'){
      refresh()
    }else{
      utils.RPCPromise(event).then(alert).catch(alert)
    }
  })
  
  //这里仅仅使用Vue渲染模板，没有使用标准的Vue方式处理整个页面
  let app = new Vue({
    el:'#app',
    data:data,
  })

  refresh()
})

//刷新下载
function refresh(){
  Promise.all([utils.RPCPromise('tellActive'),
  utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
  utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
  .then((results)=>{
    let [active,waiting,stopped] = results
      ,downloadingCount = 0,downloadedCount = 0

      data.status = Status.dowloading

      data.downloads = []

      active.result.forEach((download)=>{
        data.downloads.push(new Download(download).attributes())
      })

      waiting.result.forEach((download)=>{
        data.downloads.push(new Download(download).attributes())
      })

      stopped.result.forEach((download)=>{
        data.downloads.push(new Download(download).attributes())
      })
      
      data.downloads.forEach((download)=>{
        if(_.isMatch(download,data.filter)){
          download.isShow = true
        }else{
          download.isShow = false
        }
      })
  })
}

//搜索
$(()=>{
    $('body').on('keypress','#searchInput',function(e){
      if(e.keyCode==13){
        filterData({
          filename:$(this).val().trim()
        })

        refresh()
      }
  })
})

function filterData(obj){
  $.extend(data.filter,obj)
}

//显示列
const defaultColumns = ["filename","process","createTime"]
$(()=>{
  $('body').on('change','#showDetail',function(){
    let clicked = $(this).is(':checked')

    if(clicked){
      toggleColumns(1)
    }else{
      toggleColumns(0)
    }
  })

  function toggleColumns(show){
    let table = $('#itemTable')
  
    table.find('th,td').hide()
  
    if(show){
      table.find('th,td').show()
    }else{
      defaultColumns.forEach((name)=>{
        table.find('th[name="'+name+'"],td[name="'+name+'"]').show()
      })
    }
  }
})