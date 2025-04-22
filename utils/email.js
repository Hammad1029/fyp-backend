var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
const senderEmail = process.env.NODEMAILER_EMAIL;
const senderPassword = process.env.NODEMAILER_PASSWORD;
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: senderEmail,
        pass: senderPassword,
    },
});
const sendEmail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (params.to.length === 0)
            return null;
        const verified = yield transporter.verify();
        if (verified) {
            const email = yield transporter.sendMail({
                from: senderEmail,
                to: params.to.join(","),
                subject: params.subject,
                html: params.body,
            });
            return null;
        }
        else
            throw Error("SMTP connection could not be verified");
    }
    catch (e) {
        return String(e);
    }
});
export default sendEmail;
//# sourceMappingURL=email.js.map