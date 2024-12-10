import { IRedisQueueRepo } from "../../domain/interfaces/IRedisQueueRepo";
import RedisClient from "../redis";

export class RedisQueueRepo implements IRedisQueueRepo {
  public client;
  constructor(redisClient: RedisClient) {
    this.client = redisClient.client;
  }

  async push(key: string, value: any, left: boolean = true) {
    console.log(
      `executing push with key ${key} and value ${JSON.stringify(value)}`,
    );
    try {
      const result = left
        ? await this.client.lPush(key, JSON.stringify(value))
        : await this.client.rPush(key, JSON.stringify(value));
      return result;
    } catch (error) {
      console.error(
        `Error pushing value ${JSON.stringify(value)} to key ${key}:`,
        error,
      );
      throw error;
    }
  }

  async trim(key: string, start: number, end: number) {
    console.log(`executing trim with key ${key} from ${start} to ${end}`);
    try {
      const result = await this.client.lTrim(key, start, end);
      return result;
    } catch (error) {
      console.error(
        `Error trimming key ${key} from ${start} to ${end}:`,
        error,
      );
      throw error;
    }
  }

  async range(key: string, start: number, end: number) {
    console.log(`executing range with key ${key} from ${start} to ${end}`);
    try {
      const result = await this.client.lRange(key, start, end);
      return result.map((value) => JSON.parse(value));
    } catch (error) {
      console.error(
        `Error getting range from key ${key} from ${start} to ${end}:`,
        error,
      );
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

  async batch(actions: { type: string; args: any[] }[]): Promise<void> {
    const transaction = this.client.multi();
    for (const action of actions) {
      (transaction as any)[action.type](...action.args);
    }
    await transaction.exec();
  }

  async evalScript<T>(script: string, keys: string[], args: any[]): Promise<T> {
    try {
      const result = await this.client.eval(script, {
        keys,
        arguments: args,
      });
      return result as T;
    } catch (error) {
      console.error(`Error executing Lua script:`, error);
      throw error;
    }
  }
}
