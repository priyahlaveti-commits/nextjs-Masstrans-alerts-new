// SMTP Configuration for Daily Alert Reports
export const MAIL_CONFIG = {
  host: process.env.MAIL_HOST || "email-smtp.ap-south-1.amazonaws.com",
  port: parseInt(process.env.MAIL_PORT || "587", 10),
  user: process.env.MAIL_USER || "",
  pass: process.env.MAIL_PASS || "",
  from: process.env.MAIL_FROM || "harithapriya.l@freshbus.com",
};
