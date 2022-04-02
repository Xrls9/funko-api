<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Funko Store Rest-Api with NestJs and Prisma(PostgreSql)

## About The Project

funko-api consists in a REST service which allows to a user to easily buy and manage products(funkos), for more, you can check the project's documentation executing the app and going to {{project_base_uri}}/docs, or you can take a look on postman docs as it's especified bellow

## Built With

This project was built using these main technologies.

- [NestJS](https://nestjs.com//)
- [Jest.js](https://jestjs.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [GraphQL](https://graphql.org/)

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

4. Enter your development variables on a new env file `.env`, see example on .env.example

5. Create a Postgre DB and setup connection

   ```sh

   DATABASE_URL = postgresql://username:password@localhost:port/DB_NAME?schema-public
   PORT= default(5432)
   ```

6. Install PrismaCLI and execute Prisma Migration tool.
   ```
   npm install @prisma/cli --save-dev
   npx prisma migrate dev
   npx prisma generate
   ```
7. To run aplication, execute the folliwing.

```
npm run start:dev
```

8. The aplication is running on:

```
Rest context = https://localhost:3000/api/v1/
GraphQL context = https://localhost:3000/graphql/
```

9. App is deployed on heroku:

```
Rest context = https://czap-funko-api.herokuapp.com/api/v1/
GraphQL context = https://czap-funko-api.herokuapp.com/graphql/
```

## Test

In order to run tests, run the following command:

```
# test coverage
$ npm run test
```

If you want to collect coverage, run the following:

```
# test coverage
$ npm run test:cov
```

<!-- USAGE EXAMPLES -->

## Usage

_For examples of the endpoints, please check the [Documentation](https://documenter.getpostman.com/view/19560659/UVsLQkf7)_

<p align="right">(<a href="#top">back to top</a>)</p>
