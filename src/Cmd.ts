import {Task, succeed, sequence} from "./Task"
import {List} from "./List"

export type Cmd<T = void> = Task<Error, T>

export const none = (): Cmd<void> => succeed (undefined)

export const batch = <Msg>(commands: List<Cmd<Msg>>): Cmd<Msg[]> =>
  sequence (commands)
