import { InfluxDB, IPoint } from "influx"

export class Recorder {
  private client: InfluxDB
  private measurement = ""
  private interval = 0
  private routineFunc: (() => IPoint) | undefined
  private timer: NodeJS.Timeout | undefined

  constructor(client: InfluxDB, name: string) {
    this.measurement = name
    this.client = client
  }

  public every(pointFunc: () => IPoint, interval: number) {
    this.interval = interval
    this.routineFunc = pointFunc
    return this
  }

  public stop() {
    clearTimeout(this.timer!)
  }

  public startRecording() {
    if (this.interval == 0) {
      console.error("no interval ? not gonna record nothing bruh!!")
      return
    }

    // ==> this is wrapping around routine function where the function
    // gets value from the routine and then saves it with its own
    // timeout interval function

    //  ==> a check for routine function is not required bcoz
    // each() saves interval ; if interval is not there then so is
    // routineFunc
    this.timer = setInterval(() => {
      console.log("recording ...")
      let point = this.routineFunc!()
      this.client.writeMeasurement(this.measurement, [point])
    }, this.interval)
  }
}
