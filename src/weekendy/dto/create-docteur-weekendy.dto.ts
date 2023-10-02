import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { Schema as MongooseSchema } from 'mongoose';

export class CreateDocteurWeekendyDto {
    @ApiProperty({ example: '5efvbe54edfgbknjlh45', description: 'The country id '})
    @IsString()
    @IsNotEmpty()
    bureauId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Weekendy month' })
    readonly mois: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'weekendy debut' })
    readonly periode_debut: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Weekendy fin' })
    readonly periode_fin: string;

    // @IsArray()
    // @ApiProperty({ description: 'Manager' })
    // readonly managers: Manager[];
  
    @IsArray()
    @IsNotEmpty()
    // @Type(() => Products)
    @ApiProperty({ description: 'Products purchased' })
    items: [{quantity: number, productId: string}];
  
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty({ description: 'chiffre d\'affaire totat' })
    readonly caTotal: number;

    @IsString()
    createdAt: string;
}

