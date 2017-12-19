"use strict";

var files = []
var settings={
    host:"http://localhost"
}

let CHANNEL = {
    aria2:Symbol(),
    chrome:Symbol(),
}

let STATUS = {
    starting:Symbol(),
    downloading:Symbol(),
    suspend:Symbol(),
    stopped:Symbol(),
    deleted:Symbol(),
    downloaded:Symbol(),
    unknown:Symbol(),
}

let View = {
    refresh(files){
        $('[data-tr]').remove();

        files.forEach(file =>{
            $('#itemParent').append(template('itemTemplate',file))
            $('#itemParent tr:last').data('data',file)
        })
    },

    add(file){
        files.push(file)
        saveStorage()
    },

    saveStorage(){
        $.Storage.set('files',JSON.stringify(files))
    },

    getStorage() {
        files = JSON.parse($.Storage.get('files'))
    }
}

let Data ={
    add({channel = CHANNEL.aira2, status = STATUS.unknown, url, savename} = {}){
        var promise = new Promise(function(resolve, reject){

            // if(){
            //
            // }else{
            //
            // }
        }).then((value)=>{

        },(err)=>{

        })

    }
}