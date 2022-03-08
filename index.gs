/**
 *
 * BLACK SCHOLES AMERICAN OPTION PRICING README
 * ============================================
 * 
 * File:    Black-Scholes-Model.gs
 * Author:  Alex Bard
 * Updated: 6/21/2019
 * Version: 0.3
 * License: MIT
 * 
 *
 *
 *
 * VERSIONS
 * ============================================
 *
 * 0.4   WIP - branching classes 
 * 0.3.4 Updated documentation for functions.
 * 0.3.3 Moved all classes to their own folder. Needs to be it's own branch.
 * 0.3.2 Updated private/public functions for redability
 * 0.3.1 Consolidated CALL options and return into a single call.
 *       Return is formated to display in a column. 
 * 0.3.0 Aggegated code to be more DRY (still needs work).
 * 0.2.1 To account for American options, divYield had to be added. 
 *       Accoring to TOS, the Greeks are displaying correctly (or very close).
 * 0.2.0 Implemented basic Black Scholes formula.
 * 0.1.0 Project setup.
 */


// DERIVATIVES 
// ============================================


/**
 * Approximation of the cumulative Normal distribution,
 * which is provides an "good enough" approximation.
 * 
 * Checkout this link for a better implementation (2/7/22):
 * https://stackoverflow.com/questions/66228783/google-sheets-normdist-x-mean-standard-deviation-cumulative-t-f-to-javascri
 * 
 *
 * @param {number} 
 */
function _normDistFunc(x) {

  // constants
  var a = 0.2316419;
  var a1 = 0.31938153;
  var a2 = -0.356563782;
  var a3 = 1.781477937;
  var a4 = -1.821255978;
  var a5 = 1.330274429;

  if (x < 0.0) {
    return 1 - _normDistFunc(-x);
  } else {
    var k = 1.0 / (1.0 + a * x);
  }

  return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));
}


/**
 * 
 * d1 is first derivative of the option's price in relation to the underlying
 *
 * Formula:
 * ln(price/strike) + (rate + (sigma^2/2)) * time
 * ----------------------------------------------
 *             sigma * sqrt(time)
 * 
 * @param price     {float} current price of underlying
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @param iv        {float} implied volatility
 * @param divYield  {float} divident yield, annualized. Sraped from FinViz.
 * @returns {float}
 */
function _calcuatD1(price, strike, time, rate, iv, divYield) {
  return (Math.log(price / strike) + (rate - divYield + (Math.pow(iv, 2)) / 2) * time) / (iv * Math.sqrt(time));
}


/**
 * FORMULA:
 * d1 - (sigma * sqrt(time))
 * 
 * @param d1        {float}
 * @param iv        {float} implied volatility
 * @param time      {float} time until maturity, anualized
 * @returns {float}
 */
function _calculateD2(d1, iv, time) {
  return d1 - iv * Math.sqrt(time);
}


/**
 * Probability density function of the normal distribution.
 *
 * FORMULA:
 * e^(-(D1^2)/2)
 * -------------
 *  sqrt(2*PI)
 *
 * @param d1 {float}
 * @returns {float}
 */
function _calculateND1(d1) {
  var _d1 = Math.pow(d1, 2);
  return Math.exp(-(_d1) / 2) / (Math.sqrt(2 * Math.PI))
}


// PRICE 
// ============================================


/**
 * The accuracy of this function depends on volatility by way of nsd variables.
 * I should see how to pull IV from an API/scraping to reduce entry within the actual sheet.
 * 
 * @param type      {string}  CALL | PUT
 * @param nsd_d1    {float}
 * @param nsd_d2    {float}
 * @param price     {float} current price of underlying
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @param divYield  {float} divident yield, annualized. Sraped from FinViz.
 * @returns {float}
 */
