import DownloadStatus from './downloadStatus'
import {utils} from '../multi/multi'
const path = require('path')
const math = require('mathjs')

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
        this.numSeeders = download.numSeeders
        this.downloadSpeed = download.downloadSpeed
        if(download.files)
            this.filename = download.files.map((file)=>{return path.basename(file.path)})
                                .join(",")
        this.downloadSpeed = download.downloadSpeed
    }

    attributes(){
        return {
            process:(math.round((this.completedLength|0)/(this.totalLength|0)*100,2)||0),
            gid:this.gid,
            filename:this.filename,
            status:this.status,
            totalLength:this.totalLength,
            completedLength:this.completedLength,
            connections:this.connections,
            downloadSpeed:this.downloadSpeed,
            numSeeders:this.numSeeders,
            downloadSpeed:this.downloadSpeed,
        }
    }

    start(options = {}){
        if(this.urls){
            return utils.RPCPromise('addUri',[this.urls,options])
        }
    }

    //开始下载成功，会返回一个下载状态
    resolveStart(result){
        this.gid = result.result
        utils.RPCPromise('saveSession').finally()//保存下载状态
        this.status = new DownloadStatus(result)
        return this
    }

    //处理下载状态
    statusComplete(status,error){
        return this.status.promise.then(status,error)
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