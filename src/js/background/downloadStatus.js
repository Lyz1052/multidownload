const co = require('co')

class DownloadStatus{
    constructor(){
    }

    getAll(followId,prev){
        let get = async function(){
            let results = [],options = {}
            while(followId){
                await new Promise((resolve,reject)=>{
                    $.jsonRPC.request('tellStatus', {
                        params: [followId],
                        success: resolve,
                        error: reject
                    })
                }).then((result)=>{
                    results.push(result)
                    followId = result.followedBy
                })
            }
            return results
        }
        return get()
    }
}

export default DownloadStatus