const metrics = require("../dist/metrics")
const log = require("../dist/models/log")

let influx = new metrics.Metrics()
influx.init("testdb", () => {
  influx.log({
    procId: 11,
    host: "local",
    message: "this is from metrics package",
    severity: log.Severity.INFO,
    facility: "metrics-test",
    severity_code: 1,
    facility_code: 11,
    version: 1.0
  })
})