function _calculatePrice(type = "CALL", nsd_d1, nsd_d2, price, strike, time, rate, divYield) {
  var _price;

  if (type === "CALL") {
    _price = Math.exp(-divYield * time) * price * nsd_d1 - strike * Math.exp(-rate * time) * nsd_d2;
  } else {
    _price = Math.exp(-rate * time) * strike * (1 - nsd_d2) - price * Math.exp(-divYield * time) * (1 - nsd_d1);
  }

  return _price;
}


// GREEKS CALCULATIONS
// ============================================


/**
 * 
 * @param type      {bool}  CALL | PUT
 * @param nd1       {float}
 * @param nsd_d2    {float}
 * @param price     {float} current price of underlying
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @param iv        {float} implied volatility
 * @returns {float}
 */
function _calcTheta(type = "CALL", nd1, nsd_d2, price, strike, time, rate, iv) {
  var _theta;

  if (type === "CALL") {
    _theta = (-price * iv * nd1 / (2 * Math.sqrt(time)) - rate * strike * Math.exp(-rate * time) * nsd_d2) / 365;
  } else {
    _theta = (-price * iv * nd1 / (2 * Math.sqrt(time)) + rate * strike * Math.exp(-rate * time) * (1 - nsd_d2)) / 365;
  }

  return _theta;
}

/**
 * 
 * @param type      {bool}  CALL | PUT
 * @param nsd_d2    {float}
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @returns {float}
 */
function _calcRho(type = "CALL", nsd_d2, strike, time, rate) {
  var _rho;

  if (type === "CALL") {
    _rho = 0.01 * strike * time * Math.exp(-rate * time) * nsd_d2;
  } else {
    _rho = -0.01 * strike * time * Math.exp(-rate * time) * (1 - nsd_d2);
  }

  return _rho;
}

/**
 * 
 * @param nd1 
 * @param price     {float} current price of underlying
 * @param iv        {float} implied volatility
 * @param time      {float} time until maturity, anualized
 * @returns 
 */
function _calcGamma(nd1, price, iv, time) {
  return nd1 / (price * iv * Math.sqrt(time));
}

/**
 * Calculate Vega or how implied volatility affects the pricing of the option.
 * Since iVol is indiscriminate for direction, there is no difference in 
 * calculating a call or a put.
 * 
 * @param nd1       {float} optional: when calling from QUOTE, we can supply 
 *                          nd1, instead of re-calculating it.
 * @param price     {float} current price of underlying
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @param iv        {float} implied volatility
 * @param divYield  {float} divident yield, annualized. Sraped from FinViz.
 * 
 * @returns {float}
 */
function _calcVega(nd1 = 0, price, strike, time, rate, iv, divYield) {

  if (nd1 === 0) {
    // d1 is index 0
    d1 = _calcuatD1(price, strike, time, rate, iv, divYield);
    nd1 = _calculateND1(d1);
  }

  return 0.01 * price * Math.sqrt(time) * nd1;
}


/**
 * Consolidated full quote for price and greeks for both, calls and puts.
 * Function will return a 2D array of values, that fill up 2 rows and 6 columns.
 * 
 * Example Return:
 *  CALL PRICE | DELTA | GAMMA | THETA | VEGA | RHO
 *  PUT PRICE  | DELTA | GAMMA | THETA | VEGA | RHO
 * 
 * @param userInput {object}  User input values from sheet
 * @param derivs    {object}  Calculated derivates
 * @returns 
 */
