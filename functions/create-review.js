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