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
 * DESCRIPTION
 * ============================================
 * Custom function to calculate option pricing based on American Option 
 * Black Scholes model. 
 * 
 *
 * 
 * LEGEND
 * ============================================
 * S  -> Price of the underlying stock
 * K  -> Option strike price
 * r  -> risk free interest rate (30 day t-bill)
 * iv -> implied volatility
 * dY -> divident yield
 * t  -> time to expiration (maturity date, annualized)
 * N  -> standard normal cumulative distribution function
 * 
 * 
 * 
 * NOTES
 * ============================================
 * Yahoo Option API: https://query2.finance.yahoo.com/v7/finance/options/amd
 * returns JSON
 * 
 * TODO: It seems that my rate is incorrect. It should be compounded over the year, not just taken the rate. 
 *
 *
 *
 * VERSIONS
 * ============================================
 *
 * 0.3.2
 * 0.3.1 Consolidated CALL options and return into a single call.
 *       Return is formated to display in a column. 
 *       TODO: Check how to return rows.
 * 0.3.0 Aggegated code to be more DRY (still needs work).
 * 0.2.1 To account for American options, divYield had to be added. 
 *       Accoring to TOS, the Greeks are displaying correctly (or very close).
 * 0.2.0 Implemented basic Black Scholes formula.
 * 0.1.0 Project setup.
 *
 *
 *
 * REFERENCE, NOTES, & RESEARCH
 * ============================================
 * This paper updated the BSM to handle openended American options & divident paying stocks/etfs.
 * http://www.people.hbs.edu/rmerton/theory%20of%20rational%20option%20pricing.pdf
 *
 * 
 * EXCEL implementation of BSM. Used as starting point. Careful when reading as
 * this is "pure" Black-Scholes and does not account for Yield.
 * https://excelatfinance.com/xlf17/xlf-black-scholes-google-sheets.php
 */



/*********************************************************
 *                                                       *
 *                       CODE BELOW                      *
 *       ALL FUNCTIONS SHOULD BE PREFIXED WITH `BSF_`    *
 *                                                       *
 *********************************************************/


// Derivatives & Probability Formulas
// ============================================


/**
 * Approximation of the cumulative Normal distribution,
 * which is provides an "good enough" approximation.
 *
 * @param {number} 
 */ 
function BSF_NormSDist(x) {
 
  // constants
  var a = 0.2316419;
  var a1 =  0.31938153;
  var a2 = -0.356563782;
  var a3 =  1.781477937;
  var a4 = -1.821255978;
  var a5 =  1.330274429;
 
  if(x < 0.0){
    return 1 - BSF_NormSDist(-x);
  } else {
    var k = 1.0 / (1.0 + a * x);
  }    

  return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));
}


/** 
 * d1 is first derivative of the option's price in relation to the underlying
 *
 * Formula:
 * ln(price/strike) + (rate + (sigma^2/2)) * time
 * ----------------------------------------------
 *             sigma * sqrt(time)
 * 
 * 
 */
function BSF_d1(S, K, t, r, iv, dY){
  return (Math.log(S / K) + (r - dY + (Math.pow(iv, 2)) / 2) * t) / (iv * Math.sqrt(t));
}


/**
 * FORMULA:
 * d1 - (sigma * sqrt(time))
 */
function BSF_d2(d1, iv, t){
  return d1 - iv * Math.sqrt(t);
}


/**
 * PHI(d1) is the probability density function of the normal distribution.
 * In the code, I use ND1 instead of PHI because its a reserved name.
 *
 * e^(-(D1^2)/2)
 * -------------
 *  sqrt(2*PI)
 *
 */
function BSF_nd1(d1){
  var _d1 = Math.pow(d1, 2);
  return Math.exp(-(_d1) / 2) / (Math.sqrt(2 * Math.PI))
}


/**
 * Implied Volatility of a Call Option
 * PLACEHOLDER 
 */
