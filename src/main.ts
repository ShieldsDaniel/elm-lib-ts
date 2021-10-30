import {commandLineApp} from "./Application"
import * as Tuple from "./Tuple"
import * as Cmd from "./Cmd"

type Tuple<T, U> = Tuple.Tuple<T, U>
type Cmd<Msg> = Cmd.Cmd<Msg>

interface Message { type: string }

interface Increment extends Message {
  type: "Increment",
}

interface GotText extends Message {
  type: "GotText",
  data: {target: {value: 34}},
}

export type Msg =
  | Increment
  | GotText
  | { type: "SomeMsg" }

type Model = { some: string, value: number };

export const update =
  (msg: Msg) =>
    (model: Model): Tuple<Model, Cmd<Msg | void>> => {
      switch (msg.type) {
      case "Increment":
        return [model, Cmd.none ()]
      case "GotText":
        return [model, Cmd.none ()]
      case "SomeMsg":
        return [model, Cmd.none ()]
      }
    }

const main = (() =>
  commandLineApp<Model, Msg> ({
    init: [{some: "hello", value: 12}, Cmd.none ()],
    update: update,
    subscriptions: () => [],
  })) ()
