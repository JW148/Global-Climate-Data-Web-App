import Head from "next/head";
import dynamic from "next/dynamic";

//materialUI fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const Cesium = dynamic(() => import("../components/Cesium"), { ssr: false });

export default function Home({ dateRange, tempData, countryGeoJSON }) {
  const tempDataMap = new Map();

  useEffect(() => {
    tempData.forEach((el) => {
      //if the date (key) hasn't already been added to the map, add it along with the current entries data
      if (!tempDataMap.has(el.dt)) {
        tempDataMap.set(el.dt, [
          { country: el.Country, avgTemp: el.AverageTemperature },
        ]);
        //otherwise, if it has been added, append the entry to the array of values for that date
      } else {
        tempDataMap
          .get(el.dt)
          .push({ country: el.Country, avgTemp: el.AverageTemperature });
      }
    });
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Cesium
        dateRange={dateRange}
        tempData={tempDataMap}
        countryGeoJSON={countryGeoJSON}
      />
    </>
  );
}

import { getDateRange, getGeoJSON, getTempData } from "../lib/dataParsing";
import { useEffect } from "react";

export async function getStaticProps() {
  //have to serialise the map object returned by getDateRange for it to be sent to the client who can then turn it back into
  //a map object on their local device
  // const cityTempData = JSON.stringify(Array.from(getDateRange().entries()));
  const dateRange = getDateRange();
  const tempData = getTempData();
  const countryGeoJSON = getGeoJSON();

  return {
    props: {
      dateRange,
      tempData,
      countryGeoJSON,
    },
  };
}
