import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Nexum",
      link: "https://tasknexum.com", //this does not exists
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transpoter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });
  const mail = {
    from: "mail.nexum@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transpoter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently, Make sure your provided MAILTRAP credentails in .env file is correct",
    );
    console.error("Error", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Nexum! we'are excited to have you on board.",
      action: {
        instructions: "To verify your email please click the button below",
        button: {
          color: "#5B34FF",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just replay to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passresetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a reuqest to reset the password for your account",
      action: {
        instructions:
          "To reset the password please click the button below or link",
        button: {
          color: "#2500bb",
          text: "Reset Password",
          link: passresetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just replay to this email, we'd love to help.",
    },
  };
};
export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
