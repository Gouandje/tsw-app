import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateManagerDto {
 
    @ApiProperty({
        example: 'Kouassi',
        description: 'The name of the agency',
    })
    @IsString()
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        example: 'Kouamé  Fabrice',
        description: 'The name of the agency',
    })
    @IsString()
    @IsNotEmpty()
    prenom: string;

    @ApiProperty({
        example: 'Bonoufla',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    lieu_naiss: string; 

    @ApiProperty({
        example: 'CI0001112223',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    piece: string;

    @ApiProperty({
        example: 'CI0001112223',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    num_piece: string;

    @ApiProperty({
        example: 'Feminin',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    genre: string;

    @ApiProperty({
        example: 'CI0001112223',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    situation_matrimonial: string;

    @ApiProperty({
        example: '20-11-1989',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    ethnie: string;

    @ApiProperty({
        example: '20-11-1989',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    religion: string;

    @ApiProperty({
        example: '20-11-1989',
        description: 'The birthday of the manager',
    })
    @IsNumber()
    nbr_enfant: number;

    @ApiProperty({
        example: '20-11-1989',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    maladie_exist: string;


    @ApiProperty({
        example: 'Superviseur zone manager',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    grade: string; 

    @ApiProperty({
        example: '+2250700000000',
        description: 'The phone of the manager',
    })
    @IsString()
    @IsNotEmpty()
    telephone: string;

    @ApiProperty({
        example: '20-11-1989',
        description: 'The birthday of the manager',
    })
    @IsString()
    @IsNotEmpty()
    date_naiss: string;

}
