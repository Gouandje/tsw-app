import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntrepotDto } from './dto/create-entrepot.dto';
import { UpdateEntrepotDto } from './dto/update-entrepot.dto';
import { Entrepot, EntrepotDocument } from './schemas/entrepot.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntrepotOperation, EntrepotOperationDocument } from './schemas/entrepotoperation.schema';
import { EntrepotProduitStock, EntrepotProduitStockDocument } from './schemas/entrepotproduitstock.schema';
import { StockService } from 'src/stock/stock.service';
import { StockPaysService } from 'src/stock-pays/stock-pays.service';
import { PaysService } from 'src/pays/pays.service';
import { CreateStockDto } from 'src/stock/dto/create-stock.dto';
import { CreateSortieStockEntrepot } from './dto/create-sortie-stock-entrepot.dto';
import { SortieProduitEntrepot, SortieProduitEntrepotDocument } from './schemas/sortieproduitentrepot.schema';

@Injectable()
export class EntrepotService {

  constructor(
    @InjectModel(Entrepot.name) private readonly entrepotModel: Model<EntrepotDocument>,
    @InjectModel(EntrepotOperation.name) private readonly entrepotoperationModel: Model<EntrepotOperationDocument>,
    @InjectModel(SortieProduitEntrepot.name) private readonly sortieproduitentrepotModel: Model<SortieProduitEntrepotDocument>,
    @InjectModel(EntrepotOperation.name) private readonly entrepotproduitstockModel: Model<EntrepotProduitStockDocument>,
    private readonly stockpaysService: StockPaysService,
    private readonly stockService: StockService,
    private readonly paysService: PaysService){

  }

  async create(createEntrepotDto: CreateEntrepotDto) {
    const createdentrepot = await this.entrepotModel.create(createEntrepotDto);
    if(createdentrepot){

      const operationentrepot = {
        productId:createEntrepotDto.productId,
        quantity:createEntrepotDto.quantity,
        operationDate:createEntrepotDto.enterDate,
        typeoperation:"entrestock",
      };
      const operationtreeentrepot = await this.entrepotoperationModel.create(operationentrepot);
      console.log('operationtreeentrepot',operationtreeentrepot);
      const stockproductcurrententrepot = await this.entrepotproduitstockModel.findOne({productId: createEntrepotDto.productId}).exec();

      if(stockproductcurrententrepot == null){
        const stockentrepot = {
          productId: createEntrepotDto.productId,
          quantity: createEntrepotDto.quantity
        }
        this.entrepotproduitstockModel.create(stockentrepot);
      }else{
        const currentquantity = stockproductcurrententrepot.quantity
        const finalquantity = createEntrepotDto.quantity + currentquantity
        console.log('finalquantity',finalquantity)
        const stockentrepot = {
          productId: createEntrepotDto.productId,
          quantity: finalquantity
        }
        const id = stockproductcurrententrepot._id
        const essai= this.entrepotproduitstockModel.findByIdAndUpdate({_id: id}, stockentrepot, {new: true}).exec();
      }
      

    }
  }

  async createSortieEntrepot(createSortieStockEntrepotDto:CreateSortieStockEntrepot){
    const stockproductcurrententrepot = await this.entrepotproduitstockModel.findOne(
      {productId: createSortieStockEntrepotDto.productId,
      quantity: createSortieStockEntrepotDto.quantity,
      fabDate: createSortieStockEntrepotDto.fabDate,
      expirDate: createSortieStockEntrepotDto.expirDate
      }).exec();
      if(stockproductcurrententrepot==null){
        throw new NotFoundException(`The product was not found.`);
      }else{
        const sortiestockentrepot = await this.sortieproduitentrepotModel.create(createSortieStockEntrepotDto);
        const consignedentrepot = this.stockService.create(createSortieStockEntrepotDto);
        if(consignedentrepot){
          const operationentrepot = {
            countryId: createSortieStockEntrepotDto.paysId,
            productId:createSortieStockEntrepotDto.productId,
            quantity:createSortieStockEntrepotDto.quantity,
            operationDate:createSortieStockEntrepotDto.enterDate,
            typeoperation:"sortietock",
          };
          const operationtreeentrepot = await this.entrepotoperationModel.create(operationentrepot);
          console.log('operationtreeentrepot',operationtreeentrepot);
      
          const currentquantity = stockproductcurrententrepot.quantity;
          const finalquantity = createSortieStockEntrepotDto.quantity - currentquantity;
          const stockentrepot = {
            productId: createSortieStockEntrepotDto.productId,
            quantity: finalquantity
          };
          const id = stockproductcurrententrepot._id;
          this.entrepotproduitstockModel.findByIdAndUpdate({_id: id}, stockentrepot, {new: true}).exec();
        }
      }
      return "created";
    }

  async findAll() {
    const entrepot = await this.entrepotModel.find().populate('productId').exec();
    return entrepot;
  }

  async findAllProductStockEntrepot() {
    const entrepot = await this.entrepotproduitstockModel.find().populate('productId').exec();
    return entrepot;
  }

  async findAllProductSortieStockEntrepot() {
    const sortieentrepot = await this.sortieproduitentrepotModel.find().populate('productId').populate('countryId').exec();
    
    return sortieentrepot;
  }

  async findAllOperation() {
    const entrepot = await this.entrepotoperationModel.find().populate('productId').populate('countryId').exec();
    return entrepot;
  }

  findOne(id: string) {
    return `This action returns a #${id} entrepot`;
  }

  update(id: string, updateEntrepotDto: UpdateEntrepotDto) {
    return `This action updates a #${id} entrepot`;
  }

  remove(id: string) {
    return `This action removes a #${id} entrepot`;
  }
}
