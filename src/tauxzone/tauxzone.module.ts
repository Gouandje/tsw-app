import { Module } from '@nestjs/common';
import { TauxzoneService } from './tauxzone.service';
import { TauxzoneController } from './tauxzone.controller';
import { Tauxzone, TauxzoneSchema } from './schemas/tauxzone.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ZoneModule } from 'src/zone/zone.module';

@Module({
  imports:[
    ZoneModule,  
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: Tauxzone.name, 
          schema: TauxzoneSchema 
        }
      ]
      )
  ],
  controllers: [TauxzoneController],
  providers: [TauxzoneService]
})
export class TauxzoneModule {}
