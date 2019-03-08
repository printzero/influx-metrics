const metrics = require("../dist/metrics")

let influx = new metrics.Metrics("testdb", {
  host: "localhost",
  facility: "console",
  procId: 1
})

influx.record("testm", {
  timestamp: Date.now(),
  fields: {
    name: "Ashish",
    job: "code"
  }
})
