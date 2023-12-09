/**
 * sample handlers 
 */
// dependencies

const { hash, parseJSON } = require("../../helpers/utilities");
const data = require("../../lib/data");
const tokenHandler = require("./tokenHandler");



const handler = {};
handler._users = {};


handler.userHandler = (requestProperties,callback) =>{

    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperties.method)>-1){
        handler._users[requestProperties.method](requestProperties,callback)
    }else{
        callback(405,{
            message:'this is error',
        });
    }
    
}



handler._users.post = (requestProperties,callback)=>{
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length  > 0 ?
    requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length  > 0 ?
    requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length  === 11 ?
    requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' ?
    requestProperties.body.password : false;

    const toAgreement = typeof(requestProperties.body.toAgreement) === 'boolean' ?
    requestProperties.body.toAgreement : false;


    if(firstName && lastName && phone && password && toAgreement){

        data.read('users',phone,(err) =>{
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password:(password),
                    toAgreement,
                }

                //store the database

                data.create('users',phone,userObject, (err1)=>{
                    if(!err1){
                        callback(200,{
                            message:'User was created successfully',
                        })
                    }else{
                        callback(500,{
                            error:'could not created user',
                        })
                    }
                })

            }else{
                callback(500,{
                    error:'there is an problem in server side',
                })
            }
        })



    }else{
        callback(400,{
            error:'You Have a problem in your request',
        })
    }


}

handler._users.get = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.queryString.phone) === 'string' && requestProperties.queryString.phone.trim().length  === 11 ?
    requestProperties.queryString.phone : false;

    if(phone){
        let token = typeof(requestProperties.header.token) ==='string' ?
        requestProperties.header.token:false;

        tokenHandler._token.verify(token,phone,(tokenid)=>{
            if(tokenid){
                data.read('users',phone,(err,u)=>{
                    if(!err){
                        const user = {...parseJSON(u)}
                        delete user.password;
                        callback(200,user);
                    }else{
                        callback(400,{
                            error:'User not found', 
                        })
                    }
                    
                })
            }else{
                callback(403,{
                    error:'Authentication failed',
                })
            }
        })
        
    }else{
        callback(400,{
            error:'User not found ',
        })
    }
}

handler._users.put = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length  === 11 ?
    requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length  > 0 ?
    requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length  > 0 ?
    requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string' ?
    requestProperties.body.password : false;

    if(phone){
        let token = typeof(requestProperties.header.token) ==='string' ?
        requestProperties.header.token:false;

        tokenHandler._token.verify(token,phone,(tokenid)=>{
            if(tokenid){
                if(firstName || lastName || password){
                    data.read('users',phone,(err,udata)=>{
                        const userdata = {...parseJSON(udata)}
                        if(!err &&  userdata){
                            if(firstName){
                                userdata.firstName = firstName;
                            }
        
                            if(lastName){
                                userdata.lastName = lastName;
                            }
        
                            if(password){
                                userdata.password = password;
                            }
                            console.log(userdata)
                            data.update('users',phone,userdata,(err2)=>{
                                if(!err2){
                                    callback(200,{
                                        success:'user was updated successfully',
                                    })
                                }else{
                                    callback(500,{
                                        error:'server side error'
                                    })
                                }
                            })
                        }
                        else{
                            callback(400,{
                                error:'you have ans problem in your request',
                            })
                        }
                    })
        
        
                }else{
                    callback(400,{
                        error:'You have a problem in your request',
                    })
                } 
            }else{
                callback(404,{
                    error:'authentication failed'
                })
            }
        })
        

    }else{
        callback(400,{
            error:'invalid phone number, please try again',
        })
    }
}

handler._users.delete = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.queryString.phone) === 'string' && requestProperties.queryString.phone.trim().length  === 11 ?
    requestProperties.queryString.phone : false;

    if(phone){
        data.read('users',phone,(err,userData)=>{
            if(!err && userData){
                data.delete('users',phone,(err1)=>{
                    if(!err1){
                        callback(200,{
                            success:'file was deleted success fully',
                        })
                    }else{
                        callback(500,{
                            error:'there was an server side error',
                        })
                    }
                })
            }else{ 
                callback(400,{
                    error:'file is not in db',
                })
            }
        })
    }else{
        callback(400,{
            error:'delete is not successfully',
        })
    }
}



module.exports = handler;