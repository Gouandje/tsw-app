import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { DeleteUserResponse } from './dto/delete-response.dto';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    // private readonly httpService: HttpService,
    ) {}


    async findByCredentials(
      emailAddress: string,
      mot_de_passe: string,
    ): Promise<User> {
      const conditions = {
        email: emailAddress,
        mot_de_passe: crypto.createHmac('sha256', mot_de_passe).digest('hex'),
      };
      return await this.userModel.findOne(conditions);
    }


    async create(createUserDto: CreateUserDto): Promise<User> {
      const alreadyExists = await this.userModel.exists({ email: createUserDto.email }).lean();
      if(alreadyExists){
        throw new ConflictException(`un administrateur avec cet email existes déjà`);
      }
      const passwordHash = crypto.createHmac('sha256', createUserDto.mot_de_passe).digest('hex');
      // console.log(createUserDto.roles);
      const createdUser = { ...createUserDto, adminId: randomUUID(), mot_de_passe: passwordHash };
      return this.userModel.create(createdUser);
    }

  async findAll(): Promise<User[]> {
     const users = await this.userModel.find().exec();
    //  console.log(users);
     return users;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    
    // console.log('ici admin apr email',user);
    if (!user) {
      throw new NotFoundException(`L'administrateur n'existe pas ${email}`);
    }
    return user;
  }

  async findRoleByEmail(emailAddress: string): Promise<any> {
    const conditions = {
      email: emailAddress,
    };
    const userObject = await this.userModel.findOne(conditions);

    return userObject;
  }

  // async findByEmail(email: string, mot_de_passe:string): Promise<User> {
  //   const user = await this.userModel.findOne({ email, mot_de_passe }).le;
  //   console.log('ici',user);
  //   if (!user) {
  //     throw new NotFoundException(`L'administrateur n'existe pas ${email}`);
  //   }
  //   return user;
  // }

  async getUser({ email, mot_de_passe }): Promise<User | undefined> {
    return this.userModel.findOne({
      email,
      mot_de_passe,
    });
  }

  async  updateById(adminId: string, userUpdates: UpdateUserDto): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ adminId }, userUpdates, {
        new: true,
      })
      .lean();
  }

  async findById(adminId: string): Promise<User> {
    const user = await this.userModel.findOne({ adminId }).lean();
    if (!user) {
      throw new NotFoundException(`No existe el usuario ${adminId}`);
    }
    return user;
  }

  async remove(adminId: string): Promise<DeleteUserResponse> {
    return this.userModel.findByIdAndDelete(adminId).lean();
  }

  async uploadAvatar(
    avatar: string,
    adminId: string,
  ): Promise<any> {
    const user = await this.userModel.findOne({_id:adminId});
    if (!user) {
      throw 'Administateur non trouvé';
    }

    const updated = await this.userModel.updateOne({_id: adminId},{avatar: avatar}).lean();
    // console.log(updated);
    return user;
  }
}
