import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactStars from "react-stars";
import {
  Grid,
  makeStyles,
  CardContent,
  CardMedia,
  CardActionArea,
  Card,
  Typography,
} from "@material-ui/core";
import IdentityModal, {
  useIdentityContext,
} from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./index.css";

export default () => {
  const [status, setStatus] = useState("loading...");
  const [reviews, setReviews] = useState(null);
  useEffect(() => {
    if (status !== "loading...") return;
    axios("/api/get-reviews").then((result) => {
      if (result.status !== 200) {
        console.error("Error loading Reviews");
        console.error(result);
        return;
      }
      setReviews(result.data.reviews);
      setStatus("loaded");
    });
  }, [status]);
  const getAvatar = () => {
    const random = Math.floor(Math.random() * (reviews.length - 0 + 1) + 0);
    const imgUrl = `https://avatars.dicebear.com/api/human/${random}.svg?mood[]=happy`;
    return imgUrl;
  };

  const identity = useIdentityContext();
  const [dialog, setDialog] = useState(false);
  const username =
    (identity &&
      identity.user &&
      identity.user.user_metadata &&
      identity.user.user_metadata.full_name) ||
    "Untitled";
  const isLoggedIn = identity && identity.isLoggedIn;

  const useStyles = makeStyles({
    gridContainer: {
      paddingLeft: "40px",
      paddingRight: "40px",
    },
  });
  const useStylesCards = makeStyles({
    root: {
      maxWidth: 200,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    content: {
      flexGrow: 1,
      align: "center",
    },
    media: {
      height: 70,
      paddingTop: "56.25%", // 16:9
    },
  });
// Add Review
const [show, setShow] = useState(false);
const [rating, setRating] = useState(4);
const [name, setName] = useState('');
const [text, setText] = useState('');
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const ratingChanged = (newRating) => {
  setRating(newRating);
}
const nameChanged = evt => {
  const val = evt.target.value;
  setName(val);
}
const textChanged = evt => {
  const val = evt.target.value;
  setText(val);
}
const handleCreate = async event => {
  if(text === '') return;
  await axios.post('/api/create-review', { name, text, rating });
  const newList = reviews.concat({ name, text, rating });
  setReviews(newList);
  setShow(false);
}
  // For using css values in card components
  const classes = useStyles();
  const classesCards = useStylesCards();
  return (
    <>
      {identity && identity.isLoggedIn ? (
        <div className="auth-btn-grp">
          <Button variant="outline-primary" onClick={handleShow}>
            Add Review
          </Button>{" "}
          <Button
            variant="outline-primary"
            className="login-btn"
            onClick={() => setDialog(true)}
          >
            {isLoggedIn ? `Hello ${username}, Log out here!` : "LOG IN"}
          </Button>
        </div>
      ) : (
        <div className="auth-btn-grp">
          <Button
            variant="outline-primary"
            className="login-btn"
            onClick={() => setDialog(true)}
          >
            {isLoggedIn ? `Hello ${username}, Log out here!` : "LOG IN"}
          </Button>
        </div>
      )}
      <div className="container">
        <div>
          <Grid
            container
            spacing={4}
            className={classes.gridContainer}
            justify="center"
          >
            {reviews &&
              reviews.map((review, index) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    className={classesCards.root}
                    className="card"
                    variant="outlined"
                  >
                    <CardActionArea>
                      <CardMedia
                        className={classesCards.media}
                        height="10"
                        image={getAvatar()}
                        title="FaunaDB Users"
                      />
                      <CardContent>
                        <Typography
                          className={classesCards.content}
                          gutterBottom
                          variant="h4"
                          component="h2"
                        >
                          {review.name}
                        </Typography>
                        <Typography
                          variant="h4"
                          color="textSecondary"
                          component="h2"
                        >
                          {review.text}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          <ReactStars
                            className="rating"
                            count={review.rating}
                            size={24}
                            color1={"#ffd700"}
                            edit={false}
                            half={false}
                          />
                          <br />
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </div>
      </div>
      <IdentityModal showDialog={dialog} onCloseDialog={() => setDialog(false)} />
      <Modal
          show={show}
          onHide={handleClose}
          animation={true}
          className="add-review"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="create-form">
            <textarea 
                onChange={(evt) => nameChanged(evt)} 
                placeholder="Enter your name here" />
              <textarea 
                onChange={(evt) => textChanged(evt)} 
                placeholder="Enter your message here" />
              <br />
              <span>Rating:</span> {' '} 
              <ReactStars
                count={5}
                value={rating}
                onChange={ratingChanged}
                size={24}
                color2={'#ffd700'}
                half={false} />
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={(evt) => handleCreate(evt)}>Create</Button>
          </Modal.Footer>
      </Modal>
    </>
  );
};
