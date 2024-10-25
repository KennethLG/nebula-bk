export interface IRedisRepo {
    set: (key: string, value: any) => Promise<any>;
    get: <T = any>(key: string) => Promise<T>;
    push: (key: string, value: any) => Promise<any>;
    pushMany: (key: string, values: any[]) => Promise<any>;
    pop: (key: string, count?: number) => Promise<any>;
    length: (key: string) => Promise<number>;
    getRange: (key: string, start: number, end: number) => Promise<any[]>;
    trim: (key: string, start: number, end: number) => Promise<any>;
    remove: (key: string, count: number, value: any) => Promise<any>;
}