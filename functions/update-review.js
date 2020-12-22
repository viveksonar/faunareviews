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