
// Tasks

type Task<E extends Error, T> = {};

/** `perform : (a -> msg) -> Task Never a -> Cmd msg` */
export const perform = () => {};

/** `attempt : (Result x a -> msg) -> Task x a -> Cmd msg` */
export const attempt = () => {};

// Chains

/** `andThen : (a -> Task x b) -> Task x a -> Task x b` */
export const andThen = () => {};

/** `succeed : a -> Task x a` */
export const succeed = () => {};

/** `fail : x -> Task x a` */
export const fail = () => {};

/** `sequence : List (Task x a) -> Task x (List a)` */
export const sequence = () => {};

// Maps

/** `map : (a -> b) -> Task x a -> Task x b` */
export const map = () => {};

/** `map2 : (a -> b -> result) -> Task x a -> Task x b -> Task x result` */
export const map2 = () => {};

/** `map3 : (a -> b -> c -> result) -> Task x a -> Task x b -> Task x c -> Task x result` */
export const map3 = () => {};

/** `map4 :
    (a -> b -> c -> d -> result)
    -> Task x a
    -> Task x b
    -> Task x c
    -> Task x d
    -> Task x result` */
export const map4 = () => {};

/** `map5 :
    (a -> b -> c -> d -> e -> result)
    -> Task x a
    -> Task x b
    -> Task x c
    -> Task x d
    -> Task x e
    -> Task x result` */
export const map5 = () => {};

// Errors

/** `onError : (x -> Task y a) -> Task x a -> Task y a` */
const onError = () => {};

/** `mapError : (x -> y) -> Task x a -> Task y a` */
const mapError = () => {};
