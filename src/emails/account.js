import nodeMailer from 'nodemailer';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const sendWelcomeEmail = async (email, name) => {
    console.log(email)
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        },
    });
    const info = await transporter.sendMail({
        from: `Task Manager <${process.env.EMAIL}>`,  
        to: email,
        subject: 'Happy for you to join us!',
        html: `Welcome to the app, ${name}. let me know what you think`
    });
}

 


export const sendByeEmail = async (email, name) => {
    console.log(email)
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        },
    });
    const info = await transporter.sendMail({
        from: `Task Manager <${process.env.EMAIL}>`, 
        to: email,
        subject: 'Sad to see you go!',
        html: `Goodbye,  ${name}. let me know how we could've kept you`
    });
}

