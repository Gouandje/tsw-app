import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Schema as MongooseSchema} from 'mongoose';

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
}
