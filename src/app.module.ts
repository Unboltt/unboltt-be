import { PubSubModule } from './modules/pubsub/pubsub.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlRolesGuard } from './modules/auth/guards/gql.roles.guard';
import { MailModule } from './modules/mail/mail.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FileUploadModule } from './modules/upload/upload.module';
import { PaymentModule } from './modules/payment/payment.module';
import { VaultModule } from './modules/vault/vault.module';

@Module({
  imports: [
    PubSubModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: { origin: true, credentials: true },
      context: ({ req, res }) => ({ req, res }),
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`),
    UserModule,
    AuthModule,
    MailModule,
    NotificationModule,
    FileUploadModule,
    PaymentModule,
    VaultModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: GqlRolesGuard },
  ],
})
export class AppModule {}
