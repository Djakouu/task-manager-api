const mongoose = require('mongoose')
const jwt =require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1Id,
    name: 'Thai',
    email: 'thai@ex.com',
    password: 'Free123',
    tokens: [{
        token: jwt.sign({ _id:user1Id }, process.env.JWT_SECRET)
    }]
}

const user2Id = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2Id,
    name: 'Olga',
    email: 'olga@ex.com',
    password: 'russia123',
    tokens: [{
        token: jwt.sign({ _id:user2Id }, process.env.JWT_SECRET)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: user1Id
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: user1Id
}

const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: user2Id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports = {
    user1Id,
    user2Id,
    user1,
    user2,
    task1,
    task3,
    setupDatabase
}