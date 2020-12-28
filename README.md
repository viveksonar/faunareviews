# Building Serverless apps with FaunaDB &nbsp;&nbsp;&nbsp;<a href="https://app.netlify.com/start/deploy?repository=https://github.com/viveksonar/faunareviews"><img src="https://www.netlify.com/img/deploy/button.svg"></a>

Example of using [FaunaDB](https://fauna.com/) with [Netlify functions](https://www.netlify.com/docs/functions/) and [Netlify identity]() for authentication.

## About this application

This application is using [React](https://reactjs.org/) [Gatsby](https://www.gatsbyjs.com/) for the frontend, [Netlify Functions](https://www.netlify.com/docs/functions/) for API calls, [FaunaDB](https://fauna.com/) as the backing database, and [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) for Authenticating users.

![faunadb netlify](./public/images/faunareviews.png)

## Deploy with one click

Click the [Deploy to Netlify Button](https://app.netlify.com/start/deploy?repository=https://github.com/viveksonar/faunareviews)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/viveksonar/faunareviews)

## Setup & Run Locally

1. Clone down the repository

    ```bash
    git clone https://github.com/viveksonar/faunareviews.git
    ```

2. Enter the repo directory

    ```bash
    cd faunareviews
    ```

3. Install the dependencies

    ```bash
    npm install
    ```

4. Sign up for a FaunaDB account

    https://dashboard.fauna.com/accounts/register

5. Create a database

    In the Fauna Cloud Console:
    - Click “New Database”
    - Enter “faunareviews” as the “Database Name”
    - Click “Save”

6. Create a database access key

    In the Fauna Cloud Console:
    - Click “Security” in the left navigation
    - Click “New Key”
    - Make sure that the “Database” field is set to “Netlify”
    - Make sure that the “Role” field is set to “Admin”
    - Enter “admin” as the “Key Name”
    - Click “Save”

7. Copy the database access key’s secret

    Save the secret somewhere safe; you won’t get a second chance to see it.

8. Create a .env file and put the line below and replace `YourFaunaDBSecretHere` with value of the secret that you copied in previous step.

    In your terminal, run the following command:

    ```bash
    FAUNA_ADMIN_SECRET=YourFaunaDBSecretHere
    ```

9. Bootstrap your FaunaDB collection and indexes

    ```bash
    npm run bootstrap
    ```

10. Run project locally

    ```bash
    netlify dev
    ```

### Backend Functions

Let have a overview of the 4 funciton we have created in this project.
1. **Graphql Query**

We have created a graphql query in the `/functions/utils` folder as `query.js` to interact with the fauna inbuit graphql engine.

```
// query.js

const axios = require("axios");
require("dotenv").config();

module.exports = async (query, variables) => {
  const result = await axios({
      url: "https://graphql.fauna.com/graphql",
      method: "POST",
      headers: {
          Authorization: `Bearer ${process.env.FAUNA_ADMIN_SECRET}`
      },
      data: {
        query,
        variables
      }
 });

 return result.data;
};

```

2. **Create-review**

Create in `/function` as `create-review.js` this function creates new review entry in database.

```
// create-review.js

const query = require("./utils/query");

const CREATE_REVIEW = `
  mutation($name: String!, $text: String!, $rating: Int!){
    createReview(data: {name: $name, text: $text, rating: $rating}){
      _id
      name
      text
      rating
    }
  }
`;

exports.handler = async event => {
  const { name, text, rating } = JSON.parse(event.body);
  const { data, errors } = await query(
          CREATE_REVIEW, { 
name, text, rating });

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors)
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ review: data.createReview })
  };
};
```

3. **Delete-review**
   
This will delete the review from the database according to the id we pass in the body.

```
// delete-review.js

const query = require("./utils/query");

const DELETE_REVIEW = `
  mutation($id: ID!) {
    deleteReview(id: $id){
      _id
    }
  }
`;

exports.handler = async event => {
  const { id } = JSON.parse(event.body);
  const { data, errors } = await query(
    DELETE_REVIEW, { id });

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors)
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ deletedReview: data.deleteReview
   })
  };
};
```

4. **Get-reviews**
This function gets all reviews from the database.

```
// get-reviews.js

const query = require("./utils/query");

const GET_REVIEWS = `
    query {
        allReviews {
          data {
             _id
             name
             text
             rating
          }
        }
     }
`;

 exports.handler = async () => {
    const { data, errors } = await query(GET_REVIEWS);

    if (errors) {
       return {
         statusCode: 500,
         body: JSON.stringify(errors)
       };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reviews: data.allReviews.data })
    };
  };
```

5. **Update-review**

This function update the review of the id which we pass in the body.

```
// update-review.js

const query = require("./utils/query");

const UPDATE_REVIEW = `
    mutation($id: ID!,$name: String!, $text: String!, $rating: Int!){
        updateReview(id: $id, data: {name: $name, text: $text, rating: $rating}){
            _id
            name
            text
            rating
        }
    }
`;

exports.handler = async event => {
  const { id,name, text, rating } = JSON.parse(event.body);
  const { data, errors } = await query(
       UPDATE_REVIEW, { id,name, text, rating });

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors)
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedReview: 
data.updateReview })
  };
};
```

### Wrapping Up

That's it. You now have your own CRUD API using Netlify Functions and FaunaDB.

You will also be able to setup authentication using Netlify Identity.

As you can see, functions can be extremely powerful when combined with a cloud database!

The sky is the limit on what you can build with the JAMstack and we'd love to hear about what you make.

![final appliaction](./public/images/final-app-min.gif)