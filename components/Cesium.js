import { Cartesian3, Color, Ion } from "cesium";
import { useState, useRef, useEffect } from "react";
import { Entity, Viewer } from "resium";

//imports for the calendar input
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//date/time library
import moment from "moment";

//import d3 library to make color scale
import * as d3 from "d3";
//min max temp values from the dataset overview on the kaggle website
let colours = d3
  .scaleThreshold()
  .domain([
    -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40,
  ])
  .range([
    "rgb(14, 77, 100)",
    "rgb(16, 94, 110)",
    "rgb(19, 113, 119)",
    "rgb(21, 128, 123)",
    "rgb(24, 137, 119)",
    "rgb(26, 145, 114)",
    "rgb(29, 154, 108)",
    "rgb(36, 158, 85)",
    "rgb(42, 163, 62)",
    "rgb(56, 167, 49)",
    "rgb(90, 171, 56)",
    "rgb(122, 175, 62)",
    "rgb(153, 179, 69)",
    "rgb(182, 183, 76)",
    "rgb(187, 164, 83)",
    "rgb(191, 145, 90)",
    "rgb(195, 128, 97)",
    "rgb(198, 112, 105)",
  ]);

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ centroids, dateRange, tempData }) {
  const ref = useRef(null);

  const [currDate, setCurrDate] = useState(moment(dateRange[1]));
  //using the currentDate, the array of country temp data is returned from the tempData map
  //it's then converted back into a map, with the country name as the key, and it's temperature as the value
  let currTempData = new Map(
    tempData
      .get(currDate.format("YYYY-MM-DD"))
      .map((el) => [el.country, el.avgTemp])
  );

  useEffect(() => {
    console.log(currDate.format("YYYY-MM-DD"));
    console.log(currTempData);
  }, [currDate]);

  //this function is used to create a new Cesium color from the d3 color scale
  const getColour = (temp) => {
    if (temp) return new Color.fromCssColorString(colours(temp));
    else return new Color.fromBytes(0, 0, 0, 0.1);
  };

  console.log(colours(35));

  return (
    <Viewer
      full
      ref={ref}
      animation={false}
      homeButton={false}
      timeline={false}
      baseLayerPicker={false}
    >
      {centroids &&
        centroids.map((el) => {
          return (
            <Entity
              name={el.COUNTRY}
              position={Cartesian3.fromDegrees(
                parseFloat(el.longitude),
                parseFloat(el.latitude, 100)
              )}
              point={{
                pixelSize: 20,
                color: getColour(parseFloat(currTempData.get(el.COUNTRY))),
              }}
              description={`AvgTemp: ${currTempData.get(el.COUNTRY)}`}
            />
          );
        })}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div
          style={{
            position: "absolute",
            top: "5em",
            left: "5em",
            backgroundColor: "white",
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
      </LocalizationProvider>
    </Viewer>
  );
}
