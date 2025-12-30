import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Render an EJS email template
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {
    const templatePath = path.join(process.cwd(), 'auth-service', 'src', 'utils', 'email-templates', `${templateName}.ejs`);
    return ejs.renderFile(templatePath, data);
}

// send an email using nodemailer
export const sendEmail = async (to: string, subject: string, templateName: string, templateData: Record<string, any>) => {
    try {
        const htmlContent = await renderEmailTemplate(templateName, templateData);

        const mailOptions = {
            from: `<${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} with subject: ${subject}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        return false
    }
}