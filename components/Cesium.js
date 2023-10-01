import { Cartesian3, Color, Ion } from "cesium";
import { useState, useRef } from "react";
import { Entity, GeoJsonDataSource, PolygonGraphics, Viewer } from "resium";

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
  ]);

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ dateRange, tempData, countryGeoJSON }) {
  // console.log(countryGeoJSON.features[0].geometry.coordinates);
  const features = countryGeoJSON.features;
  const ref = useRef(null);

  const [currDate, setCurrDate] = useState(moment(dateRange[1]));
  //using the currentDate, the array of country temp data is returned from the tempData map
  //it's then converted back into a map, with the country name as the key, and it's temperature as the value
  let currTempData = new Map(
    tempData
      .get(currDate.format("YYYY-MM-DD"))
      .map((el) => [el.country, el.avgTemp])
  );

  //this function is used to create a new Cesium color from the d3 color scale
  const getColour = (temp) => {
    if (temp) return new Color.fromCssColorString(colours(temp));
    else return new Color.fromBytes(150, 150, 150, 255);
  };

  const getInfo = (properties) => {
    return `
      <h3>Name: ${properties.NAME}</h3>
      <br>
      Population: ${properties.POP_EST}
      <br>
      AvgTemp: ${currTempData.get(properties.NAME_CIAWF)}
    `;
  };

  return (
    <Viewer
      full
      ref={ref}
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
                material={getColour(
                  parseFloat(currTempData.get(el.properties.NAME_CIAWF))
                )}
              />
            </Entity>
          );
        } else if (el.geometry.type === "MultiPolygon") {
          return (
            <Entity
              name={el.properties.NAME_CIAWF}
              description={getInfo(el.properties)}
            >
              {el.geometry.coordinates.map((polygon) => {
                return (
                  <Entity
                    name={el.properties.NAME_CIAWF}
                    description={getInfo(el.properties)}
                  >
                    <PolygonGraphics
                      hierarchy={Cartesian3.fromDegreesArray(polygon.flat(2))}
                      material={getColour(
                        parseFloat(currTempData.get(el.properties.NAME_CIAWF))
                      )}
                    />
                  </Entity>
                );
              })}
            </Entity>
          );
        }
      })}
      {/* <GeoJsonDataSource
        data={countryGeoJSON}
        describe={(properties) => getInfo(properties)}
      /> */}
      {/* {countryGeoJSON.features.map((el) => {
        // console.log(parseFloat(currTempData.get(el.properties.name_ciawf)));
        return (
          <Entity name={el.properties.name_ciawf}>
            <PolygonGraphics
              hierarchy={Cartesian3.fromDegreesArray(
                el.geometry.coordinates.flat(3)
              )}
              outline={true}
              outlineColor={Color.BLACK}
              outlineWidth={1}
            />
          </Entity>
        );
      })} */}
      {/* <Entity>
        <PolygonGraphics
          hierarchy={Cartesian3.fromDegreesArray(
            countryGeoJSON.features[1].geometry.coordinates.flat(2)
          )}
          material={Color.ORANGE.withAlpha(0.5)}
        />
      </Entity> */}

      {/* {centroids &&
        centroids.map((el) => {
          return (
            <Entity
              name={el.COUNTRY}
              position={Cartesian3.fromDegrees(
                parseFloat(el.longitude),
                parseFloat(el.latitude, 1)
              )}
              point={{
                pixelSize: 20,
                color: getColour(parseFloat(currTempData.get(el.COUNTRY))),
              }}
              description={`AvgTemp: ${currTempData.get(el.COUNTRY)}`}
              key={el.COUNTRY}
            />
          );
        })} */}
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
      </LocalizationProvider>
    </Viewer>
  );
}
