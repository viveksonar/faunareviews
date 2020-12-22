import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactStars from "react-stars";
import {
  Grid,
  CardContent,
  CardMedia,
  Button,
  CardActionArea,
  Card,
  Typography,
  CardActions,
} from "@material-ui/core";
import useStyles from './gridstyle';
import useStylesCards from './cardstyle';
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
  // For using css valuse in card components
  const classes = useStyles();
  const classesCards = useStylesCards();
  return (
    <>
      <div className="container1">
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
      
    </>
  );
};
