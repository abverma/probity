const express = require('express')
const path = require('path')

const dbManager = require('./db')

const app = express()

const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})
app.use((req, res, next) => {
    if (dbManager.getDb()) {
        next()
    }
    else {
        console.log('Db connection not ready')
        throw Error('Db connection not ready')
    }
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    console.log('home')
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/getDeeds', (req, res) => {
    let db = dbManager.getDb()
    let query = req.query 

    let collection = db.collection('deeds')
    
    if (collection) {
        collection.find(query).toArray()
        .then((result) => {
            res.send({
                success: true,
                data: result
            })
        })
        .catch(e => {
            console.log(e)
            res.send({
                success: false,
                err: e
            })
        })
        
    } else {
        console.log('Collection not found')
        res.send({
            success: false,
            err: 'Collection not found'
        })
    }
})

app.post('/addDeed', (req, res) => {
    console.log(req.body)
    console.log(req.params)
    const deed = req.body
    const db = dbManager.getDb()
    const collection = dbManager.getDb().collection('deeds')
    
    if (collection) {
        collection.insertOne(deed)
        .then((result) => {
            res.send({
                success: true
            })
        })
        .catch(e => {
            console.log(e)
            res.send({
                success: false,
                err: e
            })
        })
        
    } else {
        console.log('Collection not found')
        res.send({
            success: false,
            err: 'Collection not found'
        })
    }
})

app.listen(PORT,() => {
    console.log(`[${new Date().toUTCString()}] Server started`)
    console.log(`Listening at ${PORT}...`)
    console.log('Connecting to db')

	dbManager.connect((err, result) => {
		if (err) {
			console.log('Could not connect to db')
			error(err)
		}
		else {
			db = result
		}
	})
})