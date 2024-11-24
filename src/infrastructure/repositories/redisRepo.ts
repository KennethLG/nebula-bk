import { IRedisRepo } from "../../domain/interfaces/IRedisRepo";
import RedisClient from "../redis";

export default class RedisRepo implements IRedisRepo {
    client;
    constructor(redisClient: RedisClient) {
        this.client = redisClient.client;
    }

    async set(key: string, value: any) {
      console.log(`executing set with key ${key} and value ${JSON.stringify(value)}`);
        try {
            const result = await this.client.set(key, JSON.stringify(value));
            return result;
        } catch (error) {
            console.error(`Error setting key ${key} with value ${JSON.stringify(value)}:`, error);
            throw error;
        }
    }

    async get(key: string) {
      console.log(`executing get with key ${key}`);
        try {
            const result = await this.client.get(key);
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            throw error;
        }
    }
}
