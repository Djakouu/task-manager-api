const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const _id = new ObjectID()


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error)
        return console.log('Unable to connect to database')
    
    const db = client.db(databaseName)
    db.collection('tasks').insertMany([{
        _id,
        description: 'final',
        completed: true
    }, {
        _id,
        description: 'almost done',
        completed: false
    }], (error, result) => {
        if (error)
            return console.log('Unable to insert user')

        console.log(result.ops)
    })
})