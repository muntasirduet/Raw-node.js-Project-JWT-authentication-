/**
 * not found handlers 
 */

const handler = {};

handler.notFoundHandler = (requestProperties,callback) =>{
    callback(500,{
        error:'This is error',
    })
}

module.exports = handler;