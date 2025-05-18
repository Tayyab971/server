function isPalindrome(str) {
    const reversedStr = str.split('').reverse().join('');
    return str === reversedStr;
}


function swapNumbers(a, b) {
    a = a + b; // Step 1: a now contains the sum of a and b
    b = a - b; // Step 2: b now contains the original value of a
    a = a - b; // Step 3: a now contains the original value of b
    return { a, b };
}


const swapped = swapNumbers(5, 10)

