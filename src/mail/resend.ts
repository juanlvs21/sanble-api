import { Resend } from "resend";

import { RESEND_API_KEY, RESEND_DOMAIN } from "../config/env";

export const resend = new Resend(RESEND_API_KEY);

export function sendEmail(
  to: string,
  subject: string,
  template: any,
  from = `Sanble <no-reply@${RESEND_DOMAIN}>`
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        html: template,
      });

      if (error) {
        console.log("///////////////////////////////////////");
        console.error("Error resend:", error);
        console.log("///////////////////////////////////////");
        throw new Error(error.message);
      }

      resolve("Email sent successfully");
    } catch (error: any) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.error("Error sending email:", error);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      const errorMsg = "Error sending email";
      process.stderr.write(`❌ ${errorMsg} \n`);
      process.stderr.write(error);
      reject(errorMsg);
    }
  });
}
