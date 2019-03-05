import { InfluxDB } from "influx";
export interface INoddPoint {
    fields: {
        string: any;
    };
    tags: {
        string: string;
    };
}
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
    record<T extends INoddPoint>(measurement: string, point: T): Promise<void>;
}
