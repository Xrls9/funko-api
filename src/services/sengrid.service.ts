import sgMail from '@sendgrid/mail';
import { TokenDto } from 'src/auth/dtos/response/token.dto';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export class SendgridService {
  async sendEmail(email: string, emailToken: TokenDto): Promise<void> {
    sgMail.send({
      to: email,
      subject: 'Account Verification',
      html: `<a href='http://localhost:3000/api/v1/users/verify/${emailToken.accessToken}' style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#348eda;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px">Verify Email</a>`,
      from: {
        name: 'Ravn Development Team',
        email: process.env.SENDGRID_SENDER_EMAIL as string,
      },
    });
  }
}
