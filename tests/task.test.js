const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { user1Id, user2Id, user1, user2, task1, task2, task3, setupDatabase, } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 'From test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should not create task with invalid description', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: {}
        })
        .expect(400)
})

test('Should not create task with invalid completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            completed: 'completed'
        })
        .expect(400)
})

test('Should get all tasks for user1', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2)
})

test('Should get user task by id', async () => {
        await request(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should get user1 compelted tasks', async () => {
    const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toBe(1)
})

test('Should get user1 incompelted tasks', async () => {
    const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toBe(1)
})

test('Should sort user1 tasks by createdAt: desc', async () => {
    const response = await request(app)
    .get('/tasks?sortBy=createdAt:desc')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body[0].description).toBe('Second task')
})

test('Should sort user1 tasks by createdAt: asc', async () => {
    const response = await request(app)
    .get('/tasks?sortBy=createdAt:asc')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body[0].description).toBe('First task')
})

test('Should not get user task by id if unauthenticated', async () => {
    await request(app)
    .get(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer kjh897hjkg`)
    .send()
    .expect(401)
})

test('Should not get other user task', async () => {
    await request(app)
    .get(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)
})

test('Should  update task correctly', async () => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 'updated',
            completed: true
        })
        .expect(200)
})

test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: {}
        })
        .expect(400)
})

test('Should not update task with invalid completed', async () => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            completed: 'completed'
        })
        .expect(400)
})

test('Should not update non owned task', async () => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            completed: 'completed'
        })
        .expect(404)
})

test('Should delete owned task', async () => {
    await request(app)
        .delete(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(task3._id)
    expect(task).toBeNull()
})

test('Should not delete non owned task', async () => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
        
})

test('Should not delete task if unauthneticated', async () => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer hki239ljhà0j`)
        .send()
        .expect(401)
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()      
})