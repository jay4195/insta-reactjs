
 export function RoundNumber(number)  {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1000000) {
        let round = Math.trunc(number / 1000);
        let decimal = Math.trunc(number / 100);
        decimal = decimal % 10;
        if (decimal !== 0) {
            return round + '.' + decimal + 'k';
        } else {
            return round + 'k';
        }
    } else {
        let round = Math.trunc(number / 1000000);
        let decimal = Math.trunc(number / 100000);
        decimal = decimal % 10;
        if (decimal !== 0) {
            return round + '.' + decimal + 'M';
        } else {
            return round + 'M';
        }
    }
}