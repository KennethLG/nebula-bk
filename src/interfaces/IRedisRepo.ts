export interface IRedisRepo {
    set: (key: string, value: any) => Promise<any>;
    get: (key: string) => Promise<any>;
    push: (key: string, value: any) => Promise<any>;
    pop: (key: string) => Promise<any>;
    length: (key: string) => Promise<number>;
    getRange: (key: string, start: number, end: number) => Promise<any[]>;
}