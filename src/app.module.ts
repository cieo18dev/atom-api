import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule, // Import the ConfigModule to provide configuration services
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported to access the ConfigService
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => configService.typeOrmConfig, // Provide TypeORM configuration
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
