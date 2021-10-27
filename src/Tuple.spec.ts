import * as Tuple from "./Tuple"

const val1 = "thing"
const val2 = 12
const boolToString = (x: boolean): string => x.toString ()
const intToString = (x: number): string => x.toString ()

describe ("The Tuple module", () => {

  describe ("The pair() function", () => {

    it ("Should create a new `Tuple` pair of the provided values", () => {
      const tuple = Tuple.pair (val1) (val2)
      expect (tuple).toHaveLength (2)
      expect (tuple[0]).toEqual (val1)
      expect (tuple[1]).toEqual (val2)
    })
  })

  describe ("The first() function", () => {

    it ("Should return the first value of the `Tuple`", () => {
      const tuple = Tuple.pair (val1) (val2)
      expect (Tuple.first (tuple)).toEqual (val1)
    })
  })

  describe ("The second() function", () => {

    it ("Should return the first value of the `Tuple`", () => {
      const tuple = Tuple.pair (val1) (val2)
      expect (Tuple.second (tuple)).toEqual (val2)
    })
  })

  describe ("The mapFirst() function", () => {

    it ("Should map the first value based on provided function", () => {
      const val1 = 12
      const tuple = Tuple.pair (val1) (val2)
      const mappedTuple = Tuple.mapFirst (intToString) (tuple)
      expect (typeof mappedTuple[0]).toEqual ("string")
      expect (mappedTuple[0]).toEqual (val1.toString ())
    })
  })

  describe ("The mapSecond() function", () => {

    it ("Should map the second value based on provided function", () => {
      const tuple = Tuple.pair (val1) (val2)
      const mappedTuple = Tuple.mapSecond (intToString) (tuple)
      expect (typeof mappedTuple[1]).toEqual ("string")
      expect (mappedTuple[1]).toEqual (val2.toString ())
    })
  })

  describe ("The mapBoth() function", () => {

    it ("Should map both values based on provided function", () => {
      const val1 = true
      const tuple = Tuple.pair (val1) (val2)
      const mappedTuple = Tuple.mapBoth (boolToString) (intToString) (tuple)
      expect (typeof mappedTuple[0]).toEqual ("string")
      expect (mappedTuple[0]).toEqual (val1.toString ())
      expect (typeof mappedTuple[1]).toEqual ("string")
      expect (mappedTuple[1]).toEqual (val2.toString ())
    })
  })
})
