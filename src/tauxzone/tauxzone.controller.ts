import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TauxzoneService } from './tauxzone.service';
import { CreateTauxzoneDto } from './dto/create-tauxzone.dto';
import { UpdateTauxzoneDto } from './dto/update-tauxzone.dto';

@Controller('tauxzone')
export class TauxzoneController {
  constructor(private readonly tauxzoneService: TauxzoneService) {}

  @Post('createTauxZone')
  create(@Body() createTauxzoneDto: CreateTauxzoneDto) {
    return this.tauxzoneService.create(createTauxzoneDto);
  }

  @Get('allTauxzone')
  findAll() {
    return this.tauxzoneService.findAll();
  }

  @Get('singleTauxZone/:id')
  findOne(@Param('id') id: string) {
    return this.tauxzoneService.findOne(id);
  }

  @Get('singleTauxByZone/:id')
  findByZone(@Param('id') id: string) {
    return this.tauxzoneService.findByzone(id);
  }

  @Patch('updateTauxZone/:id')
  update(@Param('id') id: string, @Body() updateTauxzoneDto: UpdateTauxzoneDto) {
    return this.tauxzoneService.update(id, updateTauxzoneDto);
  }

  @Delete('deleteTauxZone/:id')
  remove(@Param('id') id: string) {
    return this.tauxzoneService.remove(id);
  }
}
