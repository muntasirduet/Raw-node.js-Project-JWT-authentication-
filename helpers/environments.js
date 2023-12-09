/**
 * Environments
 * handle on environments things
 */

//depediences


//module scafolding

const environments = {};


environments.staging = {
    port:3000,
    envName:'Staging',
}

environments.production = {
    port:3001,
    envName:'Production',
}


//determine which env

const currentEnvironment = typeof process.env.NODE_ENV ==='string' ? process.env.NODE_ENV:'staging';

const environmentsToExport = 
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentsToExport;