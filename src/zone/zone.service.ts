import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone, ZoneDocument } from './schemas/zone.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ZoneService {


  constructor(
    @InjectModel(Zone.name) private readonly zoneModel: Model<ZoneDocument>,
  ) {}

  async create(createZoneDto: CreateZoneDto) {
    const alreadyExists = await this.zoneModel.exists({ name: createZoneDto.zone_name }).lean();
    if(alreadyExists){
      throw new ConflictException(`cette zone existe déjà dans la base de données`);
    }
    const createdzone = await this.zoneModel.create(createZoneDto);

    if (!createdzone) {
      throw new InternalServerErrorException(
        'Impossible de créer la zone, veuillez réessayer',
      );
    }
    return createdzone;
  }

  async findAll() {
    const zone = await this.zoneModel.find()
                                     .populate('countryId')
                                     .exec();

    return zone;
  }

  async findOne(id: string) {
    const zone = await this.zoneModel.findOne({countryId:id}).populate('countryId').exec();

    if (!zone) {
      throw new NotFoundException('zone non trouvée');
    }
    return zone;
  }

  async findpays(id: string) {
    const zone = await this.zoneModel.find({countryId: id}).populate('countryId').exec();

    if (!zone) {
      throw new NotFoundException('Pays non trouvé');
    }
    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto) {
    return this.zoneModel
      .findOneAndUpdate({ id }, updateZoneDto, {
        new: true,
      })
      .lean();
  }

  async remove(id: string) {
    await this.zoneModel.findByIdAndRemove(id).catch((err) => {
      throw new BadRequestException(err);
    });

    return `Zone deleted`;

  }

  async findzonepaysDelete(id: string){
    const zone = await this.zoneModel.find({countryId: id}).exec();
    if(zone !=null){
     for(let i=0; i<zone.length; i++){
       await this.zoneModel.findByIdAndRemove(zone[i]._id);
     }
    }
    return;
   }
}
