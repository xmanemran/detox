declare namespace npmlog {
    interface StyleObject {
        fg: string;
        bg: string;
        bold: boolean;
        inverse: boolean;
        underline: boolean;
        bell: boolean;
    }

    type Event = any;

    interface MessageObject {
        id: number;
        level: string;
        prefix: string;
        message: string;
        messageRaw: any[];
    }

    export interface INPMLogModule {
        level: string;
        record: MessageObject[];
        maxRecordSize: number;
        prefixStyle: StyleObject;
        headingStyle: StyleObject;
        heading: string;
        stream: ReadableStream;

        enableColor(): void;
        disableColor(): void;
        enableProgress(): void;
        disableProgress(): void;
        enableUnicode(): void;
        disableUnicode(): void;
        setGaugeTemplate(template: any): void;
        setGaugeThemeset(themes: any): void;
        pause(): void;
        resume(): void;

        log(level: string, prefix: string, ...message: any[]): void;
        silly(prefix: string, ...message: any[]): void;
        verbose(prefix: string, ...message: any[]): void;
        info(prefix: string, ...message: any[]): void;
        http(prefix: string, ...message: any[]): void;
        warn(prefix: string, ...message: any[]): void;
        error(prefix: string, ...message: any[]): void;
        addLevel(level: string, n: number, style: StyleObject, disp: string): void;
        newItem(name: string, todo: number, weight: number): void;
        newStream(name: string, todo: number, weight: number): void;
        newGroup(name: string, weight: number): void;
    }
}

declare module "npmlog" {
    import INPMLogModule = npmlog.INPMLogModule;
    const m: INPMLogModule;

    export = m;
}
