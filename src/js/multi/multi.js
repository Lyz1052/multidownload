import Download from '../background/download'
import {_} from '../lib/lodash.min.js'
//一些工具类，减少重复代码

const utils = {
    /**
     * 保留一定精度
     * @param data 数据
     * @param accuracy 精度
     * @param removeZero 是否去掉末尾的0
    */
    toFixed:(data, accuracy, removeZero)=>{
        if (isNaN(accuracy))accuracy = 0;
        if (!isNaN(data)) {
            var right = true;
            if (data < 0) {
                right = !right;
                data = -data;
            }
            var base = Math.pow(10, accuracy);
            data = Math.round(data * base);
            var res = accuracy ? Math.floor(data / base) + "." : Math.floor(data / base);

            for (var i = 0; i < accuracy; i++) {
                base /= 10;
                res += Math.floor((data / base) % 10);
            }

            if (removeZero) {
                if (res.indexOf(".") != -1)
                    res = res.replace(/\.?0+$/g, '');
            }

            return right ? res : "-" + res;
        }
        return "";
    },

    parseUnit:(bitNumber,level)=>{
        bitNumber|=0
        if(bitNumber){
            level = level ||
            (Math.floor(Number((Math.log(bitNumber)/Math.log(1024))).toFixed(7)))
        }else{
            level = 0
        }

        let unit = [
            {
                name:'B',
                scale:1
            },
            {
                name:'K',
                scale:1024,
            },
            {
                name:'M',
                scale:1024 * 1024,
            },
            {
                name:'G',
                scale:1024 * 1024 * 1024,
            },
        ],cLevel = 0,cname='B',obj = {
            val:bitNumber/(unit[level].scale),
            unit:unit[level].name
        }

        obj.text = utils.toFixed(obj.val,2,true) + obj.unit

        return obj
    },

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
    constructor(){
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

    //重新加载媒体规则
    static reloadMedia(){
        // Multi.media = Global.localStorage.get('media',{
        //     version:'1.0',
        //     rules:[]//{type:'bilibili',website:'^https?://www.bilibili.com/video/av',media:['https://upos-hz-mirrorkodo.acgvideo.com/*.flv']}
        // })

        //目前不做版本比较，直接用新规则覆盖老规则
        Multi.media = {
            version:'1.0',
            rules:[]//{type:'bilibili',website:'^https?://www.bilibili.com/video/av',media:['https://upos-hz-mirrorkodo.acgvideo.com/*.flv']}
        }
    }

    static resetMedia(){
        Multi.media.rules = [
            {
                type:'bilibili',//类型名
                typeText:'bilibili',//类型名，用于显示在下载菜单中
                website:'^https?://www.bilibili.com/video/av',//网址正则
                patterns:['https://(.*)\.acgvideo\.com/.*\.flv'],//页面请求中媒体地址正则
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

    static mediaRule(url){
        let rule = _.find(Multi.media.rules,function(rule){
            return new RegExp(rule.website,'g').test(url)
        })

        if(rule)
            return rule

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
        //成功获取到下载状态时，生成一条历史记录
        download.start().then((result)=>{
            download.resolveStart(result).statusComplete((status)=>{
                Multi.history.add(download)
                if(typeof statusCallback == 'function')
                    statusCallback.apply(this,[status])
            })
        })
    }
}

/********************* 下载历史 *********************/
Multi.history = {
    add(obj = {}){
        let history = Global.localStorage.get('history',{
            downloads:[]
        })

        if(obj.gid){//如果找到下载记录，则修改记录的信息，否则添加这条记录
            let download = _.find(history.downloads,{
                gid:obj.gid
            })

            if(download){
                $.extend(download,obj)
            }else{
                history.downloads.push(obj)
            }
        }else{
            history.downloads.push(obj)
        }

        Global.localStorage.set('history',history)
    },

    get(filter = {}){
        let history = Global.localStorage.get('history',{
            downloads:[]
        })

        return _.filter(history.downloads,filter)
    }
}

// Multi.media = {}

export {utils,Global,Multi}