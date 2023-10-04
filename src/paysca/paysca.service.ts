import { Injectable } from '@nestjs/common';
import { CreatePayscaDto } from './dto/create-paysca.dto';
import { UpdatePayscaDto } from './dto/update-paysca.dto';
import { Paysca, PayscaDocument } from './schemas/paysca.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payscayear, PayscayearDocument } from './schemas/payscayear.schema';

@Injectable()
export class PayscaService {


  constructor(
    @InjectModel(Paysca.name) private readonly payscaModel: Model<PayscaDocument>,
    @InjectModel(Payscayear.name) private readonly payscayearModel: Model<PayscayearDocument>

    ){}


  async create(createPayscaDto: any) {
    const weekendy = await  this.payscaModel.create(createPayscaDto);
    if(weekendy){

      const infoCapaysyear = {
        countryId: createPayscaDto.countryId,
        year: createPayscaDto.mois.split('-')[0],
        caTotal: createPayscaDto.caTotal
      };

      const getPaysCaYear = await this.findOnePaysCaYearExist(infoCapaysyear.countryId, infoCapaysyear.year);

      if(getPaysCaYear !=null){
        const upadateinfopaysCaYear = {
          countryId: getPaysCaYear.countryId,
          year: createPayscaDto.mois.split('-')[0],
          caTotal: createPayscaDto.caTotal + getPaysCaYear.caTotal
        };
        await this.payscayearModel.findByIdAndUpdate({_id: getPaysCaYear._id.toString('hex')}, upadateinfopaysCaYear,{new: true}).lean();
      }else{

        await this.payscayearModel.create(infoCapaysyear)
      }

    }
  }

  async findAll(year: number) {
    const result =[];
    const capays = await this.payscaModel.find().populate('countryId');
    for(let i=0; i<capays.length; i++){
      if(Number(capays[i].mois.split('-')[0]) == year){

        result.push(capays[i]);

      }
    }

    return result;
  }

  async findAllCaYear() {
    const result = await this.payscayearModel.find().populate('countryId');

    return result;
  }

  async findAllByCountry(countryId: string){
    const capays = await this.payscaModel.find({countryId: countryId}).populate('countryId');
    return capays;
  }

  async findOne(id: string) {
    const camois = await this.payscaModel.findOne({countryId: id});
    return camois;
  }

  async findOnePaysCamoisExist(id: string, mois: string) {
    const camois = await this.payscaModel.findOne({countryId: id, mois: mois});
    return camois;
  }

  async findOnePaysCaYearExist(id: string, year: string) {
    const cayear = await this.payscayearModel.findOne({countryId: id, year: year});
    return cayear;
  }

  async update(id: string, updatePayscaDto: any) {
    const update = await this.payscaModel.findByIdAndUpdate({_id: id}, updatePayscaDto, {new: true}).lean();
    if(update){

      const infoCapaysyear = {
        countryId: updatePayscaDto.countryId,
        year: updatePayscaDto.mois.split('-')[0],
        caTotal: updatePayscaDto.caTotal
      };

      const getPaysCaYear = await this.findOnePaysCaYearExist(infoCapaysyear.countryId, infoCapaysyear.year);

      if(getPaysCaYear !=null){
        const upadateinfopaysCaYear = {
          countryId: getPaysCaYear.countryId,
          year: updatePayscaDto.mois.split('-')[0],
          caTotal: updatePayscaDto.caTotal + getPaysCaYear.caTotal
        };
        await this.payscayearModel.findByIdAndUpdate({_id: getPaysCaYear._id.toString('hex')}, upadateinfopaysCaYear,{new: true}).lean();
      }else{

        await this.payscayearModel.create(infoCapaysyear)
      }

    }
    return update
  }

  remove(id: string) {
    return `This action removes a #${id} paysca`;
  }
}
