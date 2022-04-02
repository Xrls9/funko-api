import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendEmail(
    email: string,
    template: string,
    subject: string,
  ): Promise<void> {
    SendGrid.send({
      to: email,
      subject,
      html: template,
      from: {
        name: 'Ravn Development Team',
        email: process.env.SENDGRID_SENDER_EMAIL as string,
      },
    });
  }
}
