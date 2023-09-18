import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { Zone, ZoneSchema } from './schemas/zone.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PaysModule } from 'src/pays/pays.module';

@Module({
  imports: [
    PaysModule,   
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: Zone.name, 
          schema: ZoneSchema 
        }
      ]
      )
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService]

})
export class ZoneModule {}
