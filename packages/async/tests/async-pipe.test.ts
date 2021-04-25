import {asyncPipe, TRAP, onError} from '../src/async-pipe'

const delay = <T>(ms: number, result: T) => new Promise<T>(done =>
  setTimeout(() => done(result), ms)
)

test(`asyncPipe plain functions`, async () => {
  const calculate = asyncPipe(
    (x: number) => x + 1,
    (x) => x * 2,
  )
  const result = await calculate(2)
  expect(result).toBe(6)
})

test(`asyncPipe async functions`, async () => {
  const calculate = asyncPipe(
    (x: number) => x + 1,
    (x) => delay(10, `${x}`),
    (x) => parseInt(x, 10) * 2,
  )
  const result = await calculate(2)
  expect(result).toBe(6)
})

test(`asyncPipe onError`, async () => {
  const result = onError(() => `Error`)
  expect(typeof result).toBe(`function`)
  expect(result.type).toBe(TRAP)
  expect(result()).toBe(`Error`)
})

test(`asyncPipe error trap`, async () => {
  let mutable = 0
  const calculate = asyncPipe(
    () => delay(10, 0),
    () => {
      throw new Error(`An Error`)
    },
    () => (mutable = 10),
    onError(() => mutable ++)
  )
  await calculate(2)
  expect(mutable).toBe(1)
})
