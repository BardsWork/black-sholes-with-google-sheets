<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/BardsWork/bsm-sheets">
    <img src="images/bsm-logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Get the Greeks in your Sheets!</h3>

  
[View Demo][demo-url] · [Report Bug][issues-url] · [Request a Feature][issues-url]

[Explore the docs »][docs-url]
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <ul>        
        <li><a href="#resources">Resources</a></li>
        <li><a href="#option-greeks">TL;DR Option Greek Definitions</a></li>
        <ul>
          <li><a href="#delta">Delta</a></li>
          <li><a href="#gamma">Gamma</a></li>
          <li><a href="#theta">Theta</a></li>
          <li><a href="#vega">Vega</a></li>
        </ul>
    </ul>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <ul>
          <li><a href="#file-description">File Description</a></li>
        </ul>
        <li><a href="#google-app-scripts-resources">Google App Scripts Resources</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

The inspiration for this App Scripts was my curiosity in simulating how changes in Greeks influence option pricing. While calculating BSM is fairly straight forward, I wanted to use custom functions for simplicity and to prevent convoluted formulas. BSM sheets creates Google Sheets functions to retrieve all standard option greeks and contract pricing. 

Some interesting things you can do:
1. Create a "profitability" matrix to see how the price of the underlying impacts the option price, through time.
2. How does increase in volatility, with no change in underlying price, impacts the option price, through time.
3. Generating matrices for different strikes to text theta/vega impact, from above.

Some things you _cannot_ do:
1. Generate alpha 

This is 100% an educational resource and you should not expect a way to generate any alpha. The calculations are "close enough" for general learning but are absolutely not sufficient to price risk in the market. 

<br>

<p align="right">(<a href="#top">back to top</a>)</p>

### Resources

