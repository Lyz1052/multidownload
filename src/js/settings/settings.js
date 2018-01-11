import {utils,WINDOW} from '../multi/multi'
import Download from '../background/download'
import { setTimeout } from 'timers';
// const _ = require('lodash')

let data = {
  downloads:[]
}

$(()=>{
  
  var win = new WINDOW(this)

  $('body').on('click','#itemTable',function(){
    refresh()
  })
  
  $('#testButtons li').click((ev)=>{
    utils.RPCPromise($(ev.target).closest('li').find('a').html()).then(win.alert).catch(win.alert)
  })
  
  //这里仅仅使用Vue渲染模板，没有使用标准的Vue方式
  let app = new Vue({
    el:'#app',
    data:data,
  })

  refresh()
})

function refresh(){
  Promise.all([utils.RPCPromise('tellActive'),
  utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
  utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
  .then((results)=>{
    let [active,waiting,stopped] = results
      ,downloadingCount = 0,downloadedCount = 0

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
  })
}

