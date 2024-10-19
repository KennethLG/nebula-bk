import { createClient } from "redis";

export default class RedisClient {
    client;
    constructor() {
        this.client = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        })
        this.client.on("error", (error) => {
            console.error("Error in Redis", error)
        });
        this.connect()
    }

    private async connect() {
        await this.client.connect()
    }
}