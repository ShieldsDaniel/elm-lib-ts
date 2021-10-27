import * as E from "fp-ts/lib/Either"
import * as Maybe from "./Maybe"

// Definition

type Err<E extends Error> = E.Left<E>
type Ok<T> = E.Right<T>

export type Result<E extends Error, T> = Err<E> | Ok<T>;

/** `Nothing : x -> Result x Never` */
export const Err =
  <E extends Error>(error: E): Result<E, never> => E.left (error)

/** `Just : a -> Result x a` */
export const Ok = <T>(value: T): Result<never, T> =>
  E.right (value)

// Mapping

/** `map : (a -> b) -> Result x a -> Result x b` */
export const map =
  <A, B = A>(fn: (a: A) => B) =>
    (m: Result<Error, A>): Result<Error, B> =>
      E.map (fn) (m)

/** `map2 : (a -> b -> value) -> Result x a -> Result x b -> Result x value` */
export const map2 =
  <A, B = A, C = A>(fn: (a: A) => (b: B) => C) =>
    (m1: Result<Error, A>) =>
      (m2: Result<Error, B>): Result<Error, C> =>
        andThen<A, C> (
          a => map<B, C> (
            b => fn (a) (b)
          ) (m2)
        ) (m1)

// `map3 :
//     (a -> b -> c -> value)
//     -> Result x a
//     -> Result x b
//     -> Result x c
//     -> Result x value`
export const map3 =
  <A, B = A, C = A, D = A>(fn: (a: A) => (b: B) => (c: C) => D) =>
    (m1: Result<Error, A>) =>
      (m2: Result<Error, B>) =>
        (m3: Result<Error, C>): Result<Error, D> =>
          andThen<A, D> (
            a => andThen<B, D> (
              b => map<C, D> (
                c => fn (a) (b) (c)
              ) (m3)
            ) (m2)
          ) (m1)

// `map4 :
//     (a -> b -> c -> d -> value)
//     -> Result x a
//     -> Result x b
//     -> Result x c
//     -> Result x d
//     -> Result x value`
export const map4 =
  <
    A,
    B = A,
    C = A,
    D = A,
    E = A
  >(fn: (a: A) => (b: B) => (c: C) => (d: D) => E) =>
    (m1: Result<Error, A>) =>
      (m2: Result<Error, B>) =>
        (m3: Result<Error, C>) =>
          (m4: Result<Error, D>): Result<Error, E> =>
            andThen<A, E> (
              a => andThen<B, E> (
                b => andThen<C, E> (
                  c => map<D, E> (
                    d => fn (a) (b) (c) (d)
                  ) (m4)
                ) (m3)
              ) (m2)
            ) (m1)

// `map5 :
//    (a -> b -> c -> d -> e -> value)
//    -> Result x a
//    -> Result x b
//    -> Result x c
//    -> Result x d
//    -> Result x e
//    -> Result x value`
export const map5 =
  <
    A,
    B = A,
    C = A,
    D = A,
    E = A,
    F = A
  >(fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
    (m1: Result<Error, A>) =>
      (m2: Result<Error, B>) =>
        (m3: Result<Error, C>) =>
          (m4: Result<Error, D>) =>
            (m5: Result<Error, E>): Result<Error, F> =>
              andThen<A, F> (
                a => andThen<B, F> (
                  b => andThen<C, F> (
                    c => andThen<D, F> (
                      d => map<E, F> (
                        e => fn (a) (b) (c) (d) (e)
                      ) (m5)
                    ) (m4)
                  ) (m3)
                ) (m2)
              ) (m1)

/** `fold: (() -> b) -> (a -> b) -> Result x a -> b` */
export const fold =
  <E extends Error, A, B = A>(onErr: (e: E) => B, onOk: (x: A) => B) =>
    (m: Result<E, A>): B =>
      E.fold (
        onErr,
        onOk
      ) (m)

// Chaining Results

/** `andThen : (a -> Result x b) -> Result x a -> Result x b` */
export const andThen =
  <T, U = T>(fn: (x: T) => Result<Error, U>) =>
    (m: Result<Error, T>): Result<Error, U> =>
      E.chain (fn) (m)

// Handling Errors

/** `withDefault : a -> Result x a -> a` */
export const withDefault =
  <T>(defaultVal: T) =>
    (m: Result<Error, T>): T =>
      E.getOrElse (() => defaultVal) (m)

/** `toMaybe : Result x a -> Maybe a` */
export const toMaybe =
  <E extends Error, A>(r: Result<E, A>): Maybe.Maybe<A> =>
    fold<E, A, Maybe.Maybe<A>> (
      _e => Maybe.Nothing,
      x => Maybe.Just (x)
    ) (r)

/** `fromMaybe: x -> Maybe a -> Result x a` */
export const fromMaybe =
  <E extends Error, A>(error: E) =>
    (m: Maybe.Maybe<A>): Result<E, A> =>
      Maybe.fold<A, Result<E, A>> (
        () => Err (error),
        x => Ok (x)
      ) (m)

/** `mapError : (x -> y) -> Result x a -> Result y a` */
export const mapError =
  <T, E extends Error, Y extends Error = E>(fn: (x: E) => Y) =>
    (r: Result<E, T>): Result<Y, T> =>
      E.mapLeft (fn) (r)
