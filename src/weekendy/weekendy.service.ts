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
import { AgenceService } from 'src/angence/agence.service';
import { PayscaService } from 'src/paysca/paysca.service';
import { Produitvendupays, ProduitvendupaysDocument } from './schemas/produitsvendupays.schema';
import { ProduitvendubureauDocument } from './schemas/produitvendubureau.schema';
import { TauxService } from 'src/taux/taux.service';

@Injectable()
export class WeekendyService {
  constructor(
    @InjectModel(Weekendy.name) private readonly weekendyModel: Model<WeekendyDocument>,
    @InjectModel(Produitvendupays.name) private readonly produitvendupaysModel: Model<ProduitvendupaysDocument>,
    @InjectModel(Weekendy.name) private readonly produitvendubureauModel: Model<ProduitvendubureauDocument>,
    @InjectModel(WeekendyDocteur.name) private readonly weekendyDocteurModel: Model<WeekendyDocteurDocument>,
    private produitService: ProduitService,
    private agenceservice: AgenceService,
    private tauxservice: TauxService,
    private payscaservice: PayscaService,
    private stockagenceService: StockagenceService,
    private affectationservice: AffectationService,
    private salaireService: SalaireService

  ) {}

  async create(createWeekendyDto: CreateWeekendyDto){
    // console.log(createWeekendyDto);
    const weekendproduct = [];
    const payload = {...createWeekendyDto};
    for(let i=0; i<createWeekendyDto.items.length; i++){

      const product = await this.stockagenceService.findagenceproduit(createWeekendyDto.bureauId, createWeekendyDto.items[i].productId);
      if(product !=null && createWeekendyDto.items[i].quantity <= product['quantity']){
        weekendproduct.push(createWeekendyDto.items[i]);
      }else{
        const produitindispo = await this.produitService.findOne(createWeekendyDto.items[i].productId);
        // console.log('produit rupture', produitindispo.name);
        throw new BadRequestException('Echèc d\'enregistrement du weekendy ' + ` ${produitindispo.name} ` + ' n\'est pas en stock suffisant dans ce bureau. La quantité disponible est ' + `${product['quantity']}` + ' la quantité renseignée est supérieure à celle disponible');
      }

    }
    const createdDataDto = {
      bureauId: createWeekendyDto.bureauId,
      mois: createWeekendyDto.mois,
      annee: createWeekendyDto.annee,
      items: weekendproduct,
      caTotal:createWeekendyDto.caTotal,
      TotaltoBank: createWeekendyDto.TotaltoBank,
      chargebureauTotal: createWeekendyDto.chargebureauTotal,
      primetrsportTotal: createWeekendyDto.primetrsportTotal,
      createdAt: createWeekendyDto.createdAt
    };
    const weekendy = await  this.weekendyModel.create(createdDataDto);
    if(weekendy){
      const bureau = await this.agenceservice.findbureau(createWeekendyDto.bureauId);
      for(let i=0; i < createWeekendyDto.items.length; i++){
        const product = await this.stockagenceService.findagenceproduit(createWeekendyDto.bureauId, createWeekendyDto.items[i].productId);
         const productPrice = await this.produitService.findOne(createWeekendyDto.items[i].productId);
        const produitvendupays = await this.produitvendupaysModel.findOne({paysId: bureau['countryId'], productId: createWeekendyDto.items[i].productId,  annee: createWeekendyDto.annee}).exec();
        if(produitvendupays == null){
          const createdproduitvenduDto = {
            paysId: bureau['countryId'],
            productId: createWeekendyDto.items[i].productId,
            quantity: createWeekendyDto.items[i].quantity,
            annee: createWeekendyDto.annee,
            chiffreaffaire: createWeekendyDto.items[i].quantity*productPrice['price']
          };

          await this.produitvendupaysModel.create(createdproduitvenduDto);

        }else{
          const updatedproduitvenduDto = {
            paysId: bureau['countryId'],
            productId: createWeekendyDto.items[i].productId,
            quantity: produitvendupays['quantity'] + createWeekendyDto.items[i].quantity,
            annee: createWeekendyDto.annee,
            chiffreaffaire: produitvendupays['chiffreaffaire'] + createWeekendyDto.items[i].quantity*productPrice['price'] 
          };
          await this.produitvendupaysModel.findByIdAndUpdate({_id: produitvendupays['_id']}, updatedproduitvenduDto, {new: true}).lean();
        }

        if(product !=null){
          const updatedStockagence = {
           quantity: product.quantitytotalenmagasin - (createWeekendyDto.items[i].quantity)
          };
        const updatestockagence: UpdateStockagenceDto = await this.stockagenceService.updateagenceStock(createWeekendyDto.bureauId, createWeekendyDto.items[i].productId, updatedStockagence);
      }
      }
      const managersbureau = await this.affectationservice.findManager_bureau(createWeekendyDto.bureauId);
      const taux = await this.tauxservice.findAll();
      const createSalaireDto = {
        bureauId:createWeekendyDto.bureauId,
        salaire_agent: createWeekendyDto.caTotal*taux[0].taux_salaire_agent,
        salaire_formateur: createWeekendyDto.caTotal*taux[0].taux_formateur,
        salaire_total_manager: (createWeekendyDto.caTotal*taux[0].taux_salaire_mgr)*(managersbureau.length),
        motant_total: createWeekendyDto.caTotal*taux[0].taux_salaire_agent + createWeekendyDto.caTotal*taux[0].taux_formateur + (createWeekendyDto.caTotal*taux[0].taux_salaire_mgr)*(managersbureau.length),
        mois: createWeekendyDto.mois,
        chiffreDaf: createWeekendyDto.caTotal,
        montant_bank:createWeekendyDto.TotaltoBank,
        chargeBureau:createWeekendyDto.chargebureauTotal,
        date_paiment: createWeekendyDto.createdAt,
      };

      this.salaireService.create(createSalaireDto);

      const paysinfobyagence = await this.agenceservice.findbureau(createWeekendyDto.bureauId);

      const infoCapays = {
        countryId: paysinfobyagence.countryId,
        mois: createWeekendyDto.mois,
        caTotal: createWeekendyDto.caTotal
      };

      const getPaysCaMois = await this.payscaservice.findOnePaysCamoisExist(infoCapays.countryId, infoCapays.mois);

      if(getPaysCaMois !=null){
        const upadateinfopaysCaMois = {
          countryId: paysinfobyagence.countryId,
          mois: createWeekendyDto.mois,
          caTotal: createWeekendyDto.caTotal + getPaysCaMois.caTotal
        };
        await this.payscaservice.update(getPaysCaMois._id.toString('hex'), upadateinfopaysCaMois);
      }else{

        await this.payscaservice.create(infoCapays)
      }
    }
    // console.log(weekendy);
    return weekendy;
  }

