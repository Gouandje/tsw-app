import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weekendy, WeekendyDocument } from './schemas/weekendy.schema';
import { Model,  Schema as MongooseSchema } from 'mongoose';
import { CreateWeekendyDto } from './dto/create-weekendy.dto';
import { UpdateWeekendyDto } from './dto/update-weekendy.dto';
import { ProduitService } from 'src/produit/produit.service';
import {StockagenceService} from 'src/stockagence/stockagence.service';
import { SalaireService } from 'src/salaire/salaire.service';
import { CreateSalaireDto } from 'src/salaire/dto/create-salaire.dto';
import { UpdateStockagenceDto } from 'src/stockagence/dto/update-stockagence.dto';
import { AffectationService } from 'src/affectation/affectation.service';
import { WeekendyDocteur, WeekendyDocteurDocument } from './schemas/weekendydocteur.schema';
import { CreateDocteurWeekendyDto } from './dto/create-docteur-weekendy.dto';

@Injectable()
export class WeekendyService {
  constructor(
    @InjectModel(Weekendy.name) private readonly weekendyModel: Model<WeekendyDocument>,
    @InjectModel(WeekendyDocteur.name) private readonly weekendyDocteurModel: Model<WeekendyDocteurDocument>,
    private readonly produitService: ProduitService,
    private stockagenceService: StockagenceService,
    private affectationservice: AffectationService,
    private salaireService: SalaireService

  ) {}

  async create(createWeekendyDto: CreateWeekendyDto){
    // console.log(createWeekendyDto);
    const payload = {...createWeekendyDto};
    const weekendy = await  this.weekendyModel.create(createWeekendyDto);
    if(weekendy){
      for(let i=0; i < createWeekendyDto.items.length; i++){
        const product = await this.stockagenceService.findagenceproduit(createWeekendyDto.bureauId, createWeekendyDto.items[i].productId);

        if(product !=null){
          const updatedStockagence = {
           quantity: product.quantitytotalenmagasin - (createWeekendyDto.items[i].quantity)
          };
        const updatestockagence: UpdateStockagenceDto = await this.stockagenceService.updateagenceStock(createWeekendyDto.bureauId, createWeekendyDto.items[i].productId, updatedStockagence);
      }
      }
      const managersbureau = await this.affectationservice.findManager_bureau(createWeekendyDto.bureauId); 
      const createSalaireDto = {
        bureauId:createWeekendyDto.bureauId,
        salaire_agent: createWeekendyDto.caTotal*23/100,
        salaire_formateur: createWeekendyDto.caTotal*2/100,
        salaire_total_manager: (createWeekendyDto.caTotal*5/100)*(managersbureau.length),
        motant_total: createWeekendyDto.caTotal*23/100 + createWeekendyDto.caTotal*2/100 + (createWeekendyDto.caTotal*5/100)*(managersbureau.length),
        mois: createWeekendyDto.mois,
        chiffreDaf: createWeekendyDto.caTotal,
        montant_bank:createWeekendyDto.TotaltoBank,
        chargeBureau:createWeekendyDto.chargebureauTotal,
        date_paiment: createWeekendyDto.createdAt,
      };

      this.salaireService.create(createSalaireDto);
    }
    // console.log(weekendy);
    return weekendy;
  }


  async createVenteDocteur(createDocteurWeekendyDto: CreateDocteurWeekendyDto){
    const listProdutItemeWeekendy = [];
    const listProdutprice = [];
    // console.log(createWeekendyDto);
    const payload = {...createDocteurWeekendyDto};
   
    for(let i=0; i < createDocteurWeekendyDto.items.length; i++){        
      const product = await this.stockagenceService.findagenceproduit(createDocteurWeekendyDto.bureauId, createDocteurWeekendyDto.items[i].productId);
      
      if(product !=null && product.quantity>=createDocteurWeekendyDto.items[i].quantity){
        // console.log('product', typeof product.productId.price);
        const updatedStockagence = {
           quantity: product.quantitytotalenmagasin - (createDocteurWeekendyDto.items[i].quantity)
        };
        const productItem = {
          productId: createDocteurWeekendyDto.items[i].productId,
          quantity: createDocteurWeekendyDto.items[i].quantity
        };
        const productItemPrice = {
          productId: createDocteurWeekendyDto.items[i].productId,
          quantity: createDocteurWeekendyDto.items[i].quantity,
          // price: product.productId[0].price
        };
        
        listProdutItemeWeekendy.push(productItem);

        const updatestockagence: UpdateStockagenceDto = await this.stockagenceService.updateagenceStock(createDocteurWeekendyDto.bureauId, createDocteurWeekendyDto.items[i].productId, updatedStockagence);
      }
    }
    const doctorWeekendy = {
      bureauId: createDocteurWeekendyDto.bureauId,
      mois:createDocteurWeekendyDto.mois,
      periode_debut:createDocteurWeekendyDto.periode_debut,
      periode_fin:createDocteurWeekendyDto.periode_fin,
      items:listProdutItemeWeekendy,
      caTotal:createDocteurWeekendyDto.caTotal,
      createdAt: createDocteurWeekendyDto.createdAt,
    };
    // console.log('doctorWeekendy',doctorWeekendy);
    const weekendy = await  this.weekendyDocteurModel.create(doctorWeekendy);
    console.log(weekendy);
    return weekendy;
  }

  async findAll(bureauId: MongooseSchema.Types.ObjectId) {
    const weekendy = await this.weekendyModel
                                .find({bureauId: bureauId})
                                .populate('bureauId');
    return weekendy;
  }

  async findAllVenteDocteur(bureauId: MongooseSchema.Types.ObjectId) {
    const weekendy = await this.weekendyDocteurModel
                                .find({bureauId: bureauId})
                                .populate('bureauId');
    return weekendy;
  }


  async findOne(weekendyId: string) {
    let products = []
    const weekedy = await this.weekendyModel
                              .findById(weekendyId)
                              .populate('bureauId');
    console.log(weekedy.items); 
    // for(let i = 0; i<weekedy.items.length; i++){
    //   const product = await this.produitService.findOne(weekedy.items['productId'][i]);
    //   console.log(product);
    //   // products.push(product, weekedy.items['quantity'][i]);
    // } 
    // console.log(products) ;                       
    if (!weekedy) {
      throw new NotFoundException('weekendy non trouvé');
    }
    return weekedy ;
  }

  async update(weekendyId: string, updateWeekendyDto: UpdateWeekendyDto) {
    const weekedy = await this.findOne(weekendyId);

    const updatedWeekedy = this.weekendyModel.findOneAndUpdate({ ...updateWeekendyDto }, { new: true });

    return updatedWeekedy;
  }

  async remove(weekedyId: MongooseSchema.Types.ObjectId) {
    await this.weekendyModel.findByIdAndRemove(weekedyId).catch((err) => {
      throw new BadRequestException(`une erreur c'est produite lors de la suppression`);
    });

    return `Weekendy supprimé avec succès`;
  }
}
