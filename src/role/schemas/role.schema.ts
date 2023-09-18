import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
    
    @Prop()
    @ApiProperty({
        example: 'Côte d\'Ivoire',
        description: 'Name of country',
    })
    role: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);