import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        type: "OAUTH2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN
    }
})

export async function sendMail(to: string[], subject: string, html: string){
    const info = await transport.sendMail({
        from: `Sakura Hosting <${process.env.EMAIL_USER}>`,
        to: to.reduce((previous, current) => `${previous}, ${current}`),
        subject: subject,
        html: html
    })

    return info;
}