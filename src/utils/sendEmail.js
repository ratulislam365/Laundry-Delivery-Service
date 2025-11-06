
import nodemailer from 'nodemailer';

/*
To use this email utility, you need to configure the transporter with your email service provider's settings.
For example, if you are using Gmail, you will need to enable "Less secure app access" in your Google account settings.
Then, you can use the following environment variables in your .env file:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password

*/

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'Wellbyn <no-reply@wellbyn.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
