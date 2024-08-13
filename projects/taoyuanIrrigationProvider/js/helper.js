function padWithZero(num, targetLength) {
  return String(num).padStart(targetLength, '0');
}
function separateEnglishAndChinese(inputString) {
  const englishRegex = /[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/;///[a-zA-Z]/; // English letters
  const chineseRegex = /[\u4e00-\u9fa5]+/;///[\u4e00-\u9fa5]/; // Chinese characters range

  let englishChars = "";
  let chineseChars = "";

  let flag = '';
  let newStr = '';
  for (const char of inputString) {
    if (englishRegex.test(char)) {
      //englishChars += char;
      if(flag == 'C'){
        newStr += ' ';
      }
      
      flag = 'E';

    } else if (chineseRegex.test(char)) {
      //chineseChars += char;
      if(flag == 'E'){
        newStr += ' ';
      }

      flag = 'C'
    }
    newStr += char;
  }

  return newStr;
  // return {
  //   englishChars,
  //   chineseChars,
  // };
}

function detectInputLanguage(inputText) {
  // // Regular expressions to match English words, math operators, and numbers
  // const englishMathRegex = /^[\w\s+\-*/.()0-9]+$/;

  // // Regular expression to match Chinese characters
  // const chineseRegex = /^[\u4e00-\u9fa5]+$/;

  // if (englishMathRegex.test(inputText)) {
  //   return 'E';
  // } else if (chineseRegex.test(inputText)) {
  //   return 'C';
  // } else {
  //   return null;
  // }
    const englishPattern = /[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/;
    const chinesePattern = /[\u4e00-\u9fa5]+/;

    const containsEnglish = englishPattern.test(inputText);
    const containsChinese = chinesePattern.test(inputText);

    if (containsEnglish && containsChinese) {
      return 'Mixed';//"Mixed";
    } else if (containsEnglish) {
      return 'E';//"English";
    } else if (containsChinese) {
      return 'C';//"Chinese";
    } else {
      return null;//"Unknown";
    }
}
function countSpaces(str) {
  let spaceCount = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      spaceCount++;
    }
  }

  return spaceCount;
}

function ifInArray(arr, value) {
  let q = arr.filter((elemInside) => elemInside == value);
  return q.length > 0;
}
function ifOtherInArray(arr, value) {
  let q = arr.filter((elemInside) => elemInside != value);
  return q.length > 0;
}
function removeItem(arr, value) {
  let idx = arr.indexOf(value);
  console.log(idx);
  if (idx >= 0) {
    arr.splice(idx, 1);
    removeItem(arr, value);
  } else {
    return;
  }
  console.log(arr);
}


(function () {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function (value, exp) {
      return decimalAdjust("round", value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function (value, exp) {
      return decimalAdjust("floor", value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function (value, exp) {
      return decimalAdjust("ceil", value, exp);
    };
  }
})();

console.log('test here');
console.log(Math.round10(100.29, -1));

function uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}