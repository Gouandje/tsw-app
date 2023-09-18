import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAffectationDto } from './dto/create-affectation.dto';
import { UpdateAffectationDto } from './dto/update-affectation.dto';
import { Affectation, AffectationDocument } from './schemas/affectation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ManagerService } from 'src/manager/manager.service';
import { AgenceService } from 'src/angence/agence.service';
import { UpdateStatusDto } from 'src/manager/dto/update-status.dto';

@Injectable()
export class AffectationService {

  constructor(
    @InjectModel(Affectation.name) private readonly affectationModel: Model<AffectationDocument>,
    private managerService: ManagerService,
    private agenceService: AgenceService
  ) {}

  async create(createAffectationDto: CreateAffectationDto) {
    const alreadyExists = await this.affectationModel.exists({ managerId: createAffectationDto.managerId }).lean();
    if(alreadyExists){
      throw new ConflictException(`Il y a déjà des managers cet bureau existe déjà dans la base de données`);
    }
    for(let i = 0; i<createAffectationDto.managerId.length; i++){
      const affectationvalue = {
        bureauId: createAffectationDto.bureauId,
        managerId: createAffectationDto.managerId[i]._id
      } 
      const createdAffection = await this.affectationModel.create(affectationvalue);
      if(createdAffection){
        const updateStatusDto: UpdateStatusDto = {
          status_mgr: "affecté"
        }
        this.managerService.updateStatut(createAffectationDto.managerId[i]._id, updateStatusDto);
      }
      
    }

    return 'Enregistrement effectué avec succès';
  }

  async findAll() {
    const affectation = await this.affectationModel.find()
                              .populate('bureauId')
                              .populate('managerId')
                              .exec();
    return affectation;
  }

  async findOne(id: string) {
    const affectation = await this.affectationModel.findById(id);

    if (!affectation) {
      throw new NotFoundException('non trouvé');
    }
    return affectation;
  }

  async findManager(bureauId: string) {
    const manager = await this.affectationModel.find({bureauId: bureauId}).populate('managerId');

    if (!manager) {
      throw new NotFoundException('non trouvé');
    }
    return manager;
  }

  async findManager_bureau(bureauId: string) {
    const managers = []
    const manager = await this.affectationModel.find({bureauId: bureauId}).populate('managerId');

    for(let i=0; i<manager.length; i++){
      if(manager[i].managerId['grade'] == "Manager"){
        managers.push(manager[i]);
      }
    }
    if (!manager) {
      throw new NotFoundException('non trouvé');
    }
    return managers;
  }

  update(id: string, updateAffectationDto: UpdateAffectationDto) {
    return `This action updates a #${id} affectation`;
  }

  async remove(id: string) {
    await this.affectationModel.deleteOne({ _id: id });
    return {};
  }
}
