export declare class MailService {
    private transporter;
    constructor();
    private initialize;
    sendMailWithAttachment(to: string[], subject: string, text: string, attachments: any[]): Promise<any>;
}
