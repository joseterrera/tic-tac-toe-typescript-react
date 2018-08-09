import { curry, mapArray, sumArray, complement } from 'soultrain'

export const equals = curry(<A, B>(a: A, b: B): boolean => {
  const isA = (a, b): b is A => typeof a === typeof b
  return isA(a, b) && a === b
})
export const notEquals = curry(<A, B>(a: A, b: B): boolean => !equals(a,b))

export const equalsStrictType = curry(
  <A>(a: A, b: A): boolean => a === b
)
export const arrayValueEquals = curry(<A>(value: A, arr: A[]) : boolean[] =>
  arr.map(equalsStrictType(value))
)

export const contains = curry(<A>(value: A, arr:A[]):boolean => arr.indexOf(value) >= 0)
export const doesNotContain = curry(<A>(value: A, arr:A[]):boolean => contains(value,arr))


export const isAnyTrue = (arrayOfBooleans: boolean[]) : boolean =>
  arrayOfBooleans.reduce((acc, item) => acc || item, false) // false is neutral element

type FlattenArray<T> = T extends any[][] ? T[number] : T;

export const flattenArray = <A>(arr: A[]): FlattenArray<A[]>  =>
  arr.reduce((acc, item) => acc.concat(item ), [] as A[] ) as FlattenArray<A[]>

export const sumRows = mapArray(sumArray)

export const splitAt = <A>(num: number, arr: A[]): [A[],A[]] => [arr.slice(0,num),arr.slice(num,Infinity)]