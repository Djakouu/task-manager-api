const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'mzkimouche@gmail.com',
        subject: 'Welcoming msg',
        text: `Welcome ${name} to the app!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'mzkimouche@gmail.com',
        subject: 'Good Bye',
        text: `We were pleased to have you among us, ${name}. 
        You are welocme back anytime! if you want to let us know why you left or how could we have done to keep you 
        please feel free to express your ideas. Best Greetings. 
        WebAppTeam`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}