/**
 * Formats numbers as currencies
 * @param {Number} value - The value to be formatted
 * @returns {String} - String that contains the formatted value
 */

const currencyFormatter = (value: number)=>{
    return new Intl.NumberFormat().format(value);
}

export {currencyFormatter}