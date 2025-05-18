import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tayyab.ejaz@mqvantage.com",
        pass: "txujyskypwytmldv",
    },
});
export default transporter;