import {utils,WINDOW} from '../multi/multi'
import Download from '../background/download'
const _ = require('lodash')



$(function(){
  
  var win = new WINDOW(this)
  console.log(this)
  //刷新列表数据，全部刷新
  function refresh(APPP){
    Promise.all([utils.RPCPromise('tellActive'),
      utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
      utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
      .then((results)=>{
        let [active,waiting,stopped] = results
          ,downloadingCount = 0,downloadedCount = 0

          data.downloads = []

          _.union(active.result,waiting.result,stopped.result).forEach((download)=>{
            // if(download.status=='active'){
            //   downloadingCount++
            // }

            // if(download.status=='waiting'){
            //   downloadingCount++
            // }

            // if(download.status=='paused'){
            //   downloadingCount++
            // }

            // if(download.status=='error'){
            //   downloadingCount++
            // }

            // if(download.status=='complete'){
            //   downloadedCount++
            // }

            // if(download.status=='removed'){
            //   // downloadingCount++
            // }

            data.downloads.push(new Download(download).attributes())
          })
      })
  }

  $('#itemTable').click(refresh)

  $('#testButtons li').click((ev)=>{
    utils.RPCPromise($(ev.target).closest('li').find('a').html()).then(win.alert).catch(win.alert)
  })

  const APPP = new Vue({
    el: '#app',
    data(){return {
      downloads:[]
    }},
    created(){
      console.log(this.downloads)
        this.refresh()
    },
    methods:{
       async refresh(){
        Promise.all([utils.RPCPromise('tellActive'),
        utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
        utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
        .then((results)=>{
          let [active,waiting,stopped] = results
            ,downloadingCount = 0,downloadedCount = 0
  
            this.downloads = []
  
            _.union(active.result,waiting.result,stopped.result).forEach((download)=>{
              // if(download.status=='active'){
              //   downloadingCount++
              // }
  
              // if(download.status=='waiting'){
              //   downloadingCount++
              // }
  
              // if(download.status=='paused'){
              //   downloadingCount++
              // }
  
              // if(download.status=='error'){
              //   downloadingCount++
              // }
  
              // if(download.status=='complete'){
              //   downloadedCount++
              // }
  
              // if(download.status=='removed'){
              //   // downloadingCount++
              // }
  
              this.downloads.push(new Download(download).attributes())
            })
            console.log(APPP.downloads)
        })
        }
    }
  })
})

