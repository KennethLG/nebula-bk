import { User } from "../entities/user"

type CreateUserDto = Omit<User, 'id'>

export interface IUsersRepo {
  createUser: (createUserDto: CreateUserDto) => Promise<void>
  getUser: (id: string) => Promise<User>
}
