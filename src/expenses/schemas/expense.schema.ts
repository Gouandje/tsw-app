import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @ApiProperty({
        example: '8104f19c-a2d8-40f7-9a0b-12f4c6a4b80a',
        description: 'The ID of the angency',
      })
    @Prop({
    required: true,
    index: { unique: true },
    default: () => randomUUID(),
    })
    expenseId: string;


    @Prop({ required: true })
    @ApiProperty({
        example: '27-05-2023',
        description: 'The date of expense',
    })
    datesortie: string;

    @Prop({ required: true })
    @ApiProperty({
        example: 'Boris',
        description: 'The auteur of the expense',
    })
    auteur: string;

    @Prop({ required: true })
    @ApiProperty({
        example: 'Achat d\'équipement médical',
        description: 'The reason of the expense',
    })
    motif: string;

    @Prop({ required: true })
    @ApiProperty({
        example: 'Achat d\'équipement médical',
        description: 'The reason of the expense',
    })
    montantsorti: number;

    
 
}
export const ExpenseSchema = SchemaFactory.createForClass(Expense);