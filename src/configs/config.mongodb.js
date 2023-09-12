'use strict'


const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3056
    },
    db:{
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017, 
        name: process.env.DEV_DB_NAME || 'ecommerce_aliconcon'
    }
}

const pro = {
    app: {
        prot: process.env.PRO_APP_PORT || 3000
    },
    db:{
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'ecommerce_aliconcon_pro'
    }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]