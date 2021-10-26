import * as F from "fluture";

// Tasks

type Task<E extends Error, T> = F.FutureInstance<E, T>;

// TODO: finish once we've figured out Msg and Cmd
/** `perform : (a -> msg) -> Task Never a -> Cmd msg` */
export const perform = () => {};

/** `attempt : (Result x a -> msg) -> Task x a -> Cmd msg` */
export const attempt = () => {};

// Chains

/** `andThen : (a -> Task x b) -> Task x a -> Task x b` */
export const andThen =
  <T, E extends Error, U = T>(morphism: (x: T) => Task<E, U>) =>
  (task: Task<E, T>): Task<E, U> =>
    F.chain(morphism)(task);

/** `succeed : a -> Task x a` */
export const succeed = <T>(x: T): Task<never, T> =>
  F.resolve(x);

/** `fail : x -> Task x a` */
export const fail = <E extends Error>(e: E): Task<E, never> =>
  F.reject(e);

/** `sequence : List (Task x a) -> Task x (List a)` */
export const sequence = () => {};

// Maps

/** `map : (a -> b) -> Task x a -> Task x b` */
export const map =
  <T, U = T>(morphism: (x: T) => U) =>
  <E extends Error>(task: Task<E, T>): Task<E, U> =>
    F.map(morphism)(task);

/** `map2 : (a -> b -> result) -> Task x a -> Task x b -> Task x result` */
export const map2 =
  <E extends Error, A, B = A, C = A>(fn: (a: A) => (b: B) => C) =>
  (t1: Task<E, A>) =>
  (t2: Task<E, B>): Task<E, C> =>
    andThen<A, E, C>(
      a => map<B, C>(
        b => fn(a)(b)
      )(t2)
    )(t1);

/** `map3 : (a -> b -> c -> result) -> Task x a -> Task x b -> Task x c -> Task x result` */
export const map3 =
  <E extends Error, A, B = A, C = A, D = A>(fn: (a: A) => (b: B) => (c: C) => D) =>
  (t1: Task<E, A>) =>
  (t2: Task<E, B>) =>
  (t3: Task<E, C>): Task<E, D> =>
    andThen<A, E, D>(
      a => andThen<B, E, D>(
        b => map<C, D>(
          c => fn(a)(b)(c)
        )(t3)
      )(t2)
    )(t1);

/** `map4 :
    (a -> b -> c -> d -> result)
    -> Task x a
    -> Task x b
    -> Task x c
    -> Task x d
    -> Task x result` */
export const map4 =
  <Er extends Error, A, B = A, C = A, D = A, E = A>(fn: (a: A) => (b: B) => (c: C) => (d: D) => E) =>
  (t1: Task<Er, A>) =>
  (t2: Task<Er, B>) =>
  (t3: Task<Er, C>) =>
  (t4: Task<Er, D>): Task<Er, E> =>
    andThen<A, Er, E>(
      a => andThen<B, Er, E>(
        b => andThen<C, Er, E>(
          c => map<D, E>(
            d => fn(a)(b)(c)(d)
          )(t4)
        )(t3)
      )(t2)
    )(t1);

/** `map5 :
    (a -> b -> c -> d -> e -> result)
    -> Task x a
    -> Task x b
    -> Task x c
    -> Task x d
    -> Task x e
    -> Task x result` */
export const map5 =
  <Er extends Error, A, B = A, C = A, D = A, E = A, F = A>(fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
  (t1: Task<Er, A>) =>
  (t2: Task<Er, B>) =>
  (t3: Task<Er, C>) =>
  (t4: Task<Er, D>) => 
  (t5: Task<Er, E>): Task<Er, F> =>
    andThen<A, Er, F>(
      a => andThen<B, Er, F>(
        b => andThen<C, Er, F>(
          c => andThen<D, Er, F>(
            d => map<E, F>(
              e => fn(a)(b)(c)(d)(e)
            )(t5)
          )(t4)
        )(t3)
      )(t2)
    )(t1);

// Errors

/** `onError : (x -> Task y a) -> Task x a -> Task y a` */
export const onError =
  <T, E extends Error>(onErr: (e: E) => Task<E, T>) =>
  (task: Task<E, T>): Task<E, T> =>
    F.chain((x: Task<E, T>): Task<E,T> => x)(F.coalesce(onErr)(_x => task)(task))

/** `mapError : (x -> y) -> Task x a -> Task y a` */
export const mapError =
  <E extends Error, Y extends Error = E>(morphism: (e: E) => Y) =>
  (task: Task<E, never>): Task<Y, never> =>
    F.mapRej(morphism)(task);
