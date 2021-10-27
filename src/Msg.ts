import {Tuple} from "./Tuple"

interface Message { type: string }

interface Increment extends Message {
  type: "Increment",
}

interface GotText extends Message {
  type: "GotText",
  data: {target: {value: 34}},
}

type Msg =
  | Increment
  | GotText
  | { type: "SomeMsg" }

type Model = Record<string, unknown>;

export const update =
  (msg: Msg) =>
    (model: Model): Tuple<Model, { cmd: string }> => {
      switch (msg.type) {
      case "Increment":
        return [model, {cmd: ""}]
      case "GotText":
        return [model, {cmd: ""}]
      case "SomeMsg":
        return [model, {cmd: ""}]
      }
      return [model, {cmd: ""}]
    }


// enum Message {
//   Increment = "Increment",
//   GotText = "GotText"
// }

// type Msg<T = void> = {
//   type: Message,
//   data: T,
// }

// type Model = {};

// const update = (msg: Msg) => (model: Model) => {
//   switch(msg.type) {
//     case Message.Increment:
//       return "+1";
//     case Message.GotText:
//       const value = msg.data.target.value;
//       return value.toString();
//     default:
//       return "";
//   }
// }
