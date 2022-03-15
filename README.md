<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Funko Store Rest-Api with NestJs and Prisma(PostgreSql)

## About The Project

funko-api consists in a REST service which allows to a user to easily buy and manage products(funkos), for more, you can check the project's documentation executing the app and going to {{project_base_uri}}/docs, or you can take a look on postman docs as it's especified bellow

<p align="right">(<a href="#top">back to top</a>)</p>

## Installation
_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._
1. Get a free API Key at [https://signup.sendgird.com](https://signup.sendgrid.com) (not supported yet)
2. Clone the repo
   ```sh
   
   git clone https://github.com/Xrls9/funko-api.git
   ```
3. Install NPM packages
   ```sh
   
   npm install
   ```
4. Enter your API in `.env`
   ```js
   
   const SENDGRID_API_KEY = 'ENTER YOUR API';
   ```
5. Create a Postgre DB and setup connection
   ```sh
   
   DATABASE_URL = postgresql://username:password@localhost:port/DB_NAME?schema-public
   PORT= default(5432)
   ```
6. Install PrismaCLI and execute Prisma Migration tool.
   ```
   npm install @prisma/cli --save-dev
   npx prisma migrate dev
   ```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
 
<!-- USAGE EXAMPLES -->
## Usage

_For examples of the endpoints, please check the [Documentation](https://documenter.getpostman.com/view/19560659/UVsLQkf7)_
<p align="right">(<a href="#top">back to top</a>)</p>
