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