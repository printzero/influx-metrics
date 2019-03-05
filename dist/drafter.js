"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Drafter = /** @class */ (function () {
    function Drafter(client) {
        this.client = client;
        this.recorder = new Recorder(this.client);
    }
    /**
     * records the point that forces it to keep it as a noddpoint interface
     *
     * @param measurement name of the measurement
     * @param point point that
     */
    Drafter.prototype.record = function (measurement, point) {
        this.client.writeMeasurement(measurement, [
            {
                fields: point.fields,
                tags: point.tags
            }
        ]);
    };
    return Drafter;
}());
exports.Drafter = Drafter;
var Recorder = /** @class */ (function () {
    function Recorder(client) {
        this.measurement = "";
        this.interval = 0;
        this.client = client;
    }
    Recorder.prototype.create = function () {
        return new Recorder(this.client);
    };
    Recorder.prototype.for = function (name) {
        this.measurement = name;
        return this;
    };
    Recorder.prototype.each = function (interval, pointFunc) {
        this.interval = interval;
        this.routineFunc = pointFunc;
        return this;
    };
    Recorder.prototype.startRecording = function () {
        var _this = this;
        if (this.interval == 0) {
            console.error("no interval ? not gonna record nothing bruh!!");
            return;
        }
        // ==> this is wrapping around routine function where the function
        // gets value from the routine and then saves it with its own
        // timeout interval function
        //  ==> a check for routine function is not required bcoz
        // each() saves interval ; if interval is not there then so is
        // routineFunc
        setTimeout(function () {
            var point = _this.routineFunc();
            _this.client.writeMeasurement(_this.measurement, [
                {
                    fields: point.fields,
                    tags: point.tags
                }
            ]);
        }, this.interval);
    };
    return Recorder;
}());
