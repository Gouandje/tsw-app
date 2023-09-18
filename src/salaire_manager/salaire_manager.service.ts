import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaireManagerDto } from './dto/create-salaire_manager.dto';
import { UpdateSalaireManagerDto } from './dto/update-salaire_manager.dto';
import { SalaireManager, SalaireManagerDocument } from './schemas/salaire_manager.schema';
import { SalaireDocument } from 'src/salaire/schemas/salaire.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateDetteDto } from './dto/update-dette.dto';

@Injectable()
export class SalaireManagerService {
  constructor(@InjectModel(SalaireManager.name) private readonly salaireModel: Model<SalaireManagerDocument>){}

  async create(createSalaireManagerDto: CreateSalaireManagerDto) {

    const alreadyExists = await this.salaireModel.exists({ salaireId: createSalaireManagerDto.salaireId }).lean();
    if(alreadyExists){
      throw new ConflictException(`cette existe déjà dans la base de données`);
    }
    const createdSalairemanager = await this.salaireModel.create(createSalaireManagerDto);
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
