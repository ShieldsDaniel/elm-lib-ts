import * as List from "./List";
import assert from "assert";
import { pipe } from "./utils";
import * as Maybe from "./Maybe";
import * as Tuple from "./Tuple";
import { isNone, isSome } from "fp-ts/lib/Option";

const deepStrictEqual = (actual: any, expected: any) => {
  try {
    assert.deepStrictEqual(actual, expected);
    return true;
  } catch {
    return false
  }
};

const testVal = [3, 4, 5];
const f = (x: number) => x * 2;
const g = (x: number) => x + 1;
const id = <T>(x: T): T => x;

describe("The List Monad", () => {

  describe("The Functor laws (map, fmap)", () => {

    it("Should preserve the 1st Functor law: Functors must preserve identity morphisms `fmap id = id`", () => {
      const list = testVal;
      const mapped = List.map(id)(list);
      expect(deepStrictEqual(list, mapped)).toBe(true);
    });
    
    it("Should preserve the 2nd Functor law: Functors preserve composition of morphisms `fmap (f . g) == fmap f . fmap g`", () => {
      const composition = (x: number) => g(f(x));
      const list = testVal;
      const mapComps = List.map(composition)(list);
      const compMaps = pipe(
        list,
        List.map(f),
        List.map(g),
      );
      expect(deepStrictEqual(mapComps, compMaps)).toBe(true);
    });
  });

  describe("The singleton() function", () => {

    it("Should return a list with the single provided element", () => {
      const list = List.singleton(testVal[0]);
      expect(list).toHaveLength(1);
      expect(list[0]).toEqual(testVal[0]);
    });
  });

  describe("The repeat() function", () => {

    it("Should create an empty list if a negative number is provided as the repeat times", () => {
      const list = List.repeat(-2)(true);
      expect(list).toHaveLength(0);
    });

    it("Should create a list of the provided length filled with the provided value", () => {
      const testDataAndResults = [
        { num: 3, val: "x" },
        { num: 29, val: 12 },
        { num: 2, val: true },
        { num: 0, val: "..." },
      ];
      for(const data of testDataAndResults) {
        const list = List.repeat(data.num)(data.val);
        expect(list).toHaveLength(data.num);
        list.forEach(x => expect(x).toEqual(data.val));
      }
    });
  });

  describe("The range() function", () => {

    it("Should return an empty `List` if the end of the range is less than the start value", () => {
      const list = List.range(6)(2);
      expect(list).toHaveLength(0);
    });

    it("Should return a `List` of the range (end value inclusive)", () => {
      const list1 = List.range(2)(6);
      const list2 = List.range(-2)(6);
      expect(list1).toHaveLength(5);
      expect(list1).toEqual([2, 3, 4, 5, 6]);
      expect(list2).toHaveLength(9);
      expect(list2).toEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe("The prepend() function", () => {

    it("Should return a `List` of just the provided value, if an empty array was provided", () => {
      const list = List.prepend(6)([]);
      expect(list).toHaveLength(1);
      expect(list).toEqual([6]);
    });

    it("Should return a `List` that is the provided `List` prepended with the provided value", () => {
      const list = List.prepend(1)([2, 3, 4]);
      expect(list).toHaveLength(4);
      expect(list).toEqual([1, 2, 3, 4]);
    });
  });

  describe("The indexedMap() function", () => {

    it("Should work like map but with the index of each item", () => {
      const list = [true, false, false, false];
      const result = List.indexedMap((i: number) => (_x: boolean): number => i)(list);
      expect(result).toHaveLength(4);
      expect(result).toEqual([0, 1, 2, 3])
    });
  });

  describe("The fold() functions", () => {
    const list = [{ val: 20 }, { val: 2 }, { val: 10 }];
    const sub = (y: { val: number}) => (x: number): number => x - y.val;

    it("Should reduce the provided `List` into another type", () => {
      const result = List.foldl(sub)(list[0].val)(list.slice(1));
      expect(result).toEqual(8);
    });

    it("Should reduce the provided `List` into another type", () => {
      const result = List.foldr(sub)(list[2].val)(list.slice(0, 2));
      expect(result).toEqual(-12);
    });
  });

  describe("The filter() function", () => {

    it("Should filter a `List` based on provided predicate", () => {
      const list = [1, 2, 3, 4, 5, 6, 7];
      const predicate = (x: number): boolean => x > 3;
      const result = List.filter(predicate)(list);
      expect(result).toHaveLength(4);
      expect(result).toEqual([4, 5, 6, 7]);
    });
  });

  describe("The filterMap() function", () => {

    it("Should map over a `List` of values using a function that can return a `Maybe` and then filters out all `Nothing`s", () => {
      const list = ["3", "hi", "12", "4th", "May"];
      const toInt = (x: string) => {
        const parsed = +x;
        if (isNaN(parsed)) {
          return Maybe.Nothing;
        }
        return Maybe.Just(parsed);
      };
      const result = List.filterMap(toInt)(list);
      expect(result).toHaveLength(2);
      expect(result).toEqual([3, 12]);
    });
  });

  describe("The maximum() function", () => {

    it("Should return a `Maybe.Nothing` if an empty `List` is provided", () => {
      expect(isNone(List.maximum([]))).toBe(true);
    });

    it("Should return a `Maybe.Nothing` if a `List` of non-Comparable elements are provided", () => {
      expect(
        isNone(List.maximum([
          { blah: "blah", hi: "there" },
          { blah: "blah", hi: "there" }
        ]))
      ).toBe(true);
    })

    it("Should return a `Maybe.Just` of the max value of a `List` of numbers", () => {
      const list = [3, 6, 2, 5, 1, 4];
      const max = List.maximum(list);
      expect(isSome(max)).toBe(true);
      expect(Maybe.withDefault(0)(max)).toEqual(6)
    });

    it("Should return a `Maybe.Just` of the max value of a `List` of strings", () => {
      const list = ["a", "list", "of", "str"];
      const max = List.maximum(list);
      expect(isSome(max)).toBe(true);
      expect(Maybe.withDefault("")(max)).toEqual("str");
    });
  });

  describe("The minimum() function", () => {

    it("Should return a `Maybe.Nothing` if an empty `List` is provided", () => {
      expect(isNone(List.minimum([]))).toBe(true);
    });

    it("Should return a `Maybe.Nothing` if a `List` of non-Comparable elements are provided", () => {
      expect(
        isNone(List.minimum([
          { blah: "blah", hi: "there" },
          { blah: "blah", hi: "there" }
        ]))
      ).toBe(true);
    })

    it("Should return a `Maybe.Just` of the max value of a `List` of numbers", () => {
      const list = [3, 6, 2, 5, 1, 4];
      const max = List.minimum(list);
      expect(isSome(max)).toBe(true);
      expect(Maybe.withDefault(0)(max)).toEqual(1)
    });

    it("Should return a `Maybe.Just` of the max value of a `List` of strings", () => {
      const list = ["a", "another", "list", "of", "str"];
      const max = List.minimum(list);
      expect(isSome(max)).toBe(true);
      expect(Maybe.withDefault("")(max)).toEqual("a");
    });
  });

  describe("The concat() function", () => {

    it("Should return an empty `List` if and empty `List` was provided", () => {
      expect(List.concat([])).toHaveLength(0);
    });

    it("Should flatten a `List` of `List`s", () => {
      const lists = [[1, 2], [3, 4, 5]];
      const flattened = List.concat(lists);
      expect(flattened).toHaveLength(5);
      expect(flattened).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("The concatMap() function", () => {
    const morphism = (x: number) => [x * 2, x * 3];

    it("Should return an empty `List` if and empty `List` was provided", () => {
      expect(List.concatMap(morphism)([])).toHaveLength(0);
    });

    it("Should flatten a `List` of `List`s", () => {
      const lists = [1, 2, 3, 4];
      const flattened = List.concatMap(morphism)(lists);
      expect(flattened).toHaveLength(8);
      expect(flattened).toEqual([2, 3, 4, 6, 6, 9, 8, 12]);
    });
  });

  describe("The intersperse() function", () => {

    it("Should return the unaltered `List` if the provided `List` is empty or only has one element", () => {
      const empty = List.empty;
      const single = List.singleton("turtles");
      expect(List.intersperse("on")(empty)).toEqual(empty);
      expect(List.intersperse("on")(single)).toEqual(single);
    });

    it("Should return a `List` with the provided value in between each element of the original `List`", () => {
      const list = List.repeat(3)("turtles");
      const result = List.intersperse("on")(list);
      expect(result).toHaveLength(List.length(list) + List.length(list) - 1);
      expect(result).toEqual(["turtles", "on", "turtles", "on", "turtles"]);
    });
  });

  describe("The map3() function", () => {
    const morphism = (a: number) => (b: number) => (c: string): number => a + b + c.length;

    it("Should apply the values of all provided `Result`s to the provided morphism function if all are `Ok`s", () => {
      const list1 = [1, 2];
      const list2 = [3, 4];
      const list3 = ["five", "six"];
      const result = List.map3(morphism)(list1)(list2)(list3);
      expect(result).toHaveLength(2);
      expect(result).toEqual([8, 9]);
    });
  });

  describe("The head() function", () => {

    it("Should return a `Maybe.Nothing` if the provided `List` is empty", () => {
      const emptyHead = List.head([]);
      expect(isNone(emptyHead)).toBe(true);
    });

    it("Should return a `Maybe.Just` of the first element of the provided `List` if not empty", () => {
      const list = [3, 2, 1, 4, 5];
      const head = List.head(list);
      expect(isSome(head)).toBe(true);
      expect(Maybe.withDefault(0)(head)).toEqual(list[0]);
    });
  });

  describe("The tail() function", () => {

    it("Should return a `Maybe.Nothing` if the provided `List` is empty", () => {
      const emptyTail = List.tail([]);
      expect(isNone(emptyTail)).toBe(true);
    });

    it("Should return a `Maybe.Just` of an empty list if the provided `List` only had a single element", () => {
      const singleTail = List.tail(List.singleton(5));
      expect(isSome(singleTail)).toBe(true);
      expect(Maybe.withDefault([2])(singleTail)).toEqual([]);
    });

    it("Should return a `Maybe.Just` of the first element of the provided `List` if not empty", () => {
      const list = [3, 2, 1, 4, 5];
      const tail = List.tail(list);
      expect(isSome(tail)).toBe(true);
      expect(Maybe.withDefault([3])(tail)).toEqual(list.slice(1));
    });
  });

  describe("The partition() function", () => {

    it("Should return a `Tuple` of 2 empty `List`s if an empty `List` is provided", () => {
      const partitioned = List.partition((x: number) => x < 3)([] as number[]);
      expect(Tuple.first(partitioned)).toEqual([]);
      expect(Tuple.second(partitioned)).toEqual([]);
    });

    it("Should return a `Tuple` of the values that passed the predicate and one of the values that did not", () => {
      const list = [0, 1, 2, 3, 4, 5];
      const partitioned = List.partition((x: number) => x < 3)(list);
      expect(Tuple.first(partitioned)).toEqual([0, 1, 2]);
      expect(Tuple.second(partitioned)).toEqual([3, 4, 5]);
    });
  });

  describe("The unzip() function", () => {
    
    it("Should unzip a `List` of `Tuple`s into a `Tuple` of `Lists`", () => {
      const list: List.List<Tuple.Tuple<number, boolean>> = [[0, true], [17, false], [1337, true]];
      const unzipped = List.unzip(list);
      expect(Tuple.first(unzipped)).toEqual([0, 17, 1337]);
      expect(Tuple.second(unzipped)).toEqual([true, false, true]);
    })
  });

  /* TODO: to test
   * sort functions
   * - 
   * initialize
   * get and set
   */
});
