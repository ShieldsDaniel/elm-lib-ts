import * as Maybe from "./Maybe";
import { isSome } from "fp-ts/lib/Option";
import { max, min, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import * as N from "fp-ts/lib/number";
import * as S from "fp-ts/lib/string";
import { pipe } from "./utils";
import * as Tuple from "./Tuple";

type Maybe<T> = Maybe.Maybe<T>;
type Tuple<T, U> = Tuple.Tuple<T, U>;

export type List<T> = Array<T>;

// Create

/** `singleton : a -> List a` */
export const singleton = <T>(x: T): List<T> => [x];

/** `repeat : Int -> a -> List a` */
export const repeat = (times: number) => <T>(x: T): List<T> => {
  try {
    return Array(times).fill(x);
  } catch {
    return [];
  }
};

/** `range : Int -> Int -> List Int` */
export const range =
  (start: number) =>
  (stop: number): List<number> => {
    try {
      return Array.from(
        { length: (stop - start)+ 1}, (_, i) => start + i
      );
    } catch {
      return [];
    }
  };

/** `prepend (::) : a -> List a -> List a` */
export const prepend = <T>(x: T) => (list: List<T>): List<T> =>
  [x, ...list];

// Transform

/** `map : (a -> b) -> List a -> List b` */
export const map =
  <T, U = T>(fn: (x: T) => U) => 
  (list: List<T>): List<U> =>
    list.map(fn);

/** `indexedMap : (Int -> a -> b) -> List a -> List b` */
export const indexedMap =
  <T, U = T>(indexedMorphism: (index: number) => (x: T) => U) =>
  (list: List<T>): List<U> =>
    list.map((x, index) => indexedMorphism(index)(x));

/** `foldl : (a -> b -> b) -> b -> List a -> b` */
export const foldl =
  <T, U>(reducer: (x: T) => (accum: U) => U) =>
  (initVal: U) =>
  (list: List<T>) =>
    list.reduce((accum, x) => reducer(x)(accum), initVal);

/** `foldr : (a -> b -> b) -> b -> List a -> b` */
export const foldr =
  <T, U>(reducer: (x: T) => (accum: U) => U) =>
  (initVal: U) =>
  (list: List<T>) =>
    list.reduceRight((accum, x) => reducer(x)(accum), initVal);

/** `filter : (a -> Bool) -> List a -> List a` */
export const filter =
  <T>(predicate: (x: T) => boolean) =>
  (list: List<T>) =>
    list.filter(predicate);

/** `filterMap : (a -> Maybe b) -> List a -> List b` */
export const filterMap =
  <T, U = T>(maybeMorphism: (x: T) => Maybe<U>) =>
  (list: List<T>): List<U> =>
    list
      .map(maybeMorphism)
      .filter(isSome)
      .map(x => x.value);

// Utilities

/** `length : List a -> Int` */
export const length = <T>(list: List<T>): number =>
  list.length;

/** `reverse : List a -> List a` */
export const reverse = <T>(list: List<T>): List<T> =>
  list.reverse();

/** `member : a -> List a -> Bool` */
export const member = <T>(x: T) => (list: List<T>) =>
  list.includes(x);

/** `all : (a -> Bool) -> List a -> Bool` */
export const all =
  <T>(predicate: (x: T) => boolean) =>
  (list: List<T>): boolean =>
    list.every(predicate);

/** `any : (a -> Bool) -> List a -> Bool` */
export const any =
  <T>(predicate: (x: T) => boolean) =>
  (list: List<T>): boolean =>
    list.some(predicate);

/** `maximum : List comparable -> Maybe comparable` */
export const maximum = <T>(list: List<T>): Maybe<T> => {
  if (length(list) > 0) {
    if (typeof list[0] === "string") {
      return Maybe.Just(
        max(S.Ord)(list as unknown as NonEmptyArray<string>)
      ) as Maybe<T>;
    } else if (typeof list[0] === "number") {
      return Maybe.Just(
        max(N.Ord)(list as unknown as NonEmptyArray<number>)
      ) as Maybe<T>;
    }
  }
  return Maybe.Nothing;
};

/** `minimum : List comparable -> Maybe comparable` */
export const minimum = <T>(list: List<T>): Maybe<T> => {
  if (length(list) > 0) {
    if (typeof list[0] === "string") {
      return Maybe.Just(
        min(S.Ord)(list as unknown as NonEmptyArray<string>)
      ) as Maybe<T>;
    } else if (typeof list[0] === "number") {
      return Maybe.Just(
        min(N.Ord)(list as unknown as NonEmptyArray<number>)
      ) as Maybe<T>;
    }
  }
  return Maybe.Nothing;
};

/** `sum : List number -> number` */
export const sum =
  (list: List<number>): number =>
    list.reduce((accum, x) => accum + x, 0);

/** `product : List number -> number` */
export const product =
  (list: List<number>): number =>
    list.reduce((accum, x) => accum * x, 0);

// Combine

/** `append : List a -> List a -> List a` */
export const append =
  <T>(list1: List<T>) =>
  (list2: List<T>): List<T> =>
    [...list1, ...list2];

/** `concat : List (List a) -> List a` */
export const concat = <T>(list: List<List<T>>): List<T> =>
  list.reduce((accum, x) => [...accum, ...x], []);

/** `concatMap : (a -> List b) -> List a -> List b` */
export const concatMap =
  <T, U = T>(morphism: (x: T) => List<U>) =>
  (list: List<T>): List<U> =>
    pipe(
      list,
      map(morphism),
      concat,
    );

/** `intersperse : a -> List a -> List a` */
export const intersperse =
  <T>(x: T) =>
  (list: List<T>): List<T> => {
    if (length(list) <= 2) {
      return list;
    }
    return list.slice(1).reduce(
      (accum, y) => [...accum, x, y], [list[0]] as List<T>
    );
  };

/** `map2 : (a -> b -> result) -> List a -> List b -> List result` */
export const map2 =
  <A, B = A, C = A>(morph: (a: A) => (b: B) => C) =>
  (list1: List<A>) =>
  (list2: List<B>): List<C> =>
    list1.map((x, i) => morph(x)(list2[i]));

/** `map3 : (a -> b -> c -> result) -> List a -> List b -> List c -> List result` */
export const map3 =
  <A, B = A, C = A, D = A>(
    morph: (a: A) => (b: B) => (c: C) => D
  ) =>
  (list1: List<A>) =>
  (list2: List<B>) =>
  (list3: List<C>): List<D> =>
    list1.map((x, i) => morph(x)(list2[i])(list3[i]));

/** `map4 :
      (a -> b -> c -> d -> result)
      -> List a
      -> List b
      -> List c
      -> List d
      -> List result` */
export const map4 =
  <A, B = A, C = A, D = A, E = A>(
    morph: (a: A) => (b: B) => (c: C) => (d: D) => E
  ) =>
  (list1: List<A>) =>
  (list2: List<B>) =>
  (list3: List<C>) =>
  (list4: List<D>): List<E> =>
    list1.map(
      (x, i) => morph(x)(list2[i])(list3[i])(list4[i])
    );

/** `map5 :
    (a -> b -> c -> d -> e -> result)
      -> List a
      -> List b
      -> List c
      -> List d
      -> List e
      -> List result` */
export const map5 =
  <A, B = A, C = A, D = A, E = A, F = A>(
    morph: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F
  ) =>
  (list1: List<A>) =>
  (list2: List<B>) =>
  (list3: List<C>) =>
  (list4: List<D>) =>
  (list5: List<E>): List<F> =>
    list1.map(
      (x, i) =>
        morph(x)(list2[i])(list3[i])(list4[i])(list5[i])
    );

// Sort

/** `sort : List comparable -> List comparable` */
export const sort = () => {};

/** `sortBy : (a -> comparable) -> List a -> List a` */
export const sortBy = () => {};

/** `sortWith : (a -> a -> Order) -> List a -> List a` */
export const sortWith = () => {};

// Deconstruct

/** `isEmpty : List a -> Bool` */
export const isEmpty = <T>(list: List<T>) =>
  length(list) === 0;

/** `head : List a -> Maybe a` */
export const head = <T>(list: List<T>): Maybe<T> =>
  length(list) < 1 ? Maybe.Nothing : Maybe.Just(list[0]);

/** `tail : List a -> Maybe (List a)` */
export const tail = <T>(list: List<T>): Maybe<List<T>> => {
  if (length(list) === 0){
    return Maybe.Nothing;
  } else if (length(list) === 1) {
    return Maybe.Just([]);
  }
  return Maybe.Just(list.slice(1));
}

/** `take : Int -> List a -> List a` */
export const take =
  (num: number) =>
  <T>(list: List<T>): List<T> =>
    list.slice(0, num);

/** `drop : Int -> List a -> List a` */
export const drop =
  (num: number) =>
  <T>(list: List<T>): List<T> =>
    list.slice(num);

/** `partition : (a -> Bool) -> List a -> ( List a, List a )` */
export const partition =
  <T>(predicate: (x: T) => boolean) =>
  (list: List<T>): Tuple<List<T>, List<T>> =>
    [
      filter(predicate)(list),
      filter((x: T) => !predicate(x))(list)
    ];

/** `unzip : List ( a, b ) -> ( List a, List b )` */
export const unzip =
  <T, U = T>(list: List<Tuple<T, U>>): Tuple<List<T>, List<U>> =>
    list.reduce(
      (accum, x) =>Tuple.pair
        ([...Tuple.first(accum), Tuple.first(x)])
        ([...Tuple.second(accum), Tuple.second(x)]),
      Tuple.pair([] as List<T>)([] as List<U>)
    );

// Array Functions

// Creation

/** `empty : Array a` */
export const empty: List<never> = [];

/** `initialize : Int -> (Int -> a) -> Array a` */
export const initialize =
  (len: number) =>
  <T>(morphism: (x: number) => T): List<T> =>
    pipe(
      repeat(len)(0),
      map(morphism)
    );

// Query

/** `get : Int -> Array a -> Maybe a` */
export const get =
  (index: number) =>
  <T>(list: List<T>): Maybe<T> => {
    const val = list[index];
    if (typeof val === "undefined") {
      return Maybe.Nothing;
    }
    return Maybe.Just(val);
  };

// Manipulate

/** `set : Int -> a -> Array a -> Array a` */
export const set =
  (index: number) =>
  <T>(x: T) =>
  (list: List<T>): List<T> =>
    indexedMap
      ((i: number) => (y: T): T => i === index ? x : y)
      (list);

/** `push : a -> Array a -> Array a` */
export const push = <T>(x: T) => (list: List<T>): List<T> =>
  [...list, x];

/** `slice : Int -> Int -> Array a -> Array a` */
export const slice =
  (start: number) => 
  (end: number) =>
  <T>(list: List<T>): List<T> =>
    list.slice(start, end);
