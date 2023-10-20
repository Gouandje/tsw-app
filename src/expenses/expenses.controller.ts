import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Schema as MongooseSchema} from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('newexpense')
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get('allexpense')
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('singleexpense/:id')
  findOne(@Param('id') id: MongooseSchema.Types.ObjectId) {
    return this.expensesService.findOne(id);
  }

  @Patch('updateexpense/:id')
  update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete('deleteexpense/:id')
  remove(@Param('id') id: MongooseSchema.Types.ObjectId) {
    return this.expensesService.remove(id);
  }

  @Post('newcategory')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.expensesService.createCategory(createCategoryDto);
  }

  
  @Get('allcategory')
  findAllCategory() {
    return this.expensesService.findAllCategory();
  }

  @Get('singlecategory/:id')
  findOneCategory(@Param('id') id: string) {
    return this.expensesService.findOneCategory(id);
  }

  @Patch('updatecategory/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
    return this.expensesService.updateCategory(id, updateCategoryDto);
  }

  @Delete('deletecategory/:id')
  removeCategory(@Param('id') id: string) {
    return this.expensesService.removeCategory(id);
  }
}
