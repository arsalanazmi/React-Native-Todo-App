import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, text) => {
  const transport = createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMPT_USER,
    to: email,
    subject,
    text,
  });
};
