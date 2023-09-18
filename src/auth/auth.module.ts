import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600,
        },
    }),
    UserModule,
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: User.name, 
          schema: UserSchema 
        }
      ]
      )
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
