import * as O from "fp-ts/lib/Option"

// Definition

export type Nothing = O.None
export type Just<T> = O.Some<T>

export type Maybe<T> = Nothing | Just<T>

/** `Nothing : Maybe Never` */
export const Nothing: Maybe<never> = O.none

/** `Just : a -> Maybe a` */
export const Just = <T>(value: T): Maybe<T> =>
  O.some (value)

// Common Helpers

/** `withDefault : a -> Maybe a -> a` */
export const withDefault =
  <T>(defaultVal: T) =>
    (m: Maybe<T>): T =>
      O.getOrElse (() => defaultVal) (m)

/** `map : (a -> b) -> Maybe a -> Maybe b` */
export const map =
  <A, B = A>(fn: (a: A) => B) =>
    (m: Maybe<A>): Maybe<B> =>
      O.map (fn) (m)

/** `map2 : (a -> b -> value) -> Maybe a -> Maybe b -> Maybe value` */
export const map2 =
  <A, B = A, C = A>(fn: (a: A) => (b: B) => C) =>
    (m1: Maybe<A>) =>
      (m2: Maybe<B>): Maybe<C> =>
        andThen<A, C> (
          a => map<B, C> (
            b => fn (a) (b)
          ) (m2)
        ) (m1)

// `map3 :
//     (a -> b -> c -> value)
//     -> Maybe a
//     -> Maybe b
//     -> Maybe c
//     -> Maybe value`
export const map3 =
  <A, B = A, C = A, D = A>(fn: (a: A) => (b: B) => (c: C) => D) =>
    (m1: Maybe<A>) =>
      (m2: Maybe<B>) =>
        (m3: Maybe<C>): Maybe<D> =>
          andThen<A, D> (
            a => andThen<B, D> (
              b => map<C, D> (
                c => fn (a) (b) (c)
              ) (m3)
            ) (m2)
          ) (m1)

// `map4 :
//     (a -> b -> c -> d -> value)
//     -> Maybe a
//     -> Maybe b
//     -> Maybe c
//     -> Maybe d
//     -> Maybe value`
export const map4 =
  <
    A,
    B = A,
    C = A,
    D = A,
    E = A
  >(fn: (a: A) => (b: B) => (c: C) => (d: D) => E) =>
    (m1: Maybe<A>) =>
      (m2: Maybe<B>) =>
        (m3: Maybe<C>) =>
          (m4: Maybe<D>): Maybe<E> =>
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
//    -> Maybe a
//    -> Maybe b
//    -> Maybe c
//    -> Maybe d
//    -> Maybe e
//    -> Maybe value`
export const map5 =
  <
    A,
    B = A,
    C = A,
    D = A,
    E = A,
    F = A
  >(fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
    (m1: Maybe<A>) =>
      (m2: Maybe<B>) =>
        (m3: Maybe<C>) =>
          (m4: Maybe<D>) =>
            (m5: Maybe<E>): Maybe<F> =>
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

/** `fold: (() -> b) -> (a -> b) -> Maybe a -> b` */
export const fold =
  <A, B = A>(onNothing: () => B, onJust: (x: A) => B) =>
    (m: Maybe<A>): B =>
      O.fold (
        onNothing,
        onJust
      ) (m)

// Chaining Maybes

/** `andThen : (a -> Maybe b) -> Maybe a -> Maybe b` */
export const andThen =
  <T, U = T>(fn: (x: T) => Maybe<U>) =>
    (m: Maybe<T>): Maybe<U> =>
      O.chain (fn) (m)

// TODO: add `sequence`

export const isJust = <T>(m: Maybe<T>): boolean => O.isSome (m)

export const isNothing = <T>(m: Maybe<T>): boolean => O.isNone (m)
