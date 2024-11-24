export interface IRedisRepo {
    set: (key: string, value: any) => Promise<any>;
    get: <T = any>(key: string) => Promise<T | null>;
}
