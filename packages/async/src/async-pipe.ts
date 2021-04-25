import * as R from 'ramda'

type F<T, U> = (p: T) => U | Promise<U>

/* eslint-disable max-len */
export type AsyncPipe = {
  <T1, T2>(f1: F<T1, T2>): (data: T1) => Promise<T2>
  <T1, T2, T3>(f1: F<T1, T2>, f2: F<T2, T3>): (data: T1) => Promise<T3>
  <T1, T2, T3, T4>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>): (data: T1) => Promise<T4>
  <T1, T2, T3, T4, T5>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>): (data: T1) => Promise<T5>
  <T1, T2, T3, T4, T5, T6>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>): (data: T1) => Promise<T6>
  <T1, T2, T3, T4, T5, T6, T7>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>, f6: F<T6, T7>): (data: T1) => Promise<T7>
  <T1, T2, T3, T4, T5, T6, T7, T8>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>, f6: F<T6, T7>, f7: F<T7, T8>): (data: T1) => Promise<T8>
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>, f6: F<T6, T7>, f7: F<T7, T8>, f8: F<T8, T9>): (data: T1) => Promise<T9>
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>, f6: F<T6, T7>, f7: F<T7, T8>, f8: F<T8, T9>, f9: F<T9, T10>): (data: T1) => Promise<T10>
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(f1: F<T1, T2>, f2: F<T2, T3>, f3: F<T3, T4>, f4: F<T4, T5>, f5: F<T5, T6>, f6: F<T6, T7>, f7: F<T7, T8>, f8: F<T8, T9>, f9: F<T9, T10>, f10: F<T10, T11>,): (data: T1) => Promise<T11>
}
/* eslint-enable max-len */

export const TRAP = Symbol(`TRAP`)

export const isErrorTrap = R.propEq(`type`, TRAP)

export const asyncPipe: AsyncPipe = (...fns: any[]) => (data: any) => {
  if (!fns.length) {
    throw new Error(`asyncPipe requires at least one argument`)
  }

  return fns.reduce(
    (promise, next) => isErrorTrap(next)
      ? promise.catch(next)
      : promise.then(next),
    Promise.resolve(data)
  )
}

export const onError = <T, U>(fn: F<T, U>) => {
  const trap = (value?: T) => fn(value)
  trap.type = TRAP
  return trap
}
