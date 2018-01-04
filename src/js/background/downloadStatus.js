import {utils} from '../multi/multi'

class DownloadStatus{
    constructor(result){
        this.gid = result.result
        this.promise = this.init()
    }

    init(){
        return utils.RPCPromise('tellStatus',[this.gid]).then((result)=>{
            this.downloadResult = result.result
            this.status = result.status
            return this
        })
    }

    get(p){
        if(!this.downloadResult){
            this.init()
        }else{
            return this.downloadResult[p]
        }
    }

    //bt 下载的所有下载状态
    getAllStatusPromise (followId = this.gid,prev){
        let get = async function(){
            let results = [],options = {}
            while(followId){
                await utils.RPCPromise('tellStatus',[followId]).then((result)=>{
                    results.push(result)
                    followId = result.followedBy
                })
            }
            return results
        }
        return get()
    }

    reportStatus(result){
        console.log(result)
    }
}

export default DownloadStatus