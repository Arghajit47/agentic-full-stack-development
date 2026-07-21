export function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// random min to max number generator expect number x, return in int
export function randomNumberExpect(
  min: number,
  max: number,
  expect: number = 0
) {
  let randomNum = Math.floor(randomNumber(min, max));
  while (randomNum === expect) {
    randomNum = Math.floor(randomNumber(min, max));
  }
  return randomNum;
}