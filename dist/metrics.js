"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var influx_1 = require("influx");
var log_1 = require("./models/log");
var util_1 = require("util");
var Metrics = /** @class */ (function () {
    function Metrics(db, options) {
        this.db = "";
        this.db = db;
        this.defaultOptions = options;
        this.influx = new influx_1.InfluxDB({
            database: this.db,
            host: this.defaultOptions.host
        });
        this.ensureOptions();
        this.initDb(options.onConnected);
    }
    /**
     * ensureOptions() ensures all the options inside IMetricOption
     * are set to default values
     */
    Metrics.prototype.ensureOptions = function () {
        var _this = this;
        Object.keys(this.defaultOptions).map(function (v, i, array) {
            if (util_1.isUndefined(_this.defaultOptions[v])) {
                switch (v) {
                    case "procId":
                        _this.defaultOptions[v] = 999;
                        break;
                    case "facility":
                        _this.defaultOptions[v] = "default";
                        break;
                    case "version":
                    case "severity_code":
                    case "facility_code":
                        _this.defaultOptions[v] = 1;
                        break;
                }
            }
        });
    };
    /**
     * Initialize this.influx and post callback to onConnected
     *
     * @param onConnected callback for when influx db connection is initialized
     */
    Metrics.prototype.initDb = function (onConnected) {
        var _this = this;
        this.influx
            .getDatabaseNames()
            .then(function (dbs) {
            if (!dbs.includes(_this.db)) {
                _this.influx.createDatabase(_this.db);
            }
            if (!util_1.isUndefined(onConnected)) {
                onConnected();
            }
        })
            .catch(function (e) { return console.error(e); });
    };
    Metrics.prototype.log = function (measurement) {
        log_1.writeLog(this.influx, this.db, measurement);
    };
    return Metrics;
}());
exports.Metrics = Metrics;
