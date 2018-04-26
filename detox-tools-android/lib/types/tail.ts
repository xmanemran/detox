declare module "tail" {
    import EventEmitter = NodeJS.EventEmitter;

    class Tail extends EventEmitter {
        constructor(filename: string);
        public unwatch(): void;
    }
}
