import * as React from "react";
import "./styles.css";
import Form from "./Form";
import { CssBaseline, makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  })
);

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <div>
        <Form />
      </div>
    </div>
  );
}
