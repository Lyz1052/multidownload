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

class WINDOW{
    constructor(window,config){
        this.window = window
        this.config = config
    }

    alert(message){
        window.alert(window.JSON.stringify(message))
    }

    //chrome.tabs 不指定ID，可以获取当前窗口
    static ALERT(message){
        chrome.tabs.executeScript({
            code:'alert("'+message+'")'
        })
    }
}

export {utils,WINDOW}