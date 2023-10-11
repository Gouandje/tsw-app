import { Module } from '@nestjs/common';
import { SalaireManagerService } from './salaire_manager.service';
import { SalaireManagerController } from './salaire_manager.controller';
import { SalaireManager, SalaireManagerSchema } from './schemas/salaire_manager.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ManagerModule } from 'src/manager/manager.module';
import { SalaireModule } from 'src/salaire/salaire.module';
import { Cotisation, CotisationSchema } from './schemas/cotisation.schema';
import { AgenceModule } from 'src/angence/agence.module';

@Module({
  imports: [   
    SalaireModule,
    AgenceModule,
    ManagerModule, 
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: SalaireManager.name, 
          schema: SalaireManagerSchema 
        },
        { 
          name: Cotisation.name, 
          schema: CotisationSchema 
        }
      ]
      )
  ],
  controllers: [SalaireManagerController],
  providers: [SalaireManagerService]
})
export class SalaireManagerModule {}
