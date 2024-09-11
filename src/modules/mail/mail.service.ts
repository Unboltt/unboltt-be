import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";


@Injectable()
export class MailService{
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(url:string, name:string, email:string){
    await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Unboltt!',
        template: './welcome.ejs',
        context: { 
          name,
          url,
          email,
          year: new Date().getFullYear()
        },
    });
  }

  async sendResetPasswordEmail(url:string, name:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './resetPassword.ejs',
      context: { 
        url,
        name,
        email,
        year: new Date().getFullYear()
      },
    });
  }

  async sendConfirmEmail(url:string, name:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your email address',
      template: './confirmEmail.ejs',
      context: { 
        url,
        name,
        email,
        year: new Date().getFullYear()
      },
    });
  }

  async sendWithdrawalEmail(amount:string, name:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject: '💸[Cha-Ching!] Your payout has arrived!',
      template: './withdrawal.ejs',
      context: { 
        amount,
        name,
        email,
        year: new Date().getFullYear()
      },
    });
  }

  async sendPaymentEmail(amount:string, vault_name:string, name:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject: '💸[Cha-Ching!] You just got paid!',
      template: './payment.ejs',
      context: { 
        amount,
        name,
        vault_name,
        email,
        year: new Date().getFullYear()
      },
    });
  }

  async sendVaultAccessEmail(url:string, amount:string, vault_name:string, vault_owner:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject: "You've gotten access to a vault!",
      template: './vault.ejs',
      context: { 
        amount,
        url,
        vault_name,
        vault_owner,
        email,
        year: new Date().getFullYear()
      },
    });
  }

  async sendNotificationEmail(subject:string, name:string, message:string, email:string){
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './notification.ejs',
      context: {
        subject, 
        name,
        message,
        email,
        year: new Date().getFullYear()
      },
    });
  }

}