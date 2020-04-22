import React from "react";
import ReactLoading from "react-loading";

// Styles
import useStyles from './styles';

export default function Loading() {
  const classes = useStyles();
  return (
    <div className={classes.loadingCenter}>
      <ReactLoading type={"balls"} color={"#536DFE"} height={400} />
    </div>
  );
}
