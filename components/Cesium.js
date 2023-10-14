import { Cartesian3, Color, Ion } from "cesium";
import { useState, useRef } from "react";
import { Entity, PolygonGraphics, Viewer } from "resium";

//imports for the calendar input
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//for the clear datepicker workaround
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";

//date/time library
import moment from "moment";

//import d3 library to make color scale
import * as d3 from "d3";

//css module style for the temp scale component
import styles from "./TempScale.module.css";

//min max temp values from the dataset overview on the kaggle website
const tempDomain = [
  -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40,
];
const compareDomain = [
  -2.3, -1.8, -1.5, -1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8,
  2.3,
];
const tempRange = [
  "rgba(14, 77, 100, 1)",
  "rgba(16, 94, 110, 1)",
  "rgba(19, 113, 119, 1)",
  "rgba(21, 128, 123, 1)",
  "rgba(24, 137, 119, 1)",
  "rgba(26, 145, 114, 1)",
  "rgba(29, 154, 108, 1)",
  "rgba(36, 158, 85, 1)",
  "rgba(42, 163, 62, 1)",
  "rgba(56, 167, 49, 1)",
  "rgba(90, 171, 56, 1)",
  "rgba(122, 175, 62, 1)",
  "rgba(153, 179, 69, 1)",
  "rgba(182, 183, 76, 1)",
  "rgba(187, 164, 83, 1)",
  "rgba(191, 145, 90, 1)",
  "rgba(195, 128, 97, 1)",
  "rgba(198, 112, 105, 1)",
];

let colours = null;

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ dateRange, tempData, countryGeoJSON }) {
  //get the features from the geoJSON data to display the vector map (country polygons)
  const features = countryGeoJSON.features;

  const [currDate, setCurrDate] = useState(moment("1900-01-01"));
  const [compareDate, setCompareDate] = useState(null);

  //using the currentDate, the array of country temp data is returned from the tempData map
  //it's then converted back into a map, with the country name as the key, and it's temperature as the value
  let currTempData = new Map(
    tempData
      .get(currDate.format("YYYY-MM-DD"))
      .map((el) => [el.country, parseFloat(el.avgTemp)])
  );

  //this function is used to create a new Cesium color from the d3 color scale
  const getColour = (temp) => {
    if (compareDate && temp) {
      colours = d3.scaleThreshold().domain(compareDomain).range(tempRange);
      return new Color.fromCssColorString(colours(temp));
    } else if (temp) {
      colours = d3.scaleThreshold().domain(tempDomain).range(tempRange);
      return new Color.fromCssColorString(colours(temp));
      //if there is no data for a given country, grey it out
    } else return new Color.fromBytes(150, 150, 150, 255);
  };

  let getTempData = function () {
    if (compareDate) {
      //first get the data for the comparison date as an array
      let compareData = tempData.get(compareDate.format("YYYY-MM-DD"));
      //then find all the countries that match with the currentTempData entries
      //(not all countries have data for certain dates so the comparison will only show
      //comparison data for countries that have entries for both dates)
      let compareDataMap = new Map();
      compareData.forEach((el) => {
        if (currTempData.get(el.country)) {
          //calculate the difference in temp between the two dates
          let diff =
            parseFloat(el.avgTemp) - parseFloat(currTempData.get(el.country));
          //add the the temp diff data to the new map
          compareDataMap.set(el.country, diff);
        }
      });
      return compareDataMap;
    } else {
      return currTempData;
    }
  };

  //function that returns a different temp scale based on whether the user is comparing two dates or not
  function TempScale() {
    if (compareDate) {
      return (
        <div className={styles.container}>
          {compareDomain.map((temp, i) => {
            let colour = colours(temp);
            return (
              <div key={i} style={{ backgroundColor: colour }}>
                <p style={{ padding: "0px 4px 0px 4px" }}>{temp}°C</p>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          {tempDomain.map((temp, i) => {
            let colour = colours(temp);
            return (
              <div key={i} style={{ backgroundColor: colour }}>
                <p style={{ padding: "0px 4px 0px 4px" }}>{temp}°C</p>
              </div>
            );
          })}
        </div>
      );
    }
  }

  //returns info to be displayed for the entities properties
  const getInfo = (properties) => {
    if (compareDate) {
      return `
        <h3>Average Temperature in ${currDate.format(
          "MMMM YYYY"
        )}:</h3> ${parseFloat(currTempData.get(properties.NAME_CIAWF)).toFixed(
        3
      )}°C
      <h3>Temperature Difference Compared to ${compareDate.format(
        "MMMM YYYY"
      )}</h3>
      ${parseFloat(getTempData().get(properties.NAME_CIAWF)).toFixed(3)}°C
      `;
    }
    return `
      <h3>Average Temperature: ${parseFloat(
        currTempData.get(properties.NAME_CIAWF)
      ).toFixed(3)}°C</h3>
    `;
  };

  return (
    <Viewer
      full
      animation={false}
      homeButton={false}
      timeline={false}
      baseLayerPicker={false}
    >
      {features.map((el) => {
        if (el.geometry.type === "Polygon") {
          return (
            <Entity
              name={el.properties.NAME_CIAWF}
              description={getInfo(el.properties)}
            >
              <PolygonGraphics
                hierarchy={Cartesian3.fromDegreesArray(
                  el.geometry.coordinates.flat(2)
                )}
                outline={true}
                outlineColor={Color.BLACK}
                height={0} //polygon has to be set outherwise outline isn't rendered
                material={getColour(
                  getTempData().get(el.properties.NAME_CIAWF)
                )}
              />
            </Entity>
          );
        } else if (el.geometry.type === "MultiPolygon") {
          return (
            <Entity name={el.properties.NAME_CIAWF}>
              {el.geometry.coordinates.map((polygon) => {
                return (
                  <Entity
                    name={el.properties.NAME_CIAWF}
                    description={getInfo(el.properties)}
                  >
                    <PolygonGraphics
                      hierarchy={Cartesian3.fromDegreesArray(polygon.flat(2))}
                      material={getColour(
                        parseFloat(getTempData().get(el.properties.NAME_CIAWF))
                      )}
                      outline={true}
                      height={0}
                      outlineColor={Color.BLACK}
                    />
                  </Entity>
                );
              })}
            </Entity>
          );
        }
      })}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div
          style={{
            position: "absolute",
            top: "5em",
            left: "5em",
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <DatePicker
            views={["month", "year"]}
            label={"Select date"}
            minDate={moment(dateRange[0])}
            maxDate={moment(dateRange[1])}
            defaultValue={moment(dateRange[1])}
            value={currDate}
            onChange={(val) => setCurrDate(val)}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "12em",
            left: "5em",
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <Grid container justify="center" alignItems="flex-end">
            <DatePicker
              views={["month", "year"]}
              label={"Select comparison date"}
              minDate={moment(dateRange[0])}
              maxDate={moment(dateRange[1])}
              value={compareDate}
              onChange={(val) => setCompareDate(val)}
            />
            <IconButton
              aria-label="clear"
              edge="end"
              size="small"
              disabled={!compareDate}
              onClick={() => setCompareDate(null)}
              style={{ alignSelf: "center" }}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </div>
      </LocalizationProvider>
      <TempScale />
    </Viewer>
  );
}
