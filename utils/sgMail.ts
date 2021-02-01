import sgMail from "@sendgrid/mail";

import { SENDGRID_KEY } from "./env";

sgMail.setApiKey(SENDGRID_KEY);

export const welcomeEmail = (to: string) => {
  const msg = {
    to,
    from: "Equipo de Sanble <em1273.mail.sanble.ml>",
    subject: "Bienvenido a Sanble",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  return new Promise(async (resolve, rejects) => {
    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
