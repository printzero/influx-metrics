import { InfluxDB } from "influx"
import { writeLog, Severity } from "./models/log"
import { isUndefined } from "util"
import { Drafter } from "./drafter"

export interface IMetricsOption {
  host: string
  facility: string
  procId?: number
  severity_code?: number
  facility_code?: number
  version?: number
  onConnected?: () => void
}

export class Metrics {
  public client: InfluxDB
  public drafter: Drafter

  private db: string = ""
  private defaultOptions: IMetricsOption

  constructor(db: string, options: IMetricsOption) {
    this.db = db
    this.defaultOptions = options
    this.client = new InfluxDB({
      database: this.db,
      host: this.defaultOptions.host
    })

    this.drafter = new Drafter(this.client)

    this.ensureOptions()
    this.initDb(options.onConnected)
  }

  /**
   * ensureOptions() ensures all the options inside IMetricOption
   * are set to default values
   */
  private ensureOptions() {
    // TODO: with object.keys method

    if (isUndefined(this.defaultOptions.procId)) {
      this.defaultOptions.procId = 999
    }

    if (isUndefined(this.defaultOptions.facility)) {
      this.defaultOptions.facility = "default"
    }

    if (isUndefined(this.defaultOptions.version)) {
      this.defaultOptions.version = 1
    }

    if (isUndefined(this.defaultOptions.severity_code)) {
      this.defaultOptions.severity_code = 1
    }

    if (isUndefined(this.defaultOptions.facility_code)) {
      this.defaultOptions.facility_code = 1
    }
  }

  /**
   * Initialize this.influx and post callback to onConnected
   *
   * @param onConnected callback for when influx db connection is initialized
   */
  private initDb(onConnected?: () => void) {
    this.client
      .getDatabaseNames()
      .then(dbs => {
        if (!dbs.includes(this.db)) {
          this.client.createDatabase(this.db)
        }

        if (!isUndefined(onConnected)) {
          onConnected()
        }
      })
      .catch(e => console.error(e))
  }

  public log(message: string, severity: Severity) {
    writeLog(this.client, this.db, message, severity, this.defaultOptions)
  }
}
