export function randomStr(len: number, arr: string) {
  let ans: string = "";
  for (let i = len; i > 0; i--) {
    ans +=
      arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
} 