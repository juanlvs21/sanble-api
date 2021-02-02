import sgMail from "@sendgrid/mail";

import { SENDGRID_KEY, SENDGRID_DOMAIN } from "./env";

// Templates
import welcome from "../templates/welcome";

sgMail.setApiKey(SENDGRID_KEY);

export const welcomeEmail = (to: string, name: string, token: string) => {
  const msg = {
    to,
    // from: `Equipo Sanble <welcome${SENDGRID_DOMAIN}>`,
    from: `Equipo Sanble <welcome@prueba>`,
    subject: "Bienvenido a Sanble",
    html: welcome(name, token),
  };

  return new Promise(async (resolve, rejects) => {
    await sgMail
      .send(msg)
      .then(() => resolve("Email sent successfully"))
      .catch((error) => {
        if (error.response) rejects(error.response.body.errors);
        else rejects(error);
      });
  });
};
