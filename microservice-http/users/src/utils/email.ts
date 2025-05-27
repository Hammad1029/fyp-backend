import nodemailer from "nodemailer";
import * as constants from "@/utils/constants";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: constants.nodemailer.email,
    pass: constants.nodemailer.password,
  },
});

interface emailParams {
  to: string[];
  subject: string;
  body: string;
}

const sendEmail = async (params: emailParams): Promise<string | null> => {
  try {
    if (params.to.length === 0) return null;
    const verified = await transporter.verify();
    if (verified) {
      const email = await transporter.sendMail({
        from: constants.nodemailer.email,
        to: params.to.join(","),
        subject: params.subject,
        html: params.body,
      });
      return null;
    } else throw Error("SMTP connection could not be verified");
  } catch (e) {
    return String(e);
  }
};

export default sendEmail;
