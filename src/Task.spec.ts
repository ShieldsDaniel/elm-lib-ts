import * as Task from "./Task"
import { fork } from "fluture"
import {writeFileSync, unlink, readFile} from "fs"
import { pipe } from "./utils"

type Task<E extends Error, T> = Task.Task<E, T>

const testVal = 3
const testError = new Error("test")
const f = (x: number) => x * 2
const g = (x: number) => x + 1
const h = (x: number) => Task.succeed(x * 2)
const i = (x: number) => Task.succeed(x + 1)
const id = <T>(x: T): T => x

const compareResultOf2Tasks =
  <E extends Error, T>(task1: Task<E, T>, task2: Task<E, T>, done?: jest.DoneCallback): void => {
    fork
      (callbackThatShouldNotHappen)
      (
        task1X => {
          fork
            (callbackThatShouldNotHappen)
            (
              task2X => {
                expect(task1X).toEqual(task2X)
                if (done) {
                  done()
                }
              }
            )
            (task2)
        }
      )
      (task1)
  }


const callbackThatShouldNotHappen = (_e: any): never => { throw new Error ("This should never happen") }

describe ("The Task Monad", () => {

  describe("The Functor laws", () => {

    it("Should preserve the 1st Functor law: Functors must preserve identity morphisms `fmap id = id`", done => {
      const task = Task.succeed(testVal)
      const mapped = Task.map(id)(task)
      compareResultOf2Tasks(task, mapped, done)
    })

    it("Should preserve the 2nd Functor law: Functors preserve composition of morphisms `fmap (f . g) == fmap f . fmap g`", done => {
      const composition = (x: number) => g(f(x))
      const task = Task.succeed(testVal)
      const mapComps = Task.map(composition)(task)
      const compMaps = pipe(
        task,
        Task.map(f),
        Task.map(g)
      )
      compareResultOf2Tasks(mapComps, compMaps, done)
    })
  })

  describe("The Monadic laws", () => {

    it("Should preserve the 1st Monadic law: Left Identity `return a >>= h == h a`", done => {
      const chained = pipe(
        Task.succeed(testVal),
        Task.andThen(h)
      )
      const hResult = h(testVal)
      compareResultOf2Tasks(chained, hResult, done)
    })

    it("Should preserve the 2nd Monadic law: Right Identity `m >>= return == m`", done => {
      const task = Task.succeed(testVal)
      const chained = Task.andThen(Task.succeed)(task)
      compareResultOf2Tasks(task, chained, done)
    })

    it("Should preserve the 3rd Monadic law: Associativity `(m >>= g) >>= h == m >>= (\\x -> g x >>= h)`", done => {
      const task = Task.succeed(testVal)
      const assoc1 = pipe(
        task,
        Task.andThen(h),
        Task.andThen(i)
      )
      const assoc2 = pipe(
        task,
        Task.andThen(
          (x) => pipe(h(x), Task.andThen(i))
        )
      )
      compareResultOf2Tasks(assoc1, assoc2, done)
    })
  })

  describe("The static sequence() method", () => {

    it("Should return a Rejected `Task` if any of the values in the array is a Rejected `Task`", done => {
      const sequence: Task<Error, number>[] = [Task.succeed(3), Task.succeed(4), Task.fail(testError), Task.succeed(6)]
      const task = Task.sequence(sequence)
      fork
      (e => {
        expect(e).toBeInstanceOf(Error)
        done()
      })
      (callbackThatShouldNotHappen)
      (task)
    })

    it("Should return a resolved `Task` of an array of results if they are resolved `Task`s", done => {
      const testArr = [3, 4, 5, 6]
      const sequence: Task<never, number>[] = testArr.map(Task.succeed)
      const task = Task.sequence(sequence)
      fork
      (callbackThatShouldNotHappen)
      (x => {
        expect(x).toEqual(testArr)
        done()
      })
      (task)
    })
  })

  describe ("The map4 function", () => {
    const morphism = (a: number) => (b: number) => (c: number) => (d: string) => a + b + c + d.length

    it ("Should short circuit and return an `Err` if any of the provided `Result`s are an `Err`", done => {
      const task1 = Task.succeed (1)
      const task2 = Task.succeed (2)
      const task3 = Task.fail (testError)
      const task4 = Task.succeed ("four")
      const result = Task.map4 (morphism) (task1) (task2) (task3) (task4)
      fork
      ((e: Error) => {
        expect (e.message).toEqual (testError.message)
        done ()
      })
      (callbackThatShouldNotHappen)
      (result)
    })

    it ("Should apply the values of all provided `Result`s to the provided morphism function if all are `Ok`s", done => {
      const task1 = Task.succeed (1)
      const task2 = Task.succeed (2)
      const task3 = Task.succeed (3)
      const task4 = Task.succeed ("four")
      const result = Task.map4 (morphism) (task1) (task2) (task3) (task4)
      compareResultOf2Tasks (result, Task.succeed (10), done)
    })
  })

  // describe("The static tryCatch() method", () => {

  //   it("Should return a Rejected `Task` if the provided function throws", done => {
  //     const fnThatThrows = jest.fn(() => { throw testError })
  //     const task = Task.tryCatch(fnThatThrows)
  //     task.fork(
  //       e => {
  //         expect(e).toBeInstanceOf(Error)
  //         expect(fnThatThrows).toHaveBeenCalledTimes(1)
  //         done()
  //       },
  //       callbackThatShouldNotHappen
  //     )
  //   })

  //   it("Should return a resolved `Task` of the type of the return value of the provided function", done => {
  //     const fnThatReturns = jest.fn(() => testVal)
  //     const task = Task.tryCatch(fnThatReturns)
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       x => {
  //         expect(x).toEqual(testVal)
  //         expect(fnThatReturns).toHaveBeenCalledTimes(1)
  //         done()
  //       }
  //     )
  //   })
  // })

  // describe("The static encaseIO method", () => {

  //   it("Should return a task that encases an IO function", done => {
  //     let val: null | number = null
  //     const task = Task.encaseIO(() => {
  //       val = testVal
  //     })
  //     expect(val).toBe(null)
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       _x => {
  //         expect(val).toEqual(testVal)
  //         done()
  //       }
  //     )
  //   })
  // })

  // describe("The static fromPromise() method", () => {

  //   it("Should return a `Task` that rejects of the provided function that returns a `Promise` that rejects", done => {
  //     const task = Task.fromPromise(() => Promise.reject(testError))
  //     task.fork(
  //       e => {
  //         expect(e).toBeInstanceOf(Error)
  //         expect(e.message).toEqual(testError.message)
  //         done()
  //       },
  //       callbackThatShouldNotHappen
  //     )
  //   })

  //   it("Should return a `Task` that resolves of the provided function that returns a `Promise` that resolves", done => {
  //     const task = Task.fromPromise(() => Promise.resolve(testVal))
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       x => {
  //         expect(x).toEqual(testVal)
  //         done()
  //       }
  //     )
  //   })
  // })

  // describe("The static toPromise() method", () => {

  //   it("Should turn the provided `Task` that rejects into a `Promise` that rejects", done => {
  //     const task = new Task(
  //       (rej, _res) => {
  //         rej(testError)
  //       }
  //     )
  //     const promise = Task.toPromise(task)
  //     promise.catch(e => {
  //       expect(e).toBeInstanceOf(Error)
  //       expect(e.message).toEqual(testError.message)
  //       done()
  //     })
  //   })

  //   it("Should turn the provided `Task` that resolves into a `Promise` that resolves", done => {
  //     const task = new Task(
  //       (_rej, res) => {
  //         res(testVal)
  //       }
  //     )
  //     const promise = Task.toPromise(task)
  //     promise.then(x => {
  //       expect(x).toEqual(testVal)
  //       done()
  //     })
  //   })
  // })

  // describe("The static fromNode() method", () => {

  //   it("Should turn the provided node callback function into a `Task` of the function", done => {
  //     const testJson = { this: "is", a: "test" }
  //     writeFileSync("test.json", JSON.stringify(testJson))
  //     const task = Task.fromNode<string>(fnDone => {
  //       readFile("test.json", { encoding: "utf-8" }, fnDone)
  //     })
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       x => {
  //         expect(JSON.parse(x)).toEqual(testJson)
  //         unlink("test.json", (_err) => {
  //           done()
  //         })
  //       }
  //     )
  //   })
  // })

  // describe("The static fromMaybe() method", () => {

  //   it("Should turn a `Maybe.Nothing` into a `Task` that rejects", done => {
  //     const maybe = Maybe.nothing()
  //     const task = Task.fromMaybe(maybe)
  //     task.fork(
  //       e => {
  //         expect(e).toBeInstanceOf(Error)
  //         done()
  //       },
  //       callbackThatShouldNotHappen
  //     )
  //   })

  //   it("Should turn a `Maybe.Just` into a `Task` that resolves", done => {
  //     const maybe = Maybe.just(testVal)
  //     const task = Task.fromMaybe(maybe)
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       x => {
  //         expect(x).toEqual(testVal)
  //         done()
  //       }
  //     )
  //   })
  // })

  // describe("The static fromResult() method", () => {

  //   it("Should turn a `Result.Err` into a `Task` that rejects", done => {
  //     const result = Result.err(testError)
  //     const task = Task.fromResult(result)
  //     task.fork(
  //       e => {
  //         expect(e).toBeInstanceOf(Error)
  //         expect(e.message).toEqual(testError.message)
  //         done()
  //       },
  //       callbackThatShouldNotHappen
  //     )
  //   })

  //   it("Should turn a `Result.Ok` into a `Task` that resolves", done => {
  //     const result = Result.ok(testVal)
  //     const task = Task.fromResult(result)
  //     task.fork(
  //       callbackThatShouldNotHappen,
  //       x => {
  //         expect(x).toEqual(testVal)
  //         done()
  //       }
  //     )
  //   })
  // })
})
