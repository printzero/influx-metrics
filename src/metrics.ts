import { InfluxDB, IPoint } from "influx"
import { writeLog, Severity } from "./models/log"
import { isUndefined } from "util"
import { Request, Response, NextFunction } from "express"
import * as Middlewares from "./middlewares/express"
import { Recorder } from "./recorder"

export interface IMetricsOption {
  host: string
  facility: string
  procId?: number
  severity_code?: number
  facility_code?: number
  version?: number
  onConnected?: () => void
}

interface IBook {
  [tasks: string]: Recorder
}
export class Metrics {
  private client: InfluxDB
  private book: IBook = {}

  private db: string = ""
  private defaultOptions: IMetricsOption

  constructor(db: string, options: IMetricsOption) {
    this.db = db
    this.defaultOptions = options
    this.client = new InfluxDB({
      database: this.db,
      host: this.defaultOptions.host
    })

    this.ensureOptions()
    this.initDb(options.onConnected)
  }

  public express(req: Request, res: Response, next: NextFunction) {
    let e = new Middlewares.Express()
    e.express(req, res)
    next()
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

  /**
   * records the point that forces it to keep it as a noddpoint interface
   *
   * @param measurement name of the measurement
   * @param point point that
   */
  public async record(measurement: string, point: IPoint) {
    await this.client.writeMeasurement(measurement, [
      {
        fields: point.fields,
        tags: point.tags
      }
    ])
  }

  public recordInterval(
    measurement: string,
    func: () => IPoint,
    interval: number
  ) {
    let recorder = new Recorder(this.client, measurement)
    this.book[measurement] = recorder
    recorder.every(func, interval).startRecording()
  }

  public stopRecording(measurement: string) {
    this.book[measurement].stop()
  }
}
