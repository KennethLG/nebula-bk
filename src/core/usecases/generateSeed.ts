export class GenerateSeed {
    execute(): number {
        const seed = Math.floor(Math.random() * 1000000);
        return seed;
    }
}