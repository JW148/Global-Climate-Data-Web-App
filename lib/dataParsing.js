import * as d3 from "d3";
import path from "path";
import { readFileSync } from "fs";

const dataDirectory = path.join(process.cwd(), "data");

export function getCountryCentroids() {
  const centroidDataPath = path.join(dataDirectory, "countries.csv");
  //using d3.csv diresctly to read the csv data from the local directory doesn't work
  //so instead reading the file fist using readFileSync then parsing it using the d3 csvParse function
  //which returns an array of objects
  const centroidData = d3.csvParse(readFileSync(centroidDataPath, "utf8"));

  return centroidData;
}

export function getDateRange() {
  const cityTempPath = path.join(
    dataDirectory,
    "GlobalLandTemperaturesByCountry.csv"
  );

  //first read the data file
  const cityTempData = d3.csvParse(readFileSync(cityTempPath, "utf8"));
  //make a set from the parsed csv data to get all the possible, individual dates (set removes/doesn't accept duplicates)
  let dateSet = new Set(cityTempData.map((item) => item.dt));
  //convert the set back to an array to to access first and last elements to get the date range (assumes that the dates are in order in the dataset)
  let dateArr = Array.from(dateSet);
  //finally, return the first and last elements of the array
  return [dateArr[0], dateArr[dateArr.length - 1]];
}

export function getTempData() {
  const cityTempPath = path.join(
    dataDirectory,
    "GlobalLandTemperaturesByCountry.csv"
  );

  const cityTempData = d3.csvParse(readFileSync(cityTempPath, "utf8"));

  return cityTempData;
}

export function getGeoJSON() {
  const geoJSONPath = path.join(dataDirectory, "ne_10m_admin_0_countries.json");
  const countryGeoJSON = JSON.parse(readFileSync(geoJSONPath, "utf8"));

  return countryGeoJSON;
}