  async createVenteDocteur(createDocteurWeekendyDto: CreateDocteurWeekendyDto){
    // console.log(createWeekendyDto);
    const weekendproduct = [];
    for(let i=0; i<createDocteurWeekendyDto.items.length; i++){

      const product = await this.stockagenceService.findagenceproduit(createDocteurWeekendyDto.bureauId, createDocteurWeekendyDto.items[i].productId);
      if(product !=null && createDocteurWeekendyDto.items[i].quantity <= product['quantity']){
        weekendproduct.push(createDocteurWeekendyDto.items[i]);
      }else{
        const produitindispo = await this.produitService.findOne(createDocteurWeekendyDto.items[i].productId);
        // console.log('produit rupture', produitindispo.name);
        throw new BadRequestException('Echèc d\'enregistrement du weekendy: ' + ` ${produitindispo.name} ` + ' n\'est pas en stock suffisant dans ce bureau. La quantité disponible après weekendy du mois passé est: ' + `${product['quantity']}` + ' la quantité renseignée est supérieure à celle disponible');
      }

    }
    const createdDataDto = {
      bureauId: createDocteurWeekendyDto.bureauId,
      mois: createDocteurWeekendyDto.mois,
      annee: createDocteurWeekendyDto.annee,
      items: weekendproduct,
      caTotal:createDocteurWeekendyDto.caTotal,
      createdAt: createDocteurWeekendyDto.createdAt
    };
    const weekendy = await  this.weekendyDocteurModel.create(createdDataDto);
    if(weekendy){
      const bureau = await this.agenceservice.findbureau(createDocteurWeekendyDto.bureauId);
      for(let i=0; i < createDocteurWeekendyDto.items.length; i++){
        const product = await this.stockagenceService.findagenceproduit(createDocteurWeekendyDto.bureauId, createDocteurWeekendyDto.items[i].productId);
         const productPrice = await this.produitService.findOne(createDocteurWeekendyDto.items[i].productId);
        const produitvendupays = await this.produitvendupaysModel.findOne({paysId: bureau['countryId'], productId: createDocteurWeekendyDto.items[i].productId,  annee: createDocteurWeekendyDto.annee}).exec();
        if(produitvendupays == null){
          const createdproduitvenduDto = {
            paysId: bureau['countryId'],
            productId: createDocteurWeekendyDto.items[i].productId,
            quantity: createDocteurWeekendyDto.items[i].quantity,
            annee: createDocteurWeekendyDto.annee,
            chiffreaffaire: createDocteurWeekendyDto.items[i].quantity*productPrice['price']
          };

          await this.produitvendupaysModel.create(createdproduitvenduDto);

        }else{
          const updatedproduitvenduDto = {
            paysId: bureau['countryId'],
            productId: createDocteurWeekendyDto.items[i].productId,
            quantity: produitvendupays['quantity'] + createDocteurWeekendyDto.items[i].quantity,
            annee: createDocteurWeekendyDto.annee,
            chiffreaffaire: produitvendupays['chiffreaffaire'] + createDocteurWeekendyDto.items[i].quantity*productPrice['price'] 
          };
          await this.produitvendupaysModel.findByIdAndUpdate({_id: produitvendupays['_id']}, updatedproduitvenduDto, {new: true}).lean();
        }

        if(product !=null){
          const updatedStockagence = {
           quantity: product.quantitytotalenmagasin - (createDocteurWeekendyDto.items[i].quantity)
          };
        const updatestockagence: UpdateStockagenceDto = await this.stockagenceService.updateagenceStock(createDocteurWeekendyDto.bureauId, createDocteurWeekendyDto.items[i].productId, updatedStockagence);
      }
      }
      
      const paysinfobyagence = await this.agenceservice.findbureau(createDocteurWeekendyDto.bureauId);

      const infoCapays = {
        countryId: paysinfobyagence.countryId,
        mois: createDocteurWeekendyDto.mois,
        caTotal: createDocteurWeekendyDto.caTotal
      };

      const getPaysCaMois = await this.payscaservice.findOnePaysCamoisExist(infoCapays.countryId, infoCapays.mois);

      if(getPaysCaMois !=null){
        const upadateinfopaysCaMois = {
          countryId: paysinfobyagence.countryId,
          mois: createDocteurWeekendyDto.mois,
          caTotal: createDocteurWeekendyDto.caTotal + getPaysCaMois.caTotal
        };
        await this.payscaservice.update(getPaysCaMois._id.toString('hex'), upadateinfopaysCaMois);
      }else{

        await this.payscaservice.create(infoCapays)
      }
    }
    // console.log(weekendy);
    return weekendy;
  }


  async findAll(bureauId: MongooseSchema.Types.ObjectId) {
    const weekendy = await this.weekendyModel
                                .find({bureauId: bureauId})
                                .populate('bureauId')
                                .populate('mois')
                                .populate('annee')
                                .exec();
    return weekendy;
  }

  async findAllVenteDocteur(bureauId: MongooseSchema.Types.ObjectId) {
    const weekendy = await this.weekendyDocteurModel
                                .find({bureauId: bureauId})
                                .populate('bureauId')
                                .populate('mois')
                                .populate('annee').exec();
    return weekendy;
  }

  async allGetAllProduitVendyPays(){
    const result=[];
    const ventes = await this.produitvendupaysModel.find().populate('paysId').populate('productId').populate('annee').exec();
    
    return ventes;                                               
  }


  async findOne(weekendyId: string) {
    let products = []
    const weekedy = await this.weekendyModel
                              .findById(weekendyId)
                              .populate('bureauId')
                              .populate('mois')
                              .populate('annee')
                              .exec();                      
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
