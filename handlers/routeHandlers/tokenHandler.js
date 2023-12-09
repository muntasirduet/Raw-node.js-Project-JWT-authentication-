/**
 * sample handlers 
 */
// dependencies

const { hash, parseJSON, createRandomString } = require("../../helpers/utilities");
const data = require("../../lib/data");

const handler = {};
handler._token = {};


handler.tokenHandler = (requestProperties,callback) =>{

    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperties.method)>-1){
        handler._token[requestProperties.method](requestProperties,callback)
    }else{
        callback(405,{
            message:'this is error',
        });
    }
    
}



handler._token.post = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length  === 11 ?
    requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' ?
    requestProperties.body.password : false;

    if(phone && password){
        data.read('users',phone,(err,userdata)=>{
            if(password === parseJSON(userdata).password){
                let tokenId = createRandomString(20);
                let expires = Date.now()+ 60 * 60 * 1000;
                let tokenObject = {
                    phone,
                    'id':tokenId,
                    expires,
                }


                data.create('tokens',tokenId,tokenObject,(err1)=>{
                    if(!err1){
                        callback(200,tokenObject)
                    }
                    else{
                        callback(500,{
                            error:'there is server sisde error',
                        })
                    }
                })

            }else{
                callback(400,{
                    error:'password is not valid',
                })
            }
        })
    }else{
        callback(400,{
            error:'you have problem in your request',
        })
    }
}

handler._token.get = (requestProperties,callback)=>{
    const id = typeof(requestProperties.queryString.id) === 'string' && requestProperties.queryString.id.trim().length  === 20 ?
    requestProperties.queryString.id : false;

    if(id){
        data.read('tokens',id,(err,u)=>{
            if(!err){
                const token = {...parseJSON(u)}
                callback(200,token);
            }else{
                callback(400,{
                    error:'Token not found',
                })
            }
            
        })
    }else{
        callback(400,{
            error:'Token not found ',
        })
    }
}

handler._token.put = (requestProperties,callback)=>{
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length  === 20 ?
    requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ?
    true : false;

    if(id && extend){
        data.read('tokens',id,(err,tokenData)=>{
            if(parseJSON(tokenData).expires >Date.now()){
                parseJSON(tokenData).expires = Date.now()+60*60*1000;
                data.update('tokens',id,parseJSON(tokenData),(err1)=>{
                    if(!err1){
                        callback(200,{
                            success:'token updated successfully',
                        })
                    }
                    else{
                        callback(500,{
                            error:'there was an server side error',
                        })
                    }
                })
            }else{
                callback(400,{
                    error:'token expired',
                })
            }
        })
    }else{
        callback(400,{
            error:'thre is a problem in your request',
        })
    }

}

handler._token.delete = (requestProperties,callback)=>{
    const id = typeof(requestProperties.queryString.id) === 'string' && requestProperties.queryString.id.trim().length  === 20 ?
    requestProperties.queryString.id : false;
    console.log(id);
    if(id){
        data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                data.delete('tokens',id,(err1)=>{
                    if(!err1){
                        callback(200,{
                            success:'token was deleted successfully',
                        })
                    }else{
                        callback(500,{
                            error:'there was an server side error',
                        })
                    }
                })
            }else{
                callback(400,{
                    error:'token is not in db',
                })
            }
        })
    }else{
        callback(400,{
            error:'token was delete is not successfully',
        })
    }
}

handler._token.verify = (id,phone,callback)=>{
    data.read('tokens',id,(err,tokenData)=>{
        if(!err && tokenData){
            if(parseJSON(tokenData).phone === phone &&parseJSON(tokenData).expires>Date.now()){
                callback(true);
            }
            else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
}



module.exports = handler;