import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_CONFIG } from '../config/mail.config';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.initialize();
  }

  private async initialize() {
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

  async sendMailWithAttachment(
    to: string[],
    subject: string,
    text: string,
    attachments: any[],
  ) {
    try {
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
