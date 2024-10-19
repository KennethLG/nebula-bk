import RedisClient from "../infrastructure/redis";
import { IRedisRepo } from "../interfaces/IRedisRepo";

export default class RedisRepo implements IRedisRepo {
    client;
    constructor(redisClient: RedisClient) {
        this.client = redisClient.client;
    }

    async set(key: string, value: any) {
        try {
            const result = await this.client.set(key, JSON.stringify(value));
            return result;
        } catch (error) {
            console.error(`Error setting key ${key} with value ${JSON.stringify(value)}:`, error);
            throw error;
        }
    }

    async get(key: string) {
        try {
            const result = await this.client.get(key);
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            throw error;
        }
    }

    async push(key: string, value: any) {
        try {
            const result = await this.client.lPush(key, JSON.stringify(value));
            return result;
        } catch (error) {
            console.error(`Error pushing value to key ${key} with value ${JSON.stringify(value)}`, error);
            throw error;
        }
    }

    async pop(key: string) {
        try {
            const result = await this.client.lPop(key);
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error(`Error popping value from key ${key}:`, error);
            throw error;
        }
    }

    async length(key: string) {
        try {
            const result = await this.client.lLen(key);
            return result;
        } catch (error) {
            console.error(`Error getting length of key ${key}:`, error);
            throw error;
        }
    }

    async getRange(key: string, start: number, end: number) {
        try {
            const result = await this.client.lRange(key, start, end);
            return result.map((item: string) => JSON.parse(item));
        } catch (error) {
            console.error(`Error getting range of key ${key} from ${start} to ${end}:`, error);
            throw error;
        }
    }
}