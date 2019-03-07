const metrics = require("../dist/metrics")
const Severity = require("../dist/models/log").Severity

let influx = new metrics.Metrics("testdb", {
  host: "localhost",
  facility: "console",
  procId: 1
})

influx.log("this is a test message", Severity.INFO)
