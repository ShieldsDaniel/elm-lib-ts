import * as Result from "./Result";
import assert from "assert";
import { pipe } from "./utils";

const deepStrictEqual = (actual: any, expected: any) => {
  try {
    assert.deepStrictEqual(actual, expected);
    return true;
  } catch {
    return false
  }
};

const testVal = 3;
const testError = new Error("test");
const f = (x: number) => x * 2;
const g = (x: number) => x + 1;
const h = (x: number) => Result.Ok(x * 2);
const i = (x: number) => Result.Ok(x + 1);
const id = <T>(x: T): T => x;

describe("The Result Monad", () => {

  describe("The Functor laws (map, fmap)", () => {

    it("Should preserve the 1st Functor law: Functors must preserve identity morphisms `fmap id = id`", () => {
      const result = Result.Ok(testVal);
      const mapped = Result.map(id)(result);
      expect(deepStrictEqual(result, mapped)).toBe(true);
    });
    
    it("Should preserve the 2nd Functor law: Functors preserve composition of morphisms `fmap (f . g) == fmap f . fmap g`", () => {
      const composition = (x: number) => g(f(x));
      const result = Result.Ok(testVal);
      const mapComps = Result.map(composition)(result);
      const compMaps = pipe(
        result,
        Result.map(f),
        Result.map(g)
      );
      expect(deepStrictEqual(mapComps, compMaps)).toBe(true);
    });
  });

  describe("The Monadic laws (andThen, flatMap, bind, chain)", () => {

    it("Should preserve the 1st Monadic law: Left Identity `return a >>= h == h a`", () => {
      const chained = pipe(
        Result.Ok(testVal),
        Result.andThen(h),
      );
      const hResult = h(testVal);
      expect(deepStrictEqual(chained, hResult)).toBe(true);
    });

    it("Should preserve the 2nd Monadic law: Right Identity `m >>= return == m`", () => {
      const result = Result.Ok(testVal);
      const chained = Result.andThen(Result.Ok)(result);
      expect(deepStrictEqual(chained, result)).toBe(true);
    });

    it("Should preserve the 3rd Monadic law: Associativity `(m >>= g) >>= h == m >>= (\\x -> g x >>= h)`", () => {
      const result = Result.Ok(testVal);
      const assoc1 = pipe(
        result,
        Result.andThen(h),
        Result.andThen(i),
      );
      const assoc2 = pipe(
        result,
        Result.andThen(
          (x) => Result.andThen(i)(h(x))
        ),
      );
      expect(deepStrictEqual(assoc1, assoc2)).toBe(true);
    });
  });

  describe("The map4 function", () => {
    const morphism = (a: number) => (b: number) => (c: number) => (d: string) => a + b + c + d.length;

    it("Should short circuit and return an `Err` if any of the provided `Result`s are an `Err`", () => {
      const result1 = Result.Ok(1);
      const result2 = Result.Ok(2);
      const result3 = Result.Err(testError);
      const result4 = Result.Ok("four");
      const result = Result.map4(morphism)(result1)(result2)(result3)(result4);
      expect(deepStrictEqual(result, Result.Err(testError))).toBe(true);
    });

    it("Should apply the values of all provided `Result`s to the provided morphism function if all are `Ok`s", () => {
      const result1 = Result.Ok(1);
      const result2 = Result.Ok(2);
      const result3 = Result.Ok(3);
      const result4 = Result.Ok("four");
      const result = Result.map4(morphism)(result1)(result2)(result3)(result4);
      expect(deepStrictEqual(result, Result.Ok(10))).toBe(true);
    });
  });

  describe("The caseOf() function", () => {

    it("Should apply the provided `Error -> a` function if the `Result` is a `Err`", () => {
      const result = Result.Err(testError);
      const lazy = jest.fn(() => testVal);
      const actualVal = Result.caseOf(lazy, id)(result);
      expect(lazy).toHaveBeenCalledTimes(1);
      expect(actualVal).toEqual(testVal);
    });

    it("Should apply the provided morphism `a -> b` function to the value inside of the `Result`, if it is a `Ok a`", () => {
      const result = Result.Ok(1);
      const lazyMorphism = jest.fn((x) => testVal);
      const actualVal = Result.caseOf(() => 0, lazyMorphism)(result);
      expect(lazyMorphism).toHaveBeenCalledTimes(1);
      expect(actualVal).toEqual(testVal);
    });
  });
});
