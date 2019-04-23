const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { user1Id, user1, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Djakou',
        email: 'kim@ex.com',
        password: 'Mypass123'
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    //Assert that the database was changed correctly
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Djakou',
            email: 'kim@ex.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Mypass123')
})

test('Should not signup a new user with invalid name', async () => {
    await request(app).post('/users').send({
        name: {},
        email: 'kim@ex.com',
        password: 'Mypass123'
    }).expect(400)
})

test('Should not signup a new user with invalid email', async () => {
    await request(app).post('/users').send({
        name: 'Djakou',
        email: 'kim@ex',
        password: 'Mypass123'
    }).expect(400)
})

test('Should not signup a new user with invalid password', async () => {
    await request(app).post('/users').send({
        name: 'Djakou',
        email: 'kim@ex.com',
        password: 'Mypass'
    }).expect(400)
})

test('Should login succefully', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    const user = await User.findById(user1Id)
    
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'kim@ex.com',
        password: 'nonexisting'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Olga'
        })
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.name).toBe('Olga')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            location: 'Grenoble',
        })
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(400)
})

test('Should not update unauthenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Olga',
        })
        .set('Authorization', `Bearer jkjjoiqj"oé'_è`)
        .expect(401)
})


test('Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: {},
        })
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(400)
})

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            email: 'kim@ex',
        })
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(400)
})

test('Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            password: 'Mypass',
        })
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(400)
})