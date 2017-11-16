export declare class Rest {
    logFileName: string;
    logToConsole: boolean;
    private toolbox;
    constructor(logFileName?: string, logToConsole?: boolean);
    call(callback: Function, method: string, url: string, body?: any, contentType?: string, getRaw?: boolean): void;
}
