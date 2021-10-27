import assert from "assert"
import * as Maybe from "./Maybe"
import {pipe} from "./utils"

const deepStrictEqual = (actual: any, expected: any) => {
  try {
    assert.deepStrictEqual (actual, expected)
    return true
  } catch {
    return false
  }
}

const testVal = 3
const f = (x: number) => x * 2
const g = (x: number) => x + 1
const h = (x: number) => Maybe.Just (x * 2)
const i = (x: number) => Maybe.Just (x + 1)
const id = <T>(x: T): T => x

describe ("The Maybe Monad", () => {

  describe ("The Functor laws (map, fmap)", () => {

    it ("Should preserve the 1st Functor law: Functors must preserve identity morphisms `fmap id = id`", () => {
      const maybe = Maybe.Just (testVal)
      const mapped = Maybe.map (id) (maybe)
      expect (deepStrictEqual (maybe, mapped)).toBe (true)
    })

    it ("Should preserve the 2nd Functor law: Functors preserve composition of morphisms `fmap (f . g) == fmap f . fmap g`", () => {
      const composition = (x: number) => g (f (x))
      const maybe = Maybe.Just (testVal)
      const mapComps = Maybe.map (composition) (maybe)
      const compMaps = pipe (
        maybe,
        Maybe.map (f),
        Maybe.map (g)
      )
      expect (deepStrictEqual (mapComps, compMaps)).toBe (true)
    })
  })

  describe ("The Monadic laws (andThen, flatMap, bind, chain)", () => {

    it ("Should preserve the 1st Monadic law: Left Identity `return a >>= h == h a`", () => {
      const chained = pipe (
        Maybe.Just (testVal),
        Maybe.andThen (h)
      )
      const hResult = h (testVal)
      expect (deepStrictEqual (chained, hResult)).toBe (true)
    })

    it ("Should preserve the 2nd Monadic law: Right Identity `m >>= return == m`", () => {
      const maybe = Maybe.Just (testVal)
      const chained = Maybe.andThen (Maybe.Just) (maybe)
      expect (deepStrictEqual (chained, maybe)).toBe (true)
    })

    it ("Should preserve the 3rd Monadic law: Associativity `(m >>= g) >>= h == m >>= (\\x -> g x >>= h)`", () => {
      const maybe = Maybe.Just (testVal)
      const assoc1 = pipe (
        maybe,
        Maybe.andThen (h),
        Maybe.andThen (i)
      )
      const assoc2 = pipe (
        maybe,
        Maybe.andThen (
          x => Maybe.andThen (i) (h (x))
        )
      )
      expect (deepStrictEqual (assoc1, assoc2)).toBe (true)
    })
  })

  describe ("The map4 function", () => {
    const morphism = (a: number) => (b: number) => (c: number) => (d: string) => a + b + c + d.length

    it ("Should short circuit and return an `Nothing` if any of the provided `Result`s are an `Nothing`", () => {
      const maybe1 = Maybe.Just (1)
      const maybe2 = Maybe.Just (2)
      const maybe3 = Maybe.Nothing
      const maybe4 = Maybe.Just ("four")
      const result = Maybe.map4 (morphism) (maybe1) (maybe2) (maybe3) (maybe4)
      expect (deepStrictEqual (result, Maybe.Nothing)).toBe (true)
    })

    it ("Should apply the values of all provided `Result`s to the provided morphism function if all are `Just`s", () => {
      const maybe1 = Maybe.Just (1)
      const maybe2 = Maybe.Just (2)
      const maybe3 = Maybe.Just (3)
      const maybe4 = Maybe.Just ("four")
      const result = Maybe.map4 (morphism) (maybe1) (maybe2) (maybe3) (maybe4)
      expect (deepStrictEqual (result, Maybe.Just (10))).toBe (true)
    })
  })

  describe ("The caseOf() method", () => {

    it ("Should apply the provided lazy `() -> a` function if the `Maybe` is a `Nothing`", () => {
      const maybe = Maybe.Nothing
      const lazy = jest.fn (() => testVal)
      const actualVal = Maybe.fold (lazy, id) (maybe)
      expect (lazy).toHaveBeenCalledTimes (1)
      expect (actualVal).toEqual (testVal)
    })

    it ("Should apply the provided morphism `a -> b` function to the value inside of the `Maybe`, if it is a `Just a`", () => {
      const maybe = Maybe.Just (1)
      const lazyMorphism = jest.fn (x => testVal)
      const actualVal = Maybe.fold (() => 0, lazyMorphism) (maybe)
      expect (lazyMorphism).toHaveBeenCalledTimes (1)
      expect (actualVal).toEqual (testVal)
    })
  })
})
