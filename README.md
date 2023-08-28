#  News API

This project is an API for accessing news data programmatically (topics, articles, comments etc.).  The purpose of the API is to mimic the building of a real world backend service (such as Reddit) which should provide this information to a front end application.

An overview of each endpoint, including a description, example requests and responses can be found on the /api route.

A hosted version of the API can be found here: \
https://news-api-get0.onrender.com/api

## Running the API locally
### Prerequisites
To run this API locally, you will require the following dependencies to be installed.

* **Node.js** - minimum version 18 is required.  Go to [here](https://nodejs.org/en/download) to install.
* **PostgreSQL** - minimum version 14.9 is required.  Go to [here](https://www.postgresql.org/download/) to install.

### Installation
Follow the steps below to install the API

1. Clone the repository
```
git clone https://github.com/ccdu1010/news-api.git
```

2. Install dependencies by running the following command from the news-api (root) directory
```
npm install
```

3. Create the database and tables
```
npm setup-dbs
```

4. Seed sample data
```
npm seed
```

5. To allow the API to connect to the database, an environment variable must be set to determine which database to connect to. To do this, please add the following file to the root directory: 

 .env.development 
``` 
PGDATABASE = nc_news
```

6. Run the API
```
npm start
```

### Running tests

The tests for the API use [SuperTest](https://www.npmjs.com/package/supertest).  To run these tests a test database must be used.  As part of the commands above, this test database should already be created and seeded with test data. For the tests to run, another environment file should be added to the root directory as follows: 

.env.test
```
PGDATABASE = nc_news_test
```

Then to run the tests:
```
npm test
```