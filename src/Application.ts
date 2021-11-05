/* eslint-disable fp/no-throw */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-let */
import { fork } from "fluture";
import { Cmd } from "./Cmd";
import { Sub } from "./Sub";
import { Tuple, first, second } from "./Tuple";

export const commandLineApp = <Model, Msg>({
  init,
  update,
  subscriptions,
}: {
  init: Tuple<Model, Cmd<Msg | void>>;
  update: (msg: Msg) => (model: Model) => [Model, Cmd<Msg | void>];
  subscriptions: (model: Model) => Sub;
}): void => {
  let model: Model = first(init);
  let command: Cmd<Msg | void> = second(init);
  const mainLoop = () =>
    fork(console.warn)((msg: Msg) => {
      try {
        // @ts-ignore
        if (msg) {
          const updateData = update(msg)(model);
          model = first(updateData);
          command = second(updateData);
          mainLoop();
        }
      } catch (e: unknown) {
        console.warn("Well that broke: " + (e as Error).message ?? "");
      }
    })(
      // @ts-ignore
      command
    );
  mainLoop();
};
