import * as os from "os"
import { ISchemaOptions, FieldType, InfluxDB } from "influx"
import { measurement } from "../lookup"
import { IMetricsOption } from "../metrics"

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
export function writeLog(
  client: InfluxDB,
  appname: string,
  message: string,
  severity: Severity,
  options: IMetricsOption
) {
  client.writeMeasurement(measurement.syslog, [
    {
      fields: {
        facility_code: options.facility_code,
        severity_code: options.severity_code,
        message,
        timestamp: Date.now(),
        procid: options.procId,
        version: options.version
      },
      tags: {
        appname,
        severity,
        facility: options.facility,
        host: options.host,
        hostname: os.hostname()
      }
    }
  ])
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
