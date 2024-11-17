import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { config } from '../../config';
import { User } from '../../domain/entities/user';

const PROTO_PATH = path.join(__dirname, '../../proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const UserService = protoDescriptor.UserService as any;

export class UserGrpcClient {
  private client: any;

  constructor() {
    this.client = new UserService(config.NEBULA_DB_MS_URL, grpc.credentials.createInsecure());
  }

  public async createUser(user: any) {
    return new Promise((resolve, reject) => {
      this.client.createUser(user, (err: any, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public async getUser(id: string): Promise<User> {
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

