import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { Model, Schema as MongooseSchema  } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,){}

  async create(createExpenseDto: CreateExpenseDto) {
    const createdExpense = await this.expenseModel.create(createExpenseDto);
    if(!createdExpense){
      throw new InternalServerErrorException(
        'Impossible de créer le manager, veuillez réessayer',
      );
    }
    return createdExpense;
  }

  async findAll(): Promise<Expense[]>  {
    const expenses = await this.expenseModel.find().exec();
    return expenses;
  }

  async findOne(expenseId: MongooseSchema.Types.ObjectId): Promise<Expense> {
    const expense = await this.expenseModel.findById(expenseId);

    if (!expense) {
      throw new NotFoundException('Produit non trouvé');
    }
    return expense;
  }

  async update(expenseId: MongooseSchema.Types.ObjectId, updateExpenseDto: UpdateExpenseDto) {
    const product = await this.findOne(expenseId);

    const updatedProduct = this.expenseModel.findOneAndUpdate({_id: expenseId }, updateExpenseDto, {
      new: true,
    }).exec();


    return updatedProduct;
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    await this.expenseModel.findByIdAndRemove(id).catch((err) => {
      throw new BadRequestException(`une erreur c'est produite lors de la suppression`);
    });

    return `Produit supprimé avec succès`;
  }
}
