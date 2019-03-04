import { InfluxDB } from "influx"
import { writeLog, ILogMeasurement } from "./models/log"
import { isUndefined } from "util"

export interface IMetricsOption {
  host: string
  procId?: number
  facility?: string
  severity_code?: number
  facility_code?: number
  version?: number
  onConnected?: () => void
}

export class Metrics {
  private influx: InfluxDB
  private db: string = ""
  private defaultOptions: IMetricsOption

  constructor(db: string, options: IMetricsOption) {
    this.db = db
    this.defaultOptions = options
    this.influx = new InfluxDB({
      database: this.db,
      host: this.defaultOptions.host
    })

    this.ensureOptions()
    this.initDb(options.onConnected)
  }

  /**
   * ensureOptions() ensures all the options inside IMetricOption
   * are set to default values
   */
  private ensureOptions() {
    Object.keys(this.defaultOptions).map((v, i, array) => {
      if (isUndefined((<any>this.defaultOptions)[v])) {
        switch (v) {
          case "procId":
            this.defaultOptions[v] = 999
            break
          case "facility":
            this.defaultOptions[v] = "default"
            break
          case "version":
          case "severity_code":
          case "facility_code":
            this.defaultOptions[v] = 1
            break
        }
      }
    })
  }

  /**
   * Initialize this.influx and post callback to onConnected
   *
   * @param onConnected callback for when influx db connection is initialized
   */
  private initDb(onConnected?: () => void) {
    this.influx
      .getDatabaseNames()
      .then(dbs => {
        if (!dbs.includes(this.db)) {
          this.influx.createDatabase(this.db)
        }

        if (!isUndefined(onConnected)) {
          onConnected()
        }
      })
      .catch(e => console.error(e))
  }

  public log(measurement: ILogMeasurement) {
    writeLog(this.influx!, this.db, measurement)
  }
}
