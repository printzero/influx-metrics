const metrics = require("../dist/metrics")
const log = require("../dist/models/log")

let influx = new metrics.Metrics("test", {
  host: "localhost",
  facility: "testbro"
})
influx.drafter.record("testtest", {
  fields: {
    procId: 11,
    host: "local",
    message: "this is from metrics package",
    severity: log.Severity.INFO
  },
  tags: {}
})
