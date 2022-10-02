import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "../config/env";

export function sendEmail(
  to: string,
  subject: string,
  template: any,
  from = "Sanble <no-reply@sanble.juanl.dev>"
): Promise<any> {
  sgMail.setApiKey(SENDGRID_API_KEY);

  return new Promise(async (resolve, reject) => {
    try {
      const msg = {
        to,
        from,
        subject,
        html: template,
      };

      await sgMail.send(msg);

      resolve("Email sent successfully");
    } catch (error: any) {
      const errorMsg = "Error sending email";
      process.stderr.write(`❌ ${errorMsg} \n`);
      process.stderr.write(error);
      reject(errorMsg);
    }
  });
}
