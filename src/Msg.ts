// interface Message { name: string }

// interface Increment extends Message {
//   name: "Increment",
// };

// interface GotText extends Message {
//   name: "GotText",
//   data: {target: {value: 34}},
// };

// type Msg =
//   | Increment
//   | GotText
//   | { name: "SomeMsg" }

enum Message {
  Increment = "Increment",
  GotText = "GotText"
}

type Msg<T = void> = {
  type: Message,
  data: T,
}

type Model = {};

const update = (msg: Msg) => (model: Model) => {
  switch(msg.type) {
    case Message.Increment:
      return "+1";
    case Message.GotText:
      const value = msg.data.target.value;
      return value.toString();
    default:
      return "";
  }
}