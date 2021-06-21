# ESTL-GiamJuXian

## Setup Instructions

1. Ensure that you have Postgres and Node install on the system

```
sudo brew install postgresql
sudo brew install node
psql --version
```

2. Once you have Postgres ready on the system, we need to first set up the database. To do that, run the following command in the root folder

```
yarn first-setup
```

This will create the databases and tables needed for the web application

3. With that, all we need to do is to install the `node_modules` and start the app. Run the following command in the root folder

```
yarn install
yarn start
```

This will install all `node_modules` in both the client and server folders. `yarn start` will build a React build and start a local server.

4. Once all of the set up is done, you can visit the application by visiting `http://localhost:8080/`

## Running tests

1. To ensure that there is no errors in the build, you can run

```
yarn test
```

## Project Focus

This project has completed the following user stories

1. USER STORY 1: Upload Users (Prioritized)
2. USER STORY 2: Employee Dashboard Feature (Prioritized)
3. USER STORY 3: CRUD Feature (Bonus)

## Assumptions

We assume the following details

1. `.csv` files that will be uploaded will always have a header. The first line is always ignored
2. `id` of Employees should have the same length. Sorting of the `id` field will only sort for its string value
