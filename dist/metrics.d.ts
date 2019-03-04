import { ILogMeasurement } from "./models/log";
export declare class Metrics {
    private influx;
    private db;
    constructor();
    private init;
    log(measurement: ILogMeasurement): void;
}
