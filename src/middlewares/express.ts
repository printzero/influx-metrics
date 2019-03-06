import { Request, Response } from "express"

namespace Middlewares {
  export class Express {
    public express(req: Request, res: Response) {
      console.log("hello from influx-metrics ")
    }
  }
}

export = Middlewares