function _fullQuote(userInput, derivs) {
  const optionChain = [[], []];

  // Vega and Gama are not sensative to directional distribution and calculated once.
  const _gamma = BSF_GAMMA(derivs.nd1, userInput.price, userInput.iv, userInput.time);
  const _vega = BSF_VEGA(derivs.nd1, userInput.price, userInput.time);

  // CALL SIDE
  optionChain[0][0] = _calculatePrice(
    "CALL", derivs.nsd_d1, derivs.nsd_d2,
    userInput.price, userInput.strike, userInput.time,
    userInput.rate, userInput.divYield
  );

  // Another way to represent delta is the normal distribution expected value.
  optionChain[0][1] = derivs.nsd_d1;
  optionChain[0][2] = _gamma;
  optionChain[0][3] = BSF_THETA(
    "CALL", derivs.nd1, derivs.nsd_d2,
    userInput.price, userInput.strike, userInput.time,
    userInput.rate, userInput.iv
  );
  optionChain[0][4] = _vega;
  optionChain[0][5] = BSF_RHO(
    "CALL", derivs.nsd_d2,
    userInput.strike, userInput.time, userInput.rate
  );



  // PUT SIDE
  optionChain[1][0] = _calculatePrice(
    "PUT", derivs.nsd_d1, derivs.nsd_d2,
    userInput.price, userInput.strike, userInput.time,
    userInput.rate, userInput.divYield
  );

  // Another way to represent delta is the normal distribution expected value.
  optionChain[1][1] = derivs.nsd_d1 - 1;
  optionChain[1][2] = _gamma;
  optionChain[1][3] = BSF_THETA(
    "PUT", derivs.nd1, derivs.nsd_d2,
    userInput.price, userInput.strike, userInput.time,
    userInput.rate, userInput.iv
  );
  optionChain[1][4] = _vega;
  optionChain[1][5] = BSF_RHO(
    "PUT", derivs.nsd_d2,
    userInput.strike, userInput.time, userInput.rate
  );

  return optionChain;
}


/**
 * Consolidated full quote for price and greeks for both, calls and puts.
 * Function will return a 2D array of values, that fill up 2 rows and 6 columns.
 * 
 * Example Return:
 *  CALL PRICE | DELTA | GAMMA | THETA | VEGA | RHO
 *  PUT PRICE  | DELTA | GAMMA | THETA | VEGA | RHO
 *
 * @param price     {float} current price of underlying
 * @param strike    {float} strike price
 * @param time      {float} time until maturity, anualized
 * @param rate      {float} 1 month interest rate
 * @param iv        {float} implied volatility
 * @param divYield  {float} divident yield, annualized. Sraped from FinViz.
 * @param quote     {string | optional} default full quote. All greeks names and "price" options.
 * @param type      {bool | optional}  CALL | PUT
 *
 * @return {array} array of values to populate
 */
function BSM_QUOTE(price, strike, time, rate, iv, divYield, quote = "", type = "CALL") {
  // just in case...
  quote = type.toUpperCase();

  const _userInput = {
    price: price,
    striek: strike,
    time: time,
    rate: rate,
    iv: iv,
    divYield: divYield,
    type: type.toUpperCase(),
  };
  const _derivatives = {
    d1: 0,
    d2: 0,
    nd1: 0,
    nsd_d1: 0,
    nsd_d2: 0,
  }

  // calculate derivatives and normal distribution.
  _derivatives.d1 = _calcuatD1(price, strike, time, rate, iv, divYield);
  _derivatives.d2 = _calculateD2(_derivatives.d1, iv, time);
  _derivatives.nd1 = _calculateND1(_derivatives.d1);
  _derivatives.nsd_d1 = _normDistFunc(_derivatives.d1);
  _derivatives.nsd_d2 = _normDistFunc(_derivatives.d2);

  // compute 
  switch (quote) {
    case 'PRICE':
      return _calculatePrice(
        type,
        _derivatives.nsd_d1,
        _derivatives.nsd_d2,
        price,
        strike,
        time,
        rate,
        divYield
      );
    case 'DELTA':
      return type === "CALL" ? derivs.nsd_d1 : derivs.nsd_d1 - 1;

    case 'THETA':
      return BSF_THETA(type, derivs.nd1, derivs.nsd_d2, price, strike, time, rate, iv);

    case 'GAMMA':
      return BSF_GAMMA(derivs.nd1, price, iv, time);

    case 'VEGA':
      return BSF_VEGA(derivs.nd1, price, time);

    case 'RHO':
      return BSF_RHO(type, nsd_d2, strike, time, rate);

    default:
      return _fullQuote(_userInput, _derivatives);
  }
}