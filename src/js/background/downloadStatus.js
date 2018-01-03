import utils from '../multi/multi'

class DownloadStatus{
    constructor(gid){
        this.gid = gid
    }

    getAll(followId = gid,prev){
        let get = async function(){
            let results = [],options = {}
            while(followId){
                await utils.RPCPromise('tellStatus',[followId,options]).then((result)=>{
                    results.push(result)
                    followId = result.followedBy
                })
            }
            return results
        }
        return get()
    }

    static reportStatus(results){
        console.log(results)
    }
}

export default DownloadStatus