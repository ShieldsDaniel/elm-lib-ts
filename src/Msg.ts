import * as T from "./Tuple"
import * as L from "./List"

type Tuple<T, U> = T.Tuple<T, U>
type List<T> = L.List<T>

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
    (model: Model): Tuple<Model, { cmd: string }> => {
      switch (msg.type) {
      case "Increment":
        return [model, {cmd: ""}]
      case "GotText":
        return [model, {cmd: msg.data.target.toString ()}]
      case "SomeMsg":
        return [model, {cmd: ""}]
      }
    }
