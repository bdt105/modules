import { Connexion } from "bdt105connexion/dist";
import { MyToolbox } from "./MyToolbox";
export declare class BaseApi {
    protected app: any;
    protected connexion: Connexion;
    protected requiresToken: boolean;
    protected myToolbox: MyToolbox;
    constructor(app: any, connexion: Connexion, requiresToken?: boolean);
}
export declare class RecordsetApi extends BaseApi {
    protected errorMessage(text: string): {
        "status": string;
        "message": string;
    };
    protected assignObject(): void;
}
export declare class TableApi extends BaseApi {
    protected errorMessage(text: string): {
        "status": string;
        "message": string;
    };
    assign(tableName: string, idFieldName: string, fields?: any): void;
    protected assignObject(tableName: string, idFieldName: string, fields?: any): void;
}
