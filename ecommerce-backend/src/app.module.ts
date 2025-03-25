import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

type EnvironmentVariables = {
  MONGODB_URI: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_ENDPOINT: string;
  AWS_S3_BUCKET: string;
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommandModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    DashboardModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