function callIV(S, K, t, r, target, div){
  var high = 5, low = 0;
  
  do {
    
  } while( high - low > 0.0001 );
  
  return (high + low) / 2;
}


// Pricing and the Greeks
// ============================================


/**
 * The accuracy of this function depends on volatility by way of nsd variables.
 * I should see how to pull IV from an API/scraping to reduce entry within the actual sheet.
 *
 */
function BSF_PRICE(position, nsd_d1, nsd_d2, price, strike, time, rate, dY){  
  return position === "call"
    ? Math.exp(-dY * time) * price * nsd_d1 - strike * Math.exp(-rate * time) * nsd_d2
    : Math.exp(-rate * time) * strike * (1-nsd_d2) - price * Math.exp(-dY * time) * (1-nsd_d1);
}


function BSF_THETA(position, nd1, nsd_d2, price, strike, time, rate, iv){  
  return position === "call" 
    ? (-price * iv * nd1 / (2 * Math.sqrt(time)) - rate * strike * Math.exp(-rate * time) * nsd_d2) / 365
    : (-price * iv * nd1 / (2 * Math.sqrt(time)) + rate * strike * Math.exp(-rate * time) * (1-nsd_d2)) / 365;
}


function BSF_RHO(position, nsd_d2, strike, time, rate){  
  return position === "call" 
    ? 0.01 * strike * time * Math.exp(-rate * time) * nsd_d2
    : -0.01 * strike * time * Math.exp(-rate * time) * (1-nsd_d2);
}


function BSF_GAMMA(nd1, price, iv, time){
  return nd1 / (price * iv * Math.sqrt(time));
}


function BSF_VEGA(nd1, price, time){
  return 0.01 * price * Math.sqrt(time) * nd1;
}


/**
 * Consolidating all call option related logic
 *
 * @param {number} current price of underlying
 * @param {number} strike price
 * @param {number} time until maturity, anualized
 * @param {number} 1 month interest rate
 * @param {number} implied volatility
 * @param {number} divident yield, annualized. Sraped from FinViz.
 *
 * @return {array} array of values to populate
 */
function BSF_CALL(S, K, t, r, iv, dY){  
  var optionChain = [[],[]];
  var d1, d2, nd1, nsd_d1, nsd_d2;

  // centralized derivatives to prevent 100000 useless calls.
  d1 = BSF_d1(S, K, t, r, iv, dY);
  d2 = BSF_d2(d1, iv, t);
  nd1 = BSF_nd1(d1);
  
  // Normal Distribution is overly complicated when done in JS since there
  // are no build in function for them AND they could be done in Sheets.
  // Delta is the same thing as normal distribution of `d1`
  nsd_d1 = BSF_NormSDist(d1);
  nsd_d2 = BSF_NormSDist(d2);
  
  // the 2d array is necessary to return values in rows.
  optionChain[0][0] = BSF_PRICE("call", nsd_d1, nsd_d2, S, K, t, r, dY);
  optionChain[0][1] = nsd_d1;
  optionChain[0][2] = BSF_GAMMA(nd1, S, iv, t);
  optionChain[0][3] = BSF_THETA("call", nd1, nsd_d2, S, K, t, r, iv);
  optionChain[0][4] = BSF_VEGA(nd1, S, t);
  optionChain[0][5] = BSF_RHO("call", nsd_d2, K, t, r);
 
  optionChain[1][0] = BSF_PRICE("put", nsd_d1, nsd_d2, S, K, t, r, dY);
  optionChain[1][1] = nsd_d1-1;
  optionChain[1][2] = BSF_GAMMA(nd1, S, iv, t);
  optionChain[1][3] = BSF_THETA("put", nd1, nsd_d2, S, K, t, r, iv);
  optionChain[1][4] = BSF_VEGA(nd1, S, t);
  optionChain[1][5] = BSF_RHO("put", nsd_d2, K, t, r);
  
  return optionChain;
}