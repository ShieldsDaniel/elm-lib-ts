export type Tuple<F, S> = [F, S];

/** `pair : a -> b -> ( a, b )` */
export const pair = <T>(x: T) => <U>(y: U): Tuple<T, U> => [x, y]

/** `first : ( a, b ) -> a` */
export const first = <T>(tuple: Tuple<T, unknown>): T => tuple[0]

/** `second : ( a, b ) -> b` */
export const second = <U>(tuple: Tuple<unknown, U>): U => tuple[1]

/** `mapFirst : (a -> x) -> ( a, b ) -> ( x, b )` */
export const mapFirst =
  <T, U = T>(morphism: (x: T) => U) =>
  <V>(tuple: Tuple<T, V>): Tuple<U, V> =>
      [morphism (tuple[0]), tuple[1]]

/** `mapSecond : (b -> y) -> ( a, b ) -> ( a, y )` */
export const mapSecond =
  <T, U = T>(morphism: (x: T) => U) =>
  <V>(tuple: Tuple<V, T>): Tuple<V, U> =>
      [tuple[0], morphism (tuple[1])]

/** `mapBoth : (a -> x) -> (b -> y) -> ( a, b ) -> ( x, y )` */
export const mapBoth =
  <T, X = T>(morphism1: (x: T) => X) =>
  <U, Y = U>(morphism2: (x: U) => Y) =>
      (tuple: Tuple<T, U>): Tuple<X, Y> =>
        [morphism1 (tuple[0]), morphism2 (tuple[1])]
