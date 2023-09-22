import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeekendyService } from './weekendy.service';
import { CreateWeekendyDto } from './dto/create-weekendy.dto';
import { UpdateWeekendyDto } from './dto/update-weekendy.dto';
import { Weekendy } from './schemas/weekendy.schema';
import { Schema as MongooseSchema } from 'mongoose';

@Controller('weekendy')
export class WeekendyController {
  constructor(private readonly weekendyService: WeekendyService) {}

  @Post('newWeekendy/:id')
  create(@Param('id') id: string, @Body() createWeekendyDto: CreateWeekendyDto){
    // console.log(createWeekendyDto);
    createWeekendyDto.bureauId = id;
    createWeekendyDto.createdAt = Date();
    
    return this.weekendyService.create(createWeekendyDto);
  }

  @Get('allWeekendy/:bureauId')
  findAll(@Param('bureauId') bureauId: MongooseSchema.Types.ObjectId) {
    
    return this.weekendyService.findAll(bureauId);
  }

  @Get('singleWeekendy/:id')
  findOne(@Param('id') id: string) {
    return this.weekendyService.findOne(id);
  }

  @Patch('updateWeekendy/:id')
  update(@Param('id') id: string, @Body() updateWeekendyDto: UpdateWeekendyDto) {
    return this.weekendyService.update(id, updateWeekendyDto);
  }

  @Delete('deleteWeekendy/:id')
  remove(@Param('id') id: MongooseSchema.Types.ObjectId) {
    return this.weekendyService.remove(id);
  }
}
