import { InfluxDB, IPoint } from "influx";
export declare class Drafter {
    private client;
    private recorder;
    constructor(client: InfluxDB);
    /**
     * records the point that forces it to keep it as a noddpoint interface
     *
     * @param measurement name of the measurement
     * @param point point that
     */
    record<T extends IPoint>(measurement: string, point: T): void;
}
