import Head from "next/head";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

//materialUI fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Slider } from "@mui/material";

const Cesium = dynamic(() => import("../components/Cesium"), { ssr: false });

export default function Home({ centroidData, cityTempData }) {
  let map = new Map(JSON.parse(cityTempData));
  console.log(map);
  const [date, setDate] = useState(null);

  const handleOnClick = () => {
    console.log(date.children[0].textContent);
  };

  useEffect(() => {
    console.log("here");
    console.log(date);
  }, [date]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Cesium centroids={centroidData} date={date} setDate={setDate} />
      <Slider
        aria-label="Temperature"
        defaultValue={30}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
        onChange={handleOnClick}
      />
    </>
  );
}

import { getCountryCentroids, getDateRange } from "../lib/dataParsing";
import { useEffect, useRef, useState } from "react";

export async function getStaticProps() {
  const centroidData = getCountryCentroids();
  const cityTempData = JSON.stringify(Array.from(getDateRange().entries()));

  return {
    props: {
      centroidData,
      cityTempData,
    },
  };
}
