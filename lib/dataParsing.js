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

  const map = new Map();

  const cityTempData = d3.csvParse(readFileSync(cityTempPath, "utf8"));
  cityTempData.forEach((el) => {
    //if the date (key) hasn't already been added to the map, add it along with the current entries data
    if (!map.has(el.dt)) {
      map.set(el.dt, [{ country: el.Country, avgTemp: el.AverageTemperature }]);
      //otherwise, if it has been added, append the entry to the array of values for that date
    } else {
      map
        .get(el.dt)
        .push({ country: el.Country, avgTemp: el.AverageTemperature });
    }
  });

  return map;
}
