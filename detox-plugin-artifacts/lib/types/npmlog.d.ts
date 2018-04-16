declare module "npmlog" {
    type StyleObject = {
        fg: string;
        bg: string;
        bold: boolean;
        inverse: boolean;
        underline: boolean;
        bell: boolean;
    };

    var level: string;
    var record: MessageObject[];
    var maxRecordSize: number;
    var prefixStyle: StyleObject;
    var headingStyle: StyleObject;
    var heading: string;
    var stream: ReadableStream;

    function enableColor(): void;
    function disableColor(): void;
    function enableProgress(): void;
    function disableProgress(): void;
    function enableUnicode(): void;
    function disableUnicode(): void;
    function setGaugeTemplate(template: any): void;
    function setGaugeThemeset(themes: any): void;
    function pause(): void;
    function resume(): void;

    function log(level: string, prefix: string, ...message: any[]): void;
    function silly(prefix: string, ...message: any[]): void;
    function verbose(prefix: string, ...message: any[]): void;
    function info(prefix: string, ...message: any[]): void;
    function http(prefix: string, ...message: any[]): void;
    function warn(prefix: string, ...message: any[]): void;
    function error(prefix: string, ...message: any[]): void;
    function addLevel(level: string, n: number, style: StyleObject, disp: string): void;
    function newItem(name: string, todo: number, weight: number): void;
    function newStream(name: string, todo: number, weight: number): void;
    function newGroup(name: string, weight: number): void;

    type Event = any;

    type MessageObject = {
        id: number;
        level: string;
        prefix: string;
        message: string;
        messageRaw: any[];
    };
}

