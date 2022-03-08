/**
 * Params Class holds the parameters supplied from the shiet and encapsulates the
 * basic math into easy to access functions.
 */
 class Greeks {
  constructor(derivClass){
    this.Derivatives = derivClass;
    this.d1 = this.Derivatives.calculateD1();
    this.d2 = this.Derivatives.calculateD2();
    this.normDistD1 = this.Derivatives.calculateND1();
  }

  theta(type="Call"){
    let _theta;

    if( type === "CALL" ){
      _theta = (-this.Derivatives.price * this.Derivatives.iv * this.normDistD1 / (2 * Math.sqrt(this.Derivatives.time)) 
               - this.Derivatives.rate * this.Derivatives.strike * Math.exp(-this.Derivatives.rate * this.Derivatives.time) * nsd_d2) / 365;
    } else {
      _theta = (-price * iv * nd1 / (2 * Math.sqrt(time)) + rate * strike * Math.exp(-rate * time) * (1-nsd_d2)) / 365;
    }

    return _theta;
  }


}