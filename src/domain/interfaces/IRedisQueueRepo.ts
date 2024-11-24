export interface IRedisQueueRepo {
  push(key: string, value: any, left?: boolean): Promise<number>;
  trim(key: string, start: number, end: number): Promise<string>;
  range(key: string, start: number, end: number): Promise<any[]>;
  length(key: string): Promise<number>;
}
