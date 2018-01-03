import DownloadStatus from './downloadStatus'
import utils from '../multi/multi'
const _ = require('lodash')
const path = require('path')

class Download{
    constructor(download){
        this.constructObject = download

        this.urls = download.urls
        this.connections = download.connections
        this.completedLength = download.completedLength
        this.totalLength = download.totalLength
        this.status = download.status
        this.gid = download.gid
        this.numPieces = download.numPieces
        this.errorMessage = download.errorMessage
        this.errorCode = download.errorCode
        this.filename = download.files.map((file)=>{return path.basename(file.filePath)})
                            .join(",")
        this.downloadSpeed = download.downloadSpeed
    }

    attributes(){
        return {
            gid:this.gid,
            filename:this.filename,
            status:this.status,
            totalLength:this.totalLength,
            completedLength:this.completedLength,
            connections:this.connections,
            downloadSpeed:this.downloadSpeed,
        }
    }

    start(options = {}){
        if(this.urls)
            return utils.RPCPromise('addUri',[this.urls,options])
    }

    //开始下载成功，会返回一个下载状态
    static startResolver(download,result){
        download.gid = result.result

        return download.status = new DownloadStatus(download.gid)
    }

    pause(options = {}){
        if(this.gid)
            return utils.RPCPromise('pause',[this.gid,options])
    }

    remove(options = {}){
        if(this.gid)
            return utils.RPCPromise('remove',[this.gid,options])
    }
    
}

export default Download