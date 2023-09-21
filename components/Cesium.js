import { Cartesian3, Color, Ion } from "cesium";
import { useState, useRef, useEffect } from "react";
import { Entity, Viewer } from "resium";

//imports for the calendar input
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { API_KEY } from "../API";
import moment from "moment";
import { count } from "d3";
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
    console.log(currTempData.get("Guatemala"));
  }, [currDate]);

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
              point={{ pixelSize: 20, color: Color.WHITE }}
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
