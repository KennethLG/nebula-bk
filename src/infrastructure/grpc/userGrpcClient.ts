import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { config } from '../../config';
import { User } from '../../domain/entities/user';
import path from 'path';

const PROTO_PATH = path.join(__dirname, './proto/user.proto'); 
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const UserService = protoDescriptor.user.UserService;

type CreateUserDto = {
  email: string;
  password: string;
  username: string;  
}

type getUserByEmailDto = {
  email: string;
}

export class UserGrpcClient {
  private client: any;

  constructor() {
    this.client = new UserService(config.NEBULA_DB_MS_URL, grpc.credentials.createInsecure());
  } 
  
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log('creating user', createUserDto);
    return new Promise((resolve, reject) => {  
      this.client.createUser(createUserDto, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.ALREADY_EXISTS) {
            reject(new Error('User already exists'));
          } else {
            reject(err);
          }
        } else {
          resolve(response);
        }
      });
    });
  }

  public async getUserByEmail(getUserByEmailDto: getUserByEmailDto): Promise<User | null> {
    console.log('getting user by email', getUserByEmailDto);
    return new Promise((resolve, reject) => {
      this.client.getUserByEmail(getUserByEmailDto, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.NOT_FOUND) {
            resolve(null);
          } else {
            reject(err);
          }
          // console.error(`gRPC error: `, err);
          // reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public async getUser(id: string): Promise<User> {
    console.log('getting user by id', id);
    return new Promise((resolve, reject) => {
      this.client.getUser({ id }, (err: any, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

