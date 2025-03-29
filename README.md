# Game Management API

A RESTful API service for managing game data with search and population capabilities.

## Features
- CRUD operations for game management
- Search functionality by name and platform
- Bulk data population from JSON files
- Dockerized deployment
- CI pipeline integration

## Getting Started

### Prerequisites
- Node.js
- Docker (optional)
- npm

### Installation

**Using Docker:**
```bash
docker-compose up
```

**Using Node.js:**
```bash
npm install
npm start
```

## Running Tests
```bash
npm test
```

## Project Insights

### Development Timeline

| Task | Time Spent |
|------|------------|
| Project setup & API structure | 10 minutes |
| Docker & CI pipeline setup | 25 minutes |
| ESLint fixes | 3 minutes |
| Search functionality | 15 minutes |
| Populate functionality | 35 minutes |
| Documentation & Answer to the questions & README | 10 minutes |
| **Total Time** | **1 hour 13 minutes** |

### Technical Considerations

#### Database Schema
Current limitations:
- Schema needs adaptation for JSON file structure
- Missing unique identifiers
- Duplicate handling needs improvement

## Suggestions 

I have added some requirements in the tests such as: 
- Dockerizing the app
- Adding CI to check the unit tests
I highly suggest migrating to TypeScript to have better type safety and code quality.
Moreover, while Express is fine, I would suggest using NestJS, which is faster and more efficient.
Also, while SQLite is good for development, I would suggest using PostgreSQL, which is more robust and scalable.

## Time spent

You can find all the time spent by checking the commit history.

| Task | Time Spent |
|------|------------|
| Project setup & API structure | 10 minutes |
| Docker & CI pipeline setup | 25 minutes |
| ESLint fixes | 3 minutes |
| Search functionality | 15 minutes |
| Populate functionality | 35 minutes |
| Documentation & README | 10 minutes |
| **Total Time** | **1 hour 13 minutes** |


# Practical Assignments


#### FEATURE B: Feedback

The database schema is not adapted to the JSON files. 
We should first add some missing attributes to the database schema and also add a unique attribute (I would suggest using the ID from the JSON files).
Moreover, by using that ID, we would be able to update rows if duplicate items are found in the database.


#### Question 1:
```We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.```

Let's say that we don't update the database schema and put the app in production (in this state):
- First of all, we would dockerize the app and add a CI pipeline to check the unit tests (I already did it as a bonus) to have a harmonized deployment
- Using a file as a database is not a good practice. We should use a more robust and scalable database like PostgreSQL
- We should enable CORS, use environment variables, and put the app in production mode (PORT needs to be in an .env file)
- We should add logs to the app for better debugging
- We should add metrics to the app for better monitoring
- We should add Helmet to have better security (to prevent attacks like XSS, SQL injection, etc.)
- Since the frontend is using static files, we should add HTTPS to the app


#### Question 2:
```Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.```


We could use a cron job to run the populate API every day at a specific time.
Every day, the cron job would download the new files from the S3 bucket and run the populate API (being careful with duplicate elements, which is why we need to follow my suggestion in the Feature B feedback).
It would be best to use a Lambda function to run the populate API to avoid disturbing the main app when processing large amounts of data.