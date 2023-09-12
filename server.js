'use strict'
const app = require('./src/app')
const {app: {port}} = require('./src/configs/config.mongodb')

const PORT = port
const server = app.listen(PORT, () => {
    console.log(`WSV ecommerce aliconcon start with ${PORT}`)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log('Exit server Express'))
// })