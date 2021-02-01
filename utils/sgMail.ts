import sgMail from "@sendgrid/mail";

import { SENDGRID_KEY, SENDGRID_EMAIL_FROM } from "./env";

sgMail.setApiKey(SENDGRID_KEY);

export const welcomeEmail = (to: string) => {
  const msg = {
    to,
    from: SENDGRID_EMAIL_FROM,
    subject: "Bienvenido a Sanble",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  return new Promise(async (resolve, rejects) => {
    await sgMail
      .send(msg)
      .then(() => resolve("Email sent successfully"))
      .catch((error) => {
        if (error.response) console.error(error.response.body);
        else console.error(error);
        rejects(null);
      });
  });
};
