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