/**
 * sample handlers 
 */

const handler = {};

handler.sampleHandler = (requestProperties,callback) =>{
    callback(200,{
        message:'sample handler okk',
    });
}

module.exports = handler;