import { Module } from '@nestjs/common';
import { SalaireManagerService } from './salaire_manager.service';
import { SalaireManagerController } from './salaire_manager.controller';
import { SalaireManager, SalaireManagerSchema } from './schemas/salaire_manager.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ManagerModule } from 'src/manager/manager.module';
import { SalaireModule } from 'src/salaire/salaire.module';

@Module({
  imports: [   
    SalaireModule,
    ManagerModule, 
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: SalaireManager.name, 
          schema: SalaireManagerSchema 
        }
      ]
      )
  ],
  controllers: [SalaireManagerController],
  providers: [SalaireManagerService]
})
export class SalaireManagerModule {}
