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
    }
}

export default utils