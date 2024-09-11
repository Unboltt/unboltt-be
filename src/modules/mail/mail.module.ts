import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { join } from "path";
import { MailService } from "./mail.service";
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports:[
        JwtModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    secure: true,
                    port: 465,
                    auth: {
                      user: config.get('MAIL_USER'),
                      pass: config.get('MAIL_PASSWORD'),
                    },
                },
                //preview:true,
                defaults: {
                    from: config.get('MAIL_FROM'),
                },
                template: {
                    dir: join(process.cwd(), 'src/modules', 'mail/templates'),
                    adapter: new EjsAdapter({inlineCssEnabled: true }),
                    options: {
                    strict: false,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers:[MailService],
    exports:[MailService]
})
export class MailModule{}