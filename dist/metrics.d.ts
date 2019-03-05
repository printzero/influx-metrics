import { Severity } from "./models/log";
import { Drafter } from "./drafter";
export interface IMetricsOption {
    host: string;
    facility: string;
    procId?: number;
    severity_code?: number;
    facility_code?: number;
    version?: number;
    onConnected?: () => void;
}
export declare class Metrics {
    private client;
    drafter: Drafter;
    private db;
    private defaultOptions;
    constructor(db: string, options: IMetricsOption);
    /**
     * ensureOptions() ensures all the options inside IMetricOption
     * are set to default values
     */
    private ensureOptions;
    /**
     * Initialize this.influx and post callback to onConnected
     *
     * @param onConnected callback for when influx db connection is initialized
     */
    private initDb;
    log(message: string, severity: Severity): void;
}
