import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Section } from "./section.schema";


export type SectioncaDocument = HydratedDocument<Sectionca>;

@Schema()
export class Sectionca {
    @ApiProperty({
        example: 'a2d840f79a0b12f4c6a4b80a',
        description: 'The ID of the angency',
      })
    @Prop({type: MongooseSchema.Types.ObjectId, required: true, ref: Section.name,
    })
    sectionId: string;

    @Prop({ required: true })
    @ApiProperty({
        example: 'Marcory Américain 1',
        description: 'The name of the zone',
    })
    casection: number;

    @Prop({ required: true })
    @ApiProperty({
        example: 'Marcory Américain 1',
        description: 'The name of the zone',
    })
    annee: string;
}
export const SectioncaSchema = SchemaFactory.createForClass(Sectionca);
