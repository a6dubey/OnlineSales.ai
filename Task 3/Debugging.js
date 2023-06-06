function computeValue(n) {
    if (n < 10) {
      return n * n;
    } else if (n >= 10 && n <= 20) {
      let factorial = 1;
      for (let i = 1; i <= (n - 10); i++) {
        factorial *= i;
      }
      return factorial;
    } else {
      let sum = 0;
      for (let i = 1; i <= (n - 20); i++) {
        sum += i;
      }
      return sum;
    }
  }
  
  // Example usage:
  console.log(computeValue(4)); // Output: 16
  console.log(computeValue(15)); // Output: 120
  console.log(computeValue(25)); // Output: 15
  