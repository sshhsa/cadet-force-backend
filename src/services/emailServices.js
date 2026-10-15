import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import handlebars from "handlebars";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM,
  APP_URL = "http://localhost:3000",
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: Number(MAIL_PORT) === 465,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async ({ email, verificationToken }) => {
  const templatePath = path.join(__dirname, "../templates/verify-email.hbs");
  const templateSource = await fs.readFile(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const verifyLink = `${APP_URL}/api/auth/verify/${verificationToken}`;

  // Dev-зручність: лінк підтвердження завжди дублюється в лог, незалежно
  // від того, чи реально дійшов лист (корисно, поки перевіряємо доставку).
  console.log(`[email] Лінк підтвердження для ${email}: ${verifyLink}`);

  const html = template({ verifyLink });

  try {
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: "Please confirm your email",
      html,
    });

    // Показує, що саме відповів поштовий сервер: messageId підтверджує, що
    // лист прийнятий для доставки; accepted/rejected — чи прийняв сервер
    // саме цю адресу одержувача.
    console.log(
      `[email] SMTP відповів: messageId=${info.messageId}, accepted=${JSON.stringify(info.accepted)}, rejected=${JSON.stringify(info.rejected)}, response="${info.response}"`,
    );
  } catch (error) {
    console.error(`[email] Помилка відправки листа на ${email}:`, error.message);
    throw error;
  }
};
