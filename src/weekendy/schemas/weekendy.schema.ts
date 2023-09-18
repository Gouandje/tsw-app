import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Agence } from "src/angence/schemas/agence.schema";
import { Products } from "src/produit/schemas/products.shema";


export type WeekendyDocument = HydratedDocument<Weekendy>;

@Schema()
export class Weekendy {
    
    @Prop({type: MongooseSchema.Types.ObjectId, required: true, ref: Agence.name })
    @ApiProperty({
        example: '5efvbe54edfgbknjlh45',
        description: 'The office id ',
    })
    bureauId: string;

    @ApiProperty()
    @Prop({ required: true, type: String })
    mois: string;

    @ApiProperty()
    @Prop({ required: true, type: String })
    periode_debut: string;

    @ApiProperty()
    @Prop({ required: true, type: String })
    periode_fin: string;

    // @ApiProperty()
    // @Prop({ required: false })
    // managers: Types.Array<Manager>;

    @ApiProperty()
    @Prop({ 
        required: true 
    })
    items: [
        {
        quantity: {
        type: Number,
        default: 1,
        }, 
        productId: {
        type: string,
        ref: Products,
      },
      name: {
        type: string,
        ref: Products,
      }
    }];
  
    @ApiProperty()
    @Prop({ required: true, type: Number })
    caTotal: number;

    @ApiProperty()
    @Prop({ required: true, type: Number })
    TotaltoBank: number;

    @ApiProperty()
    @Prop({ required: true, type: Number })
    chargebureauTotal: number;

    @ApiProperty()
    @Prop({ required: true, type: Number })
    primetrsportTotal: number
  
    @ApiProperty()
    @Prop({ required: true, type: String })
    createdAt: string;
}

export const WeekendySchema = SchemaFactory.createForClass(Weekendy);

