const metrics = require("../dist/metrics")
const log = require("../dist/models/log")

let influx = new metrics.Metrics("test", {
  host: "localhost",
  facility: "testbro"
})

setTimeout(() => {
  influx.stopRecording("hello")
}, 6000)

influx.recordInterval(
  "hello",
  () => {
    return {
      fields: {
        name: "Ashish",
        job: "recorder"
      },
      tags: {
        slogan: "metrics is like matrics"
      },
      timestamp: Date.now()
    }
  },
  1000
)
