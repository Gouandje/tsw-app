import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTauxzoneDto } from './dto/create-tauxzone.dto';
import { UpdateTauxzoneDto } from './dto/update-tauxzone.dto';
import { Tauxzone, TauxzoneDocument } from './schemas/tauxzone.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TauxzoneService {
  constructor(@InjectModel(Tauxzone.name) private readonly tauxzoneModel: Model<TauxzoneDocument>){}

  async create(createTauxzoneDto: CreateTauxzoneDto) {
    const alreadyExists = await this.tauxzoneModel.exists({ zoneId: createTauxzoneDto.zoneId }).lean();
    if(alreadyExists){
      throw new ConflictException(`cette existe déjà dans la base de données`);
    }
    const createdTauxzone = await this.tauxzoneModel.create(createTauxzoneDto);
    return createdTauxzone;
  }

  async findAll() {
    const tauxzone = await this.tauxzoneModel
    .find()
    .populate('zoneId')
    .exec();
return tauxzone;
  }

  async findByzone(id: string) {
    const taux = await this.tauxzoneModel.find({zoneId:id})
                  .populate('zoneId').exec();
    if (!taux) {
      throw new NotFoundException('non trouvé');
    }
    return taux;
  }

  async findOne(id: string) {
    const taux = await this.tauxzoneModel.findById(id);

    if (!taux) {
      throw new NotFoundException('taux non trouvée');
    }
    return taux;
  }

  async update(id: string, updateTauxzoneDto: UpdateTauxzoneDto) {
    // const tauzone = await this.findOne(id);

    const taux = this.tauxzoneModel.findOneAndUpdate({_id: id }, updateTauxzoneDto, {
      new: true,
    }).exec();


    return taux;
  }

  async remove(id: string) {
    await this.tauxzoneModel.deleteOne({ _id: id });
    return {};
  }
}
