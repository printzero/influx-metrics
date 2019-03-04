import { InfluxDB } from "influx"
import { LogSchemaOption, writeLog, ILogMeasurement } from "./models/log"

export class Metrics {
  private influx: InfluxDB | undefined
  private db: string = ""

  constructor() {}

  private async init(db: string, onInit: () => void) {
    this.db = db
    this.influx = new InfluxDB("http://testconnect@localhost:8086/testdb")

    let dbs = await this.influx.getDatabaseNames()
    if (!dbs.includes(this.db)) {
      this.influx.createDatabase(this.db)
    }

    onInit()
  }

  public log(measurement: ILogMeasurement) {
    writeLog(this.influx!, this.db, measurement)
  }
}
