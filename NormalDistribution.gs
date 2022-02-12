/**
 * Normal distribution class.
 * This class was adopted from SO questions, linked below.
 * The code belongs to the original author, General Grievance.
 * 
 * The code for Cumulative distribution function was adpoted from FSU,
 * originaly written by David Hill and adopted by John Burkardt.
 * 
 * The code was released under GNU LGPL license and linked below.
 * 
 * Question:
 * @link https://stackoverflow.com/questions/66228783/google-sheets-normdist-x-mean-standard-deviation-cumulative-t-f-to-javascri
 * 
 * Author:
 * @link https://stackoverflow.com/users/4294399/general-grievance
 * 
 * Original:
 * @link https://people.sc.fsu.edu/~jburkardt/c_src/asa066/alnorm.c
 */
class NormalDistribution{
  constructor(){}

  /**
   * 
   * @param x 
   * @param mean 
   * @param stdev 
   * @returns 
   */
  _getNDistPDF(x, mean, stdev) {
    const sqrt2PI = Math.SQRT2 * Math.sqrt(Math.PI);
    let frac = (x - mean) / stdev;

    return Math.exp(-.5 * frac * frac) / (sqrt2PI * stdev);
  }

  /**
   * 
   * @param x 
   * @param mean 
   * @param stdev 
   * @returns 
   */
  _getNDistCDF(x, mean, stdev){
    const a1 = 5.75885480458;
    const a2 = 2.62433121679;
    const a3 = 5.92885724438;
    const b1 = -29.8213557807;
    const b2 = 48.6959930692;
    const c1 = -0.000000038052;
    const c2 = 0.000398064794;
    const c3 = -0.151679116635;
    const c4 = 4.8385912808;
    const c5 = 0.742380924027;
    const c6 = 3.99019417011;
    const con = 1.28;
    const d1 = 1.00000615302;
    const d2 = 1.98615381364;
    const d3 = 5.29330324926;
    const d4 = -15.1508972451;
    const d5 = 30.789933034;
    const ltone = 7.0;
    const p = 0.398942280444;
    const q = 0.39990348504;
    const r = 0.398942280385;
    const utzero = 18.66;
  
    let up = false;
    let value;
    let y;
  
    // For non-standard NDist
    let z = (x - mean) / stdev;
  
    if (z < 0)
    {
      up = true;
      z = -z;
    }
  
    if (ltone < z && (!up || utzero < z))
    {
      value = !up * 1;
      return value;
    }
  
    y = 0.5 * z * z;
  
    if (z <= con)
    {
      value = 0.5 - z * (p - q * y 
        / (y + a1 + b1 
          / (y + a2 + b2 
            / (y + a3))));
    }
    else
    {
      value = r * Math.exp(-y) 
        / (z + c1 + d1 
          / (z + c2 + d2 
            / (z + c3 + d3 
              / (z + c4 + d4 
                / (z + c5 + d5 
                  / (z + c6))))));
    }
  
    if (!up)
      value = 1 - value;
  
    return value;
  }


  /**
   * 
   * @param x 
   * @param mean 
   * @param stdev 
   * @param cumulative 
   * @returns 
   */
  NDistJS(x, mean, stdev, cumulative) {
    return cumulative 
        ? this._getNDistCDF(x, mean, stdev)
        : this._getNDistPDF(x, mean, stdev);
  }
}

