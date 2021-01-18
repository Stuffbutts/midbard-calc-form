import {
  minTime,
  maxTime,
  minBards,
  maxBards,
  baseBardRate,
  bardRate,
  baseTimeRate,
  timeRate,
  baseRate
} from "./settings";

export const moneyFormat = (amount: number) => {
  const moneyString = amount.toString(10);
  const charArray = moneyString.split("");
  let resultArray: string[] = [];

  while (charArray.length) {
    resultArray = resultArray.concat(charArray.splice(-3).join(""));
  }
  return resultArray.reverse().join(",");
};

export const humanTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  let timeString = "";

  if (hours) {
    timeString += `${hours} hour`;
    if (hours > 1) {
      timeString += "s";
    }
  }

  if (minutes) {
    if (hours) {
      timeString += " and ";
    }

    timeString += `${minutes} minute`;
    if (minutes > 1) {
      timeString += "s";
    }
  }

  return timeString;
};

export const calculateFees = (bardCount: number, time: number = minTime) => {
  if (time < minTime) {
    throw new Error(`Time cannot be less than ${humanTime(minTime)}`);
  }

  if (time > maxTime) {
    throw new Error(`Time cannot be more than ${humanTime(maxTime)}`);
  }

  if (bardCount < minBards) {
    throw new Error(`Cannot hire less than ${minBards} bards`);
  }

  if (bardCount > maxBards) {
    throw new Error(`Cannot hire more than ${maxBards} bards`);
  }

  const calculatedBardRate = baseBardRate + bardCount * bardRate;
  const calculatedTimeRate =
    baseTimeRate + Math.floor((time - 30) / 30) * timeRate;

  const total =
    baseRate * (bardCount * calculatedBardRate) * calculatedTimeRate;

  return total;
};
