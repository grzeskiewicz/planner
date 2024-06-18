
function checkSumPesel(digits) {
    const digit11 = digits[10];
    digits.pop();
  
    const times = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const reducer = (accumulator, currentValue, index) => accumulator + (currentValue * times[index]);
  
    let sum = digits.reduce(reducer);
  
    sum %= 10;
    sum = 10 - sum;
    sum %= 10;
  
    if (sum === digit11) {
      return true;
    } else {
      return false;
    }
  }
 function peselToDigits(value) { return value.split("").map(item => parseInt(item));}
  
 export function validatePESEL(value) {
    const digits = peselToDigits(value);
  
    if (digits.length !== 11 && digits.every(item => !isNaN(item))) {
      return false;
    }
  
    return checkSumPesel(digits);
  }

 export function validateNIP(nip) {
    if (typeof nip === "number") {
        nip = nip.toString();
    } else {
        nip = nip.replace(/-/g, "");
    }

    if (nip.length !== 10) {
        return false;
    }

    const nipArray= nip.split("").map(value => parseInt(value));
    const checkSum = (6 * nipArray[0] + 5 * nipArray[1] + 7 * nipArray[2] + 2 * nipArray[3] + 3 * nipArray[4] + 4 * nipArray[5] + 5 * nipArray[6] + 6 * nipArray[7] + 7 * nipArray[8])%11;
    return nipArray[9] === checkSum;
}


export function validateREGON(regon) {
  if (typeof regon === "number") {
      regon = regon.toString();
  } else {
      regon = regon.replace(/-/g, "");
  }

  if (regon.length !== 9) {
      return false;
  }

  const regonArray= regon.split("").map(value => parseInt(value));
  let checkSum = (8 * regonArray[0] + 9 * regonArray[1] + 2 * regonArray[2] + 3 * regonArray[3] + 4 * regonArray[4] + 5 * regonArray[5] + 6 * regonArray[6] + 7 * regonArray[7])%11;
  if (checkSum === 10) {
      checkSum = 0;
  }
  return regonArray[8] === checkSum;
}
