"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var influx_1 = require("influx");
var log_1 = require("./models/log");
var util_1 = require("util");
var drafter_1 = require("./drafter");
var Metrics = /** @class */ (function () {
    function Metrics(db, options) {
        this.db = "";
        this.db = db;
        this.defaultOptions = options;
        this.client = new influx_1.InfluxDB({
            database: this.db,
            host: this.defaultOptions.host
        });
        this.drafter = new drafter_1.Drafter(this.client);
        this.ensureOptions();
        this.initDb(options.onConnected);
    }
    /**
     * ensureOptions() ensures all the options inside IMetricOption
     * are set to default values
     */
    Metrics.prototype.ensureOptions = function () {
        // TODO: with object.keys method
        if (util_1.isUndefined(this.defaultOptions.procId)) {
            this.defaultOptions.procId = 999;
        }
        if (util_1.isUndefined(this.defaultOptions.facility)) {
            this.defaultOptions.facility = "default";
        }
        if (util_1.isUndefined(this.defaultOptions.version)) {
            this.defaultOptions.version = 1;
        }
        if (util_1.isUndefined(this.defaultOptions.severity_code)) {
            this.defaultOptions.severity_code = 1;
        }
        if (util_1.isUndefined(this.defaultOptions.procId)) {
            this.defaultOptions.facility_code = 1;
        }
    };
    /**
     * Initialize this.influx and post callback to onConnected
     *
     * @param onConnected callback for when influx db connection is initialized
     */
    Metrics.prototype.initDb = function (onConnected) {
        var _this = this;
        this.client
            .getDatabaseNames()
            .then(function (dbs) {
            if (!dbs.includes(_this.db)) {
                _this.client.createDatabase(_this.db);
            }
            if (!util_1.isUndefined(onConnected)) {
                onConnected();
            }
        })
            .catch(function (e) { return console.error(e); });
    };
    Metrics.prototype.log = function (message, severity) {
        log_1.writeLog(this.client, this.db, message, severity, this.defaultOptions);
    };
    return Metrics;
}());
exports.Metrics = Metrics;
