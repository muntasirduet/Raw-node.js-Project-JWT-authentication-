/**
 * Environments
 * handle on environments things
 */

//depediences

const crypto = require('crypto');
//module scafolding

const utilities = {};


utilities.parseJSON = (jsonString) => {
    let output;
    try{
        output = JSON.parse(jsonString);
    }catch{
        output = {};
    }
    return output;
}


utilities.hash = (str)=>{
    if(typeof(str) === 'string' && str.length >0){
        let hash1 = crypto.createHmac('akash123','akashbiswas').update(str).digest('base64');
        return hash1;

    }
    return false;
}


utilities.createRandomString = (strlength)=>{
    let length = strlength;
    length = typeof(strlength) == 'number' &&strlength>0 ?
    strlength:false;
    if(length){
        const possiblecharacter = 'abcdefghijklmnopqrstuvwx123456789';
        let output = '';
        for(let i = 1;i<=length;i++){
            let randomcharacter = possiblecharacter.charAt(Math.floor(Math.random()*length));
            output+=randomcharacter;
        }
        return output;
    }
    return false;
}



module.exports = utilities;