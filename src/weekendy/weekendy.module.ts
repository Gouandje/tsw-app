import { Module } from '@nestjs/common';
import { WeekendyService } from './weekendy.service';
import { WeekendyController } from './weekendy.controller';
import { ProduitModule } from 'src/produit/produit.module';
import { AgenceModule } from 'src/angence/agence.module';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Weekendy, WeekendySchema } from './schemas/weekendy.schema';
import { StockagenceModule } from 'src/stockagence/stockagence.module';
import { SalaireModule } from 'src/salaire/salaire.module';
import { AffectationModule } from 'src/affectation/affectation.module';

@Module({
  imports: [
    ProduitModule,
    AgenceModule, 
    StockagenceModule,
    AffectationModule,
    HttpModule,
    SalaireModule,
    MongooseModule.forFeature(
      [
        { 
          name: Weekendy.name, 
          schema: WeekendySchema 
        }
      ]
      )
  ],
  controllers: [WeekendyController],
  providers: [WeekendyService],
  exports: [WeekendyService]

})
export class WeekendyModule {}
