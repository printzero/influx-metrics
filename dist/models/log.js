"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = __importStar(require("os"));
var influx_1 = require("influx");
var lookup_1 = require("../lookup");
/** @internal */
exports.LogSchemaOption = {
    measurement: "syslog",
    fields: {
        timestamp: influx_1.FieldType.INTEGER,
        message: influx_1.FieldType.STRING,
        facility_code: influx_1.FieldType.INTEGER,
        severity_code: influx_1.FieldType.STRING,
        procid: influx_1.FieldType.INTEGER,
        version: influx_1.FieldType.INTEGER
    },
    tags: ["host", "severity", "appname", "facility", "hostname"]
};
/** @internal */
function queryLogsByDate(timestamp) { }
exports.queryLogsByDate = queryLogsByDate;
/** @internal */
function writeLog(client, appname, message, severity, options) {
    client.writeMeasurement(lookup_1.measurement.syslog, [
        {
            fields: {
                facility_code: options.facility_code,
                severity_code: options.severity_code,
                message: message,
                timestamp: Date.now(),
                procid: options.procId,
                version: options.version
            },
            tags: {
                appname: appname,
                severity: severity,
                facility: options.facility,
                host: options.host,
                hostname: os.hostname()
            }
        }
    ]);
}
exports.writeLog = writeLog;
var Severity;
(function (Severity) {
    Severity["EMERGENCY"] = "emerg";
    Severity["ALERT"] = "alert";
    Severity["CRITICAL"] = "crit";
    Severity["ERROR"] = "err";
    Severity["WARNING"] = "warning";
    Severity["NOTICE"] = "notice";
    Severity["INFO"] = "info";
    Severity["DEBUG"] = "debug";
})(Severity = exports.Severity || (exports.Severity = {}));
