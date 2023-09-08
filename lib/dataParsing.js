import * as d3 from "d3";
import path from "path";
import fs, { readFileSync } from "fs";

const dataDirectory = path.join(process.cwd(), "data");

export function getCountryCentroids() {
  const centroidDataPath = path.join(dataDirectory, "countries.csv");
  //using d3.csv diresctly to read the csv data from the local directory doesn't work
  //so instead reading the file fist using readFileSync then parsing it using the d3 csvParse function
  //which returns an array of objects
  const centroidData = d3.csvParse(readFileSync(centroidDataPath, "utf8"));

  return centroidData;
}