All functions were written within Google App Scripts and have to be added manually to the desired sheet.
* [Google App Scripts](https://developers.google.com/apps-script)

The following papers were used to create the functions:
* [Theory of rational Option Pricing - Merton](http://www.people.hbs.edu/rmerton/theory%20of%20rational%20option%20pricing.pdf)

The following link helped in the original creation of the script:
* [Excel implementation of Black-Scholes](https://excelatfinance.com/xlf17/xlf-black-scholes-google-sheets.php)

If you need a general overview of option greeks:
* [CBOE - Learning the Greeks: An Expert's Perspective](https://www.cboe.com/insights/posts/learning-the-greeks-an-experts-perspective/#:~:text=What%20Are%20Option%20Greeks%3F,volatility%2C%20and%20even%20interest%20rates.)

<br>

### Option Greeks

This is a TL;DR version of the greeks. For a full description, please read the CBOE paper, above.

<br>

#### Delta
> Delta represents the relative increase in the price of an option, given an increase in the price of the underlying.

<br>

#### Gamma
> Gamma represents the change in Delta, given a change in the underlying price. 

<br>

#### Theta
> Theta is the change in option price, given a 1 day change in time.

 <br>

#### Vega
> Vega is the change in price of an option for a 1pt increase in the implied volatility of the underlying.


<br>


<p align="right">(<a href="#top">back to top</a>)</p>

-----------------------

<br>

<!-- GETTING STARTED -->
## Getting Started

<br>

If you have never worked with Google App Scripts, don't worry, its straight forward and there a lot of documentation on the internet. So much so, that instead of giving step-by-step instructions, I'm going to link to some of the best guides I have found.

<br>

### Installation

<br>

Instead of creating a tutorial, here are some I've found useful to install App Scripts into your sheet. The first article is really in-depth and comprehensive. 

- [Comprehensive guide](https://spreadsheetpoint.com/google-sheets-script/)
- [Video Tutorial](https://www.youtube.com/watch?v=Nd3DV_heK2Q)

For a simple installation, follow the guide above and copy the `single_file.gs` content into App Scripts. This file is condensed to include all modules so you can start working right away. Otherwise, you can add each module in its own file. App Scripts auto include all files in a project and no import is necessary.

<br>

#### _File Description_

<br>

The file naming convention follow standard JS principals but you can name them as you wish. Please see description of each file below:

| File                    | Description |
| ----------------------- | ----------- | 
| Params.gs               | A class to hold all user supplied parameters.<br>Includes derivative and Normal Distribution for parameters. |
| NormalDistribution.gs   | Encompasses normal distribution formula. |
| functions.gs            | Functions that are exposed to Google Sheets client. |
| single_file.gs          | A single file that includes all above for a quick copy/paste into Google Sheets. |

<br>

### Google App Scripts Resources

<br>

If you are not familiar with google Scripts, here are some resources to get you started.

- [Google App Scripts Home](https://developers.google.com/apps-script)
- [Beginner's Guide](https://www.benlcollins.com/apps-script/google-apps-script-beginner-guide/)
- [Custom Function Documentation](https://spreadsheet.dev/writing-custom-functions-for-google-sheets)


<br>

<p align="right">(<a href="#top">back to top</a>)</p>

____

<br>

<!-- USAGE EXAMPLES -->
## Usage

<br>

There are two primary ways to interact with the script:
1. Retrieve a contracts full quote, which includes price + greeks, for both Calls and Puts. 
2. Retrieve specific information, as needed (ex: get Gamma for Calls or Price for Puts).

Please see documentation below for function params & return.

<br>

### BSM_QUOTE(price, strike, time, rate, iv, divYield)

<br>

Returns a 2D array (two rows) with price and all the Greeks for put and call.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>


_Return format:_
|       | Col 1     | Col 2   | Col 3   | Col 4   | Col 5   | Col 6   |
| ----- | --------- | ------- | ------- | ------- | ------- | ------- |
| Row 1 | CALL PRICE| DELTA   | GAMMA   | Theta   | VEGA    | RHO     |
| Row 2 | PUT PRICE | DELTA   | GAMMA   | Theta   | VEGA    | RHO     |

<br>

_Return types:_
| Price | Delta | Gamma | Theta | Vega  | Rho   |
| ----- | ----- | ----- | ----- | ----- | ----- |
| float | float | float | float | float | float |

<br>

-----------------------

<br>

### BSM_PRICE(type, price, strike, time, rate, iv, divYield)

<br>

Calculates an approximate price of an option contract.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *string*<br>Specify `CALL` or `PUT`. Default is `CALL`. |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name   | Type    |
| ------ | ------- |
| price  | *float* |

<br>

-----------------------

<br>

### BSM_DELTA(price, strike, time, rate, iv, divYield)

<br>

Delta is the theoretical estimate of how much an option's value may change given a $1 move UPup or down in the underlying security. The Delta values range from -1 to +1, with 0 representing an option where the premium barely moves relative to price changes in the underlying stock.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name   | Type    |
| ------ | ------- |
| delta  | *float* |

<br>

-----------------------

<br>

### BSM_GAMMA(price, strike, time, rate, iv, divYield)

<br>

Gamma represents the rate of change between an option's Delta and the underlying asset's price. Higher Gamma values indicate that the Delta could change dramatically with even very small price changes in the underlying stock.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name   | Type    |
| ------ | ------- |
| gamma  | *float* |

<br>

-----------------------

<br>

### BSM_THETA(type, price, strike, time, rate, iv, divYield)

Theta represents, in theory, how much an option's premium may decay each day with all other factors remaining the same. 

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *string*<br>Specify `CALL` or `PUT`. Default is `CALL`. |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name  | Type    |
| ----- | ------- |
| theta | *float* |

<br>

-----------------------

<br>

### BSM_VEGA(price, strike, time, rate, iv, divYield)

<br>

Vega measures the amount of increase or decrease in an option premium based on a 1% change in implied volatility.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name  | Type    |
| ----- | ------- |
| vega  | *float* |

<br>

-----------------------

<br>

### BSM_RHO(type, price, strike, time, rate, iv, divYield)

<br>

Rho measures an option's sensitivity to changes in the risk-free rate of interest (the interest rate paid on US Treasury bills) and is expressed as the amount of money an option will lose or gain with a 1% change in interest rates.

<br>

| Name      | Description |
| --------- | ----------- |
| price     | *string*<br>Specify `CALL` or `PUT`. Default is `CALL`. |
| price     | *float*<br>Spot price of underlying stock. |
| strike    | *float*<br>Selected option strike. |
| time      | *float*<br>Time to maturity (expiry - today) / 365. |
| rate      | *float*<br>Suggested default: 10 year bond rate ("TNX"). |
| iv        | *float*<br>Implied volatility from your broker or Yahoo Finance. |
| divYield  | *float*<br>Annualized dividend yield for the company. |

<br>

_Return:_
| Name  | Type    |
| ----- | ------- |
| rho   | *float* |

<br>

-----------------------

<br>

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

> Please see the [open issues](https://github.com/BardsWork/bsm-sheets/issues) for a full list of proposed features (and known issues).

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

If you'd like to get in contact, the best way would probably be [twitter][@twitter-handle] or [open an issue][issues-url].


<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/BardsWork/bsm-sheets.svg?style=for-the-badge
[contributors-url]: https://github.com/BardsWork/bsm-sheets/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/BardsWork/bsm-sheets.svg?style=for-the-badge
[forks-url]: https://github.com/BardsWork/bsm-sheets/network/members
[stars-shield]: https://img.shields.io/github/stars/BardsWork/bsm-sheets.svg?style=for-the-badge
[stars-url]: https://github.com/BardsWork/bsm-sheets/stargazers
[issues-shield]: https://img.shields.io/github/issues/BardsWork/bsm-sheets.svg?style=for-the-badge
[issues-url]: https://github.com/BardsWork/bsm-sheets/issues
[license-shield]: https://img.shields.io/github/license/BardsWork/bsm-sheets.svg?style=for-the-badge
[license-url]: https://github.com/BardsWork/bsm-sheets/blob/main/LICENSE
[docs-url]: https://github.com/BardsWork/bsm-sheets
[demo-url]: https://docs.google.com/spreadsheets/d/e/2PACX-1vQD9kuzgQscJvd3i1dpvPIv7z4UCZ6HyHy3v_VGM449rp1JgG7No2_i8QV4IW87M-tIllyZCC6ng0FX/pubhtml?gid=4&single=true
[product-screenshot]: images/screenshot.png
[@twitter-handle]: https://twitter.com/bardswork
[@github-url]: https://github.com/BardsWork
