import {
  Card,
  CardContent,
  Collapse,
  Container,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Slider,
  Typography
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { stripIndents } from "common-tags";
import React from "react";
import { calculateFees, humanTime, moneyFormat } from "./Calculations";
import { minBards, minTime, maxBards, maxTime, baseRate } from "./settings";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(4)
    },
    gridItem: {
      margin: theme.spacing(0, 0, 4)
    },
    totalRow: {
      height: 200
    },
    formulaCard: {
      marginBottom: theme.spacing(4)
    },
    formulaCardTitle: {
      fontSize: 16,
      fontWeight: "bold"
    },
    formulaContainer: {
      background: theme.palette.grey[300],
      padding: theme.spacing(1),
      borderWidth: 1,
      borderColor: theme.palette.grey[500],
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius
    },
    formulaFormatted: {
      whiteSpace: "pre-wrap"
    }
  })
);

const Form = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    bardCount: minBards,
    time: minTime,
    total: 0,
    error: null
  });

  const onChange = (name: string) => (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    setState((prev) => ({
      ...prev,
      [name]: value as number
    }));
  };

  React.useEffect(() => {
    try {
      const total = calculateFees(state.bardCount, state.time);
      setState((prev) => ({
        ...prev,
        error: null,
        total
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err.message
      }));
    }
  }, [state.bardCount, state.time]);

  return (
    <Container component={Paper} className={classes.root} maxWidth="sm">
      <Grid container component="form">
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="h4" component="h1">
            Booking Cost Calculation Form
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} component={Collapse} in={!!state.error}>
          <Alert severity="error" className={classes.gridItem}>
            {state.error}
          </Alert>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography id="bard-count" gutterBottom>
            How Many Bards?
          </Typography>
          <Slider
            name="bardCount"
            value={state.bardCount}
            min={minBards}
            max={maxBards}
            marks
            step={1}
            aria-labelledby="bard-count"
            valueLabelDisplay="auto"
            onChange={onChange("bardCount")}
          />
          <Typography id="bard-count-value" variant="caption">
            {`${state.bardCount} bards`}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography id="booked-time" gutterBottom>
            How long will they play?
          </Typography>
          <Slider
            name="time"
            value={state.time}
            min={minTime}
            max={maxTime}
            step={30}
            marks
            aria-labelledby="booked-time"
            aria-valuetext="booked-time-value"
            valueLabelDisplay="auto"
            onChange={onChange("time")}
          />
          <Typography variant="caption" id="booked-time-value">
            {humanTime(state.time)}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          component={Card}
          variant="outlined"
          className={classes.formulaCard}
        >
          <CardContent>
            <Typography
              variant="body2"
              className={classes.formulaCardTitle}
              gutterBottom
            >
              Formula for calculating price
            </Typography>
            <div className={classes.formulaContainer}>
              <Typography variant="caption" component="code">
                <strong>{`[${moneyFormat(baseRate)} x b(r)] * t`}</strong>
              </Typography>
              <Typography
                variant="caption"
                component="pre"
                className={classes.formulaFormatted}
              >
                {stripIndents`
          for b (# of bards)
          for r (rate per bard) - minimum is 1.00 increasing by 0.25 per bard
          for t (time) - minimum is 0.75 increasing by 0.25 per half hour.`}
              </Typography>
            </div>
          </CardContent>

          {/* </Card> */}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            <strong>Formula: </strong>
          </Typography>
          <Typography variant="caption">
            {`${moneyFormat(baseRate)} * ${state.bardCount}(${
              1.0 + 0.25 * state.bardCount
            }) * ${0.75 + 0.25 * Math.floor((state.time - 30) / 30)}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="span">
            <strong>Total: </strong>
          </Typography>
          <Typography component="span">{`${moneyFormat(
            state.total
          )}`}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Form;
