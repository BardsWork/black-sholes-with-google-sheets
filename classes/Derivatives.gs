/**
 * Params Class holds the parameters supplied from the shiet and encapsulates the
 * basic math into easy to access functions.
 */
class Params {
  constructor(price, strike, time, rate, iv, divYield){
    this.price = price;
    this.strike = strike;
    this.time = time;
    this.rate = rate;
    this.iv = iv;
    this.divYield = divYield;
  }

  /**
   * 
   * d1 is first derivative of the option's price in relation to the underlying.
   *
   * Formula:
   * ln(price/strike) + (rate + (sigma^2/2)) * time
   * ----------------------------------------------
   *             sigma * sqrt(time)
   * 
   * @returns {float}
   */
  calculateD1(){
    return (Math.log(this.price / this.strike) + (this.rate - this.divYield + (Math.pow(this.iv, 2)) / 2) * this.time) / (this.iv * Math.sqrt(this.time));
  }

  /**
   * FORMULA:
   * d1 - (sigma * sqrt(time))
   * 
   * @param d1
   * @param iv
   * @param time
   * @returns {float}
   */
  calculateD2(d1, iv, time){
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
   * @returns {float}
   */
  calculateND1(){
    const d1 = this.calculateD1;
    const d1_sq = Math.pow(d1, 2);

    return Math.exp(-(d1_sq) / 2) / (Math.sqrt(2 * Math.PI))
  }


}