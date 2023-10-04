import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Pays } from "src/pays/schemas/pays.schema";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type PayscaDocument = HydratedDocument<Paysca>;

@Schema()
export class Paysca {
    
    @Prop({type: MongooseSchema.Types.ObjectId, required: true, ref: Pays.name })
    @ApiProperty({
        example: '5efvbe54edfgbknjlh45',
        description: 'The office id ',
    })
    countryId: string;

    @ApiProperty()
    @Prop({ required: true, type: String })
    mois: string;

    @ApiProperty()
    @Prop({ required: true, type: Number })
    caTotal: number;
}
export const PayscaSchema = SchemaFactory.createForClass(Paysca);

