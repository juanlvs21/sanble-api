import sgMail from "@sendgrid/mail";

import { SENDGRID_KEY, SENDGRID_DOMAIN } from "./env";

// Templates
import welcome from "../templates/welcome";

sgMail.setApiKey(SENDGRID_KEY);

export const welcomeEmail = (to: string, displayName: string, link: string) => {
  const msg = {
    to,
    from: `Equipo Sanble <welcome${SENDGRID_DOMAIN}>`,
    subject: "Bienvenido a Sanble",
    html: welcome(displayName, link),
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
