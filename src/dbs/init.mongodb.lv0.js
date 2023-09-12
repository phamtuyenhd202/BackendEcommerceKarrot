'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/ecommerce_karrot'

mongoose.connect(connectString)
.then( () => console.log(`Connected Mongodb Success`))
.catch(() => console.log(`Error Connect!!`))

if(1===1){
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose