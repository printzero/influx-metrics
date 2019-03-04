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
function writeLog(client, db, input) {
    client.writeMeasurement(lookup_1.measurement.syslog, [
        {
            fields: {
                facility_code: input.facility_code == undefined ? 0 : input.facility_code,
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
