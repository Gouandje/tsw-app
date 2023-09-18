import { Module } from '@nestjs/common';
import { PaysService } from './pays.service';
import { PaysController } from './pays.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Pays, PaysSchema } from './schemas/pays.schema';

@Module({
  imports: [    
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: Pays.name, 
          schema: PaysSchema 
        }
      ]
      )
  ],
  controllers: [PaysController],
  providers: [PaysService],
  exports:[PaysService]
})
export class PaysModule {}
