import {channel,status} from './enums.js'

var ai;

class File{
    constructor({channel = channel.aira2, status = status.unknown, url, savename} = {}){
        this.channel = channel
        this.status = status
        this.url = url
    }

    start(){
        this.downloadstart = new Date()
        this.status = status.downloading

    }
}

export {ai as AI};