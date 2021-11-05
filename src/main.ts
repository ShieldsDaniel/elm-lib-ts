/* eslint-disable no-undef */
/* eslint-disable fp/no-unused-expression */
import {commandLineApp} from "./Application"
import * as Tuple from "./Tuple"
import * as Cmd from "./Cmd"
import * as Task from "./Task"
import readline from "readline"

type Tuple<T, U> = Tuple.Tuple<T, U>
type Cmd<Msg> = Cmd.Cmd<Msg>

interface Message { type: string }

interface GotName extends Message {
  type: "GotName"
  data: string
}

const readLine = (questionText: string): Cmd<GotName> =>
  Task.perform (() =>
    new Promise<GotName> ((res, _rej) => {
      const rl = readline.createInterface ({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question (questionText, answer => {
        res ({
          type: "GotName",
          data: answer.trim (),
        })
        rl.close ()
      })
    })
  )

interface LoggedResult extends Message {
  type: "LoggedResult"
}

const consoleLog = (logString: string): Cmd<LoggedResult> =>
  Task.perform (async () => {
    console.log (logString)
    return {type: "LoggedResult"}
  })

export type Msg =
  | GotName
  | LoggedResult

type Model = { some: string, value: number };

export const update =
  (msg: Msg) =>
    (model: Model): Tuple<Model, Cmd<Msg | void>> => {
      switch (msg.type) {
      case "GotName":
        return [model, consoleLog ("So your name appears to be " + msg.data)]
      case "LoggedResult":
        return [model, Cmd.none ()]
      }
    }

function main(args: string[]): void {
  commandLineApp<Model, Msg> ({
    init: [{some: "hello", value: 12}, readLine ("What is your name?\n")],
    update: update,
    subscriptions: () => [],
  })
}

main (process.argv)
