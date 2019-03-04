import * as os from "os"
import { ISchemaOptions, FieldType, InfluxDB } from "influx"
import { measurement } from "../lookup"

/** @internal */
export const LogSchemaOption: ISchemaOptions = {
  measurement: "syslog",
  fields: {
    timestamp: FieldType.INTEGER,
    message: FieldType.STRING,
    facility_code: FieldType.INTEGER,
    severity_code: FieldType.STRING,
    procid: FieldType.INTEGER,
    version: FieldType.INTEGER
  },
  tags: ["host", "severity", "appname", "facility", "hostname"]
}

/** @internal */
export function queryLogsByDate(timestamp: number) {}

/** @internal */
export function writeLog(client: InfluxDB, db: string, input: ILogMeasurement) {
  client.writeMeasurement(measurement.syslog, [
    {
      fields: {
        facility_code:
          input.facility_code == undefined ? 0 : input.facility_code,
        severity_code: input.severity_code ? 0 : input.severity_code,
        message: input.message,
        timestamp: Date.now(),
        procid: input.procId,
        version: input.version
      },
      tags: {
        appname: db,
        severity: input.severity,
        facility: input.facility == undefined ? "server" : input.facility,
        host: input.host,
        hostname: os.hostname()
      }
    }
  ])
}

export interface ILogMeasurement {
  procId: number
  host: string
  message: string
  severity: Severity
  severity_code?: number
  facility?: string
  facility_code?: number
  version: number
}

export enum Severity {
  EMERGENCY = "emerg",
  ALERT = "alert",
  CRITICAL = "crit",
  ERROR = "err",
  WARNING = "warning",
  NOTICE = "notice",
  INFO = "info",
  DEBUG = "debug"
}
