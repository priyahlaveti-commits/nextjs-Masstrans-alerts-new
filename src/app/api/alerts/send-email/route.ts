import { NextRequest, NextResponse } from 'next/server';
import { MasstransService } from '@/lib/services/masstrans.service';
import { PdfService } from '@/lib/services/pdf.service';
import { MailService } from '@/lib/services/mail.service';
import { validateSendEmailRequest } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, date, emails } = validateSendEmailRequest(body);

    // 1. Get alert records
    const data = await MasstransService.getAlarmDetails(vehicleNumber, date);
    if (!data.alerts || data.alerts.length === 0) {
      return NextResponse.json(
        { error: 'No alerts found for the selected vehicle and date.' },
        { status: 400 }
      );
    }

    // 2. Generate PDF
    const pdfBuffer = await PdfService.generateAlertsPdf(vehicleNumber, date, data.alerts);

    // 3. Send Email
    const subject = `Alert Report: ${vehicleNumber} (${date})`;
    const text = `Please find the below report\n\nTotal Alerts: ${data.totalAlerts}`;

    const attachments = [
      {
        filename: `Alerts_${vehicleNumber}_${date}.pdf`,
        content: pdfBuffer,
      },
    ];

    const result = await MailService.sendMailWithAttachment(emails, subject, text, attachments);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    const isClientError = error.message?.startsWith('vehicleNumber') || error.message?.startsWith('date') || error.message?.startsWith('emails');
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: isClientError ? 400 : 500 }
    );
  }
}
