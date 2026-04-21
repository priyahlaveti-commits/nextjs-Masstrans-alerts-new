import { MAIL_CONFIG } from '../config/mail';

// For Next.js, we'll use nodemailer
// Make sure to install: npm install nodemailer
export class MailService {
  private static transporter: any;

  private static async initialize() {
    if (this.transporter) return;

    const nodemailer = (await import('nodemailer')).default;
    this.transporter = nodemailer.createTransport({
      host: MAIL_CONFIG.host,
      port: MAIL_CONFIG.port,
      secure: MAIL_CONFIG.port === 465,
      auth: {
        user: MAIL_CONFIG.user,
        pass: MAIL_CONFIG.pass,
      },
    });
    console.log(`MailService initialized with AWS SES SMTP: ${MAIL_CONFIG.user}`);
  }

  static async sendMailWithAttachment(
    to: string[],
    subject: string,
    text: string,
    attachments: any[],
  ) {
    try {
      await this.initialize();

      const info = await this.transporter.sendMail({
        from: `"Masstrans Alerts" <${MAIL_CONFIG.from}>`,
        to: to.join(', '),
        subject,
        text,
        attachments,
      });

      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Mail send error:', error);
      throw error;
    }
  }
}
