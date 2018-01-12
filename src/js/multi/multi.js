import {_} from '../lib/lodash.min.js'
//一些工具类，减少重复代码

const utils = {
    RPCInit:function(config={
        namespace:'aria2',
        port:6800,
    }){

        $.jsonRPC.setup({
            endPoint: 'http://localhost:'+config.port+'/jsonrpc',
            namespace: config.namespace
        });
    },

    RPCPromise:function(method,params = []){
        if(method.indexOf('system')==0){
            this.RPCInit({namespace:'system'})
        }else{
            this.RPCInit()
        }

        return new Promise((resolve,rejected)=>{
            $.jsonRPC.request(method, {
                params: params,
                success: resolve,
                error: rejected,
            });
        })
    },

    Alert(window,res){
        window.alert(window.JSON.stringify(res))
    }
}

//通用工具类
class Global{
    constructor(env,config){
        this.window = env.window||null
        this.console = env.console||null
        this.config = config
    }

    static copy(source){
        return JSON.parse(JSON.stringify(source))
    }

    static stringify(obj){
        let msg = ''
        try{
            msg = JSON.stringify(message)
        }catch(e){msg = message+''}
        return msg
    }


    //chrome.tabs 不指定ID，可以获取当前窗口
    static ALERT(message){
        chrome.tabs.executeScript({
            code:'alert("'+message+'")'
        })
    }
}

//静态属性
Global.localStorage = {
    set(name,item){
        if(typeof item == 'object'){
            item = JSON.stringify(item)
        }

        localStorage.setItem(name,item)
    },

    get(name,defaults){
        let obj = localStorage.getItem(name)
        if(!obj){
            localStorage.setItem(name,JSON.stringify(defaults))
            obj = defaults
        }else{
            obj = JSON.parse(obj)
        }

        return obj
    }
}

//下载相关工具类
class Multi{
    constructor(){

    }

    /********************* 网页媒体相关 *********************/
    static reloadMedia(){
        Multi.media = Global.localStorage.get('media',{
            version:'1.0',
            rules:[]//{type:'bilibili',website:'^https?://www.bilibili.com/video/av',media:['https://upos-hz-mirrorkodo.acgvideo.com/*.flv']}
        })
    }

    static resetMedia(){
        Multi.media.rules = [
            {
                type:'bilibili',//类型名
                website:'^https?://www.bilibili.com/video/av',//网址正则
                patterns:['https://upos-hz-mirrorkodo.acgvideo.com/.*\.flv'],//页面请求中媒体地址正则
            }
        ]
    }

    /**
     * 初始化媒体规则，或者加载指定的规则
     * @param {*} rules 
     */
    static loadMedia(rules){
        rules = !(rules instanceof Array)?[rules]:rules

        Multi.reloadMedia()
        if(!Multi.media.rules.length){
            Multi.resetMedia()
        }

        rules.forEach((rule)=>{
            if(rule){
                _.pullAllBy(Multi.media.rules, {type:rule.name}, 'type')
                Multi.media.rules.push(rule)
            }
        })

        Global.localStorage.set('media',Multi.media)
    }

    static mediaPatterns(url){
        let rule = _.find(Multi.media.rules,function(rule){
            return new RegExp(rule.website,'g').test(url)
        })

        if(rule)
            return rule.patterns

        return null
    }

    /********************* 下载相关 *********************/

    //这里不是下载请求的callback，是查询下载状态请求的callback
    static download(urls,statusCallback){
        urls = urls instanceof Array?urls:[urls]

        let download = new Download({
            urls:urls
        })

        //下载请求的callback
        download.start().then((result)=>{
            download.resolveStart(result).statusComplete(statusCallback)
        })
    }
}

// Multi.media = {}

export {utils,Global,Multi}