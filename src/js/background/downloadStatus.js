const co = require('co')

class DownloadStatus{
    constructor(startGid){
        this.gid = startGid
        this.statusChain = {}
    }

    jsonRPC(gid,onSuccess,onError){
        if(gid)
            $.jsonRPC.request('tellStatus', {
                params: [gid,options],
                success: onSuccess,
                error: onError
            })
    }

    getAll(followId = this.gid,prev){
        return co(function* get(followId) {
            this.jsonRPC((result)=>{
                var nextId = result.followedBy
                if(nextId)
                    get(yield nextId)
            },(err)=>{})
        })
    }
}

export default DownloadStatus