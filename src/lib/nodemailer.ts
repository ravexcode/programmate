//Imports the transporter function from nodemailer
import { createTransport } from "nodemailer";

//Create the transporter setting his settings
const transporter = createTransport({
  //Service type
  service: "gmail",
  //Service URL
  host: "smtp.gmail.com",
  //Service PORT
  port: 587,
  //No premium :(
  secure: false,
  //Email data
  auth: {
    user: process.env.ADMIN_API_GOOGLE_EMAIL,
    pass: process.env.ADMIN_API_GOOGLE_PASSWORD,
  },
});

export async function sendEmail(
  email: string | undefined,
  header: string,
  content: string,
){
  
  await transporter.sendMail({
    //Email sender
    from: process.env.EMAIL,
    //Email recivier
    to: email,
    //Title
    subject: header,
    //Content in HTML (desing made by ChatGPT)
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PrismaFlow</title>

      <style>
        :root {
          --primary-color: #81099C;
          --secondary-color: #A93ED6;
          --background-color: #120C13;
          --text-color: #f6f2ff;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--background-color);
          font-family: Arial, Helvetica, sans-serif;
          color: var(--text-color);
        }

        .wrapper {
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 300px;
          background-color: #1a1220;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        h1 {
          font-size: 20px;
          margin-bottom: 15px;
        }

        p {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          color: var(--text-color);
        }

        a.button {
          display: inline-block;
          padding: 10px 15px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 14px;
        }

        a.button:hover {
          opacity: 0.85;
        }

        .footer {
          font-size: 12px;
          margin-top: 15px;
          opacity: 0.7;
        }
      </style>
      </head>

      <body>
        <div class="wrapper">
          <div class="container">
            <h1>${header}</h1>

            <p>
              ${content}
            </p>

            <div class="footer">
              PrismaFlow Team
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  })
  .catch(e => {
    throw new Error("An error has happened while nodemailer was sending a mail.\nError: ", e.message);
  });

  return;
}