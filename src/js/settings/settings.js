import {utils,Global,Multi} from '../multi/multi'
import Download from '../background/download'
import { setTimeout } from 'timers';
import {_} from '../lib/lodash.min.js'
import { Stats } from 'fs';

const Status = {
  connecting:{name:'connecting',text:'Connecting',info:'maybe your aria2 did not started'},
  dowloading:{name:'dowloading',text:'Downloading',info:'view downloading items..'}
}

let data = {
  menu:1,//默认显示第一个菜单栏
  showDetail:false,
  status:Status.connecting,
  filter:{
    isMetadata:false//默认不显示bt下载的元数据文件（如果元数据正在下载中，则会显示）
  },
  downloads:[]
},app

$(()=>{
  
  var win = new Global(this)

  setInterval(()=>{
    if(data.status!=Status.connecting)
      refresh(1)
  },300)

  // $('body').on('click','table',function(){
  //   refresh(true)
  // })

  //快捷操作
  $('body').on('click','#testButtons li',(ev)=>{
    let eventObj = $(ev.target).closest('li').find('a'),event = eventObj.html()

    if(event == 'refresh'){
      refresh()
    }else{
      utils.RPCPromise(event).then(refresh).catch(console.log)
    }
  })  
  
  //这里仅仅使用Vue渲染模板，没有使用标准的Vue方式处理整个页面
  $('[data-hide-before]').show()
  app = new Vue({
    el:'#app',
    data:data,
    computed: {
      downloadss: function () {
          return this.downloads.map((e)=>{
            return $.extend(e,{showDetail:data.showDetail})
          })
      }
    }
  })
  
  refresh()
  Vue.nextTick(()=>{
    $('#config [type="checkbox"]').bootstrapSwitch()
  })


})

/**
 * 刷新下载
 * @param {是否部分刷新} isPartRefresh 
 */
function refresh(isPartRefresh){
  // data.status = Status.connecting

  if(!isPartRefresh)
    $('#overlay').show()

  Promise.all([utils.RPCPromise('tellActive'),
  utils.RPCPromise('tellWaiting',[0,Number.MAX_SAFE_INTEGER]),
  utils.RPCPromise('tellStopped',[0,Number.MAX_SAFE_INTEGER])])
  .then((results)=>{
    data.status = Status.dowloading

    if(!isPartRefresh)
      $('#overlay').hide()

    let [active,waiting,stopped] = results
      ,downloadingCount = 0,downloadedCount = 0,allDownloads = []

      data.status = Status.dowloading

      active.result.forEach((download)=>{
        allDownloads.push(new Download(download).attributes())
      })

      waiting.result.forEach((download)=>{
        allDownloads.push(new Download(download).attributes())
      })

      stopped.result.forEach((download)=>{
        allDownloads.push(new Download(download).attributes())
      })
      
      allDownloads.forEach((download)=>{
        if(isMatch(download,data.filter)){
          download.isShow = true
        }else{
          download.isShow = false
        }
      })

      // if(isPartRefresh){
      //   //部分刷新，根据gid匹配，未匹配到的删除，添加缺少的
      //   let removeIndex = []
      //   data.downloads.forEach((download,i)=>{
      //     let match = _.find(allDownloads,{
      //       gid:download.gid
      //     })

      //     if(match){
      //       Global.copyFrom(download,match)
      //     }else{
      //       removeIndex.push(i)
      //     }
      //   })

      //   _.pullAt(data.downloads,removeIndex)
      // }else{
      //   //全部刷新
      //   data.downloads = allDownloads
      // }
      data.downloads = allDownloads

      //相当于一次性的渲染回调
      
      // $('#config [type="checkbox"]').wrap('<div class="switch" />').parent().bootstrapSwitch()

      Vue.nextTick(toggleColumns)
  })
}

//操作
$(()=>{
  $('body').on('click','[data-operation]',function(e){
    let operation = $(this).attr('data-operation'),
    gid = $(this).closest('[data-gid]').attr('data-gid')

    if(operation == 'redownload'){

    }else{
      utils.RPCPromise(operation,[gid]).then(refresh).catch(console.log)
    }
  })
})

//搜索
$(()=>{
  $('body').on('keypress','#searchInput',(e)=>{
    if(e.keyCode==13){
      searchDownload()
    }
  }).on('click','#searchBtn',searchDownload)
    .on('click','#searchByStatus a[name]',function(){
      $(this).closest('ul').find('a[name]').addClass('hidei')
      $(this).removeClass('hidei')
      searchDownload({
        status:$(this).attr('name')
      })
    })

  function searchDownload(other){
    $.extend(data.filter,{
      filename:$('#searchInput').val().trim()
    },other)

    refresh()
  }
})

//搜索匹配
function isMatch(obj,source){
  let isMatch = true
  for(let p in source){
    if(p == 'filename'){
      if(source[p])
        isMatch &= (obj[p]||'').toLowerCase().indexOf(source[p].toLowerCase())!=-1
    }

    if(p == 'status'){
      if(source[p]){
        isMatch &= (obj[p]||'') === (source[p])
      }
    }

    if(p == 'isMetadata'){
      isMatch &= !!(obj[p]) == !!(source[p])
    }
  }
  return isMatch
}

//显示列
const defaultColumns = ["filename","process","createTime"]
$(()=>{
  $('body').on('click','[role="checker"]',function(e){
    let clicked = $(this).hasClass('checked')

    if(!clicked){
      $(this).addClass('checked')
      toggleColumns(1)
    }else{
      $(this).removeClass('checked')
      toggleColumns(0)
    }

    e.preventDefault()
    // e.stopPropagation()
  })

  //默认隐藏
  data.showDetail = false;
})

function toggleColumns(show = data.showDetail){
  let table = $('#itemTable')

  table.find('th,td').hide()

  if(show){
    table.find('th,td').show()
  }else{
    defaultColumns.forEach((name)=>{
      table.find('th[name="'+name+'"],td[name="'+name+'"]').show()
    })
  }

  data.showDetail = show
}

//切换菜单
$(()=>{
  $('body').on('click','#menuParent li[menu]',function(){
    data.menu = $(this).attr('menu')
  })
})
function changeMenu(index){
  $('[data-menu]')
}