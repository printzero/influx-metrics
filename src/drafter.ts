import { InfluxDB, IPoint } from "influx"

export class Drafter {
  private client: InfluxDB
  private recorder: Recorder

  constructor(client: InfluxDB) {
    this.client = client
    this.recorder = new Recorder(this.client)
  }

  /**
   * records the point that forces it to keep it as a noddpoint interface
   *
   * @param measurement name of the measurement
   * @param point point that
   */
  public async record<T extends IPoint>(measurement: string, point: T) {
    let datas = await this.client.getMeasurements()
    if (!datas.includes(measurement)) {
      this.client.writeMeasurement(measurement, [
        {
          fields: point.fields,
          tags: point.tags
        }
      ])
    } else {
      this.client.writePoints([point])
    }
  }
}

class Recorder {
  private client: InfluxDB
  private measurement = ""
  private interval = 0
  private routineFunc: (() => IPoint) | undefined

  constructor(client: InfluxDB) {
    this.client = client
  }

  public create(): Recorder {
    return new Recorder(this.client)
  }

  public for(name: string) {
    this.measurement = name
    return this
  }

  public each(interval: number, pointFunc: () => IPoint) {
    this.interval = interval
    this.routineFunc = pointFunc
    return this
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
    setTimeout(async () => {
      let point = this.routineFunc!()
      let datas = await this.client.getMeasurements()
      if (!datas.includes(this.measurement)) {
        this.client.writeMeasurement(this.measurement, [
          {
            fields: point.fields,
            tags: point.tags
          }
        ])
      } else {
        this.client.writePoints([point])
      }
    }, this.interval)
  }
}
