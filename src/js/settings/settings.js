import utils from '../multi/multi'
import Download from '../background/download'
const _ = require('lodash')
let downloads = []

$(function(){
  $('#itemTable').click(refresh)
  refresh()
})

function refresh(){
  Promise.all([utils.RPCPromise('tellActive'),
    utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
    utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
    .then((results)=>{
      let [active,waiting,stopped] = results
        ,downloadingCount = 0,downloadedCount = 0

        downloads = []

        _.union(active.result,waiting.result,stopped.result).forEach((download)=>{
          if(download.status=='active'){
            downloadingCount++
          }

          if(download.status=='waiting'){
            downloadingCount++
          }

          if(download.status=='paused'){
            downloadingCount++
          }

          if(download.status=='error'){
            downloadingCount++
          }

          if(download.status=='complete'){
            downloadedCount++
          }

          if(download.status=='removed'){
            // downloadingCount++
          }

          // if(!downloads.some((d)=>{
          //   return d.gid == download.gid
          // })){
          //   downloads.push(new Download(download))
          // }
          downloads.push(new Download(download))
        })

        // downloads.forEach((download)=>{
        //   let tr = $('[data-gid="'+download.gid+'"]')
        //   let attrs = download.attributes
        //   if(tr.length)
        //     for(let p in attrs){
        //       tr.find('td[name="'+p+'"]').html(dattrs[p])
        //     }
        //   else
        //     $('#itemParent').append(template('itemTemplate',attrs))
        // })
        $('[data-gid]').remove()
        downloads.forEach((download)=>{
            $('#itemParent').append(template('itemTemplate',download.attributes))
        })
    })
}