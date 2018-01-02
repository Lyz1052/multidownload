import DownloadStatus from './downloadStatus'

class Download{
    constructor(urls){
        this.urls = urls
    }

    start(options = {}){
        return new Promise((resolve,rejected)=>{
            $.jsonRPC.request('addUri', {
                params: [this.urls,options],
                success: resolve,
                error: rejected,
            });
        })
    }
}

export default Download