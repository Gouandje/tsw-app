import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaireManagerDto } from './dto/create-salaire_manager.dto';
import { UpdateSalaireManagerDto } from './dto/update-salaire_manager.dto';
import { SalaireManager, SalaireManagerDocument } from './schemas/salaire_manager.schema';
import { SalaireDocument } from 'src/salaire/schemas/salaire.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateDetteDto } from './dto/update-dette.dto';
import { Cotisation, CotisationDocument } from './schemas/cotisation.schema';
import { AgenceService } from 'src/angence/agence.service';

@Injectable()
export class SalaireManagerService {
  constructor(@InjectModel(SalaireManager.name) private readonly salaireModel: Model<SalaireManagerDocument>,
  @InjectModel(Cotisation.name) private readonly cotisationModel: Model<CotisationDocument>,
  private readonly agenceservice: AgenceService,

  ){}

  async create(createSalaireManagerDto: CreateSalaireManagerDto) {

    const alreadyExists = await this.salaireModel.exists({ salaireId: createSalaireManagerDto.salaireId }).lean();
    if(alreadyExists){
      throw new ConflictException(`cette existe déjà dans la base de données`);
    }
    const createdSalairemanager = await this.salaireModel.create(createSalaireManagerDto);
    if(createSalaireManagerDto){
      const getcotisation = await this.cotisationModel.findOne({managerId: createSalaireManagerDto.managerId}).exec();
      if(getcotisation == null){
        const createcotisation = {
          managerId: createSalaireManagerDto.managerId,
          cotisation_totale: createSalaireManagerDto.garantie_manager,
          statut: "impayé"
        };
        await this.cotisationModel.create(createcotisation);
      }else{
        const updatecotisation = {
          managerId: createSalaireManagerDto.managerId,
          cotisation_totale: getcotisation.cotisation_totale +  createSalaireManagerDto.garantie_manager,
          statut: "impayé"
        };
        await this.cotisationModel.findByIdAndUpdate({_id: getcotisation._id},updatecotisation, { new: true,} ).lean();
      }
      
    }
    return createdSalairemanager;
  }

  async findAll(managerId: string) {
    const salairesManager = await this.salaireModel
                    .find({managerId: managerId})
                    .populate('managerId')
                    .populate('salaireId')
                    .exec();
    return salairesManager;
  }

  async findAllCotisationTotaleManager(managerId: string){

    const cotisationtotale = await this.cotisationModel
                    .findOne({managerId: managerId})
                    .exec();
    return cotisationtotale;

  }

  async findAllCotisationManager(managerId: string) {
    const cotisation: any[] = [];
    const salairesManager = await this.salaireModel
                    .find({managerId: managerId})
                    .populate('managerId')
                    .populate('salaireId')
                    .exec();
    // console.log(salairesManager);                
    for(let i=0; i<salairesManager.length; i++){
      // console.log(salairesManager[i].salaireId["bureauId"].toString('hex'));
      const bureau = await this.agenceservice.findbureau(salairesManager[i].salaireId["bureauId"].toString('hex'));
      // console.log('bureau', bureau);
      const obj={
        bureau: bureau.bureau_name,
        managerId:salairesManager[i].managerId,
        chiffreaffaire: salairesManager[i].salaireId["chiffreDaf"],
        salaire: salairesManager[i].salaire_manager,
        cotisation: salairesManager[i].garantie_manager,
        mois: salairesManager[i].mois,
        
      };
      cotisation.push(obj);

    }                
    return cotisation;
  }

  async findAllmois(mois: string) {
    const salairesManager = await this.salaireModel
                    .find({mois: mois})
                    .populate('managerId')
                    .exec();
    return salairesManager;
  }

  async findOne(id: string) {
    const salairemanager = await this.salaireModel.find({managerId:id})
                  .populate('managerId').exec();
    if (!salairemanager) {
      throw new NotFoundException('non trouvé');
    }
    return salairemanager;
  }

  async update(id: string, updateDetteDto: UpdateDetteDto) {
   
    const salaire = await this.salaireModel.find({ salaireId: id, managerId: updateDetteDto.managerId });
    const salaire_manager = salaire[0].salaire_manager - updateDetteDto.dette_manager
    return this.salaireModel
      .updateOne({ salaireId: id, managerId: updateDetteDto.managerId },{salaire_manager: salaire_manager}, updateDetteDto)
      .lean();
  }
  

  async remove(id: number) {
    await this.salaireModel.deleteOne({ _id: id });
    return {};
  }
}
