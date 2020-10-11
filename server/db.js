const { MongoClient, ObjectID } = require('mongodb')
// const {logger, log, error} = require('./customLogger')
const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    LOG_LEVEL } = process.env

let uri = `mongodb://localhost:27017/probity?retryWrites=true&w=majority&connectTimeoutMS=300000`

// if (DB_HOST == 'localhost' || DB_HOST == '0.0.0.0') {
// 	uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
// } else {
// 	uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
// }

const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    loggerLevel: LOG_LEVEL
})

let db = null

exports.connect = (callback) => {

    client.connect(err => {
        if (err) {
            error(err)
            if (callback) {
                return callback(err)
            } else {
                return Promise.reject(err)
            }
        }

        console.log('Connection successful!')
        db = client.db('probity')

        if (callback) {
            return callback(null, db)
        } else {
            return Promise.resolve(db)
        }

    })

}

exports.getDb = () => {
    return db
}

exports.getUri = () => {
    return uri
}

exports.close = () => {
    client.close()
        .then(() => {
            console.log('Connection closed!')
        })
        .catch((err) => {
            console.log(err)
            console.log('Error in closing connection!')
        })
}