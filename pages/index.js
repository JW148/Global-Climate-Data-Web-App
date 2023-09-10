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
  console.log(cityTempData[0]);
  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
      </Head>
      <Cesium centroids={centroidData} />
      <Slider
        aria-label="Temperature"
        defaultValue={30}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />
    </>
  );
}

import { getCountryCentroids, getDateRange } from "../lib/dataParsing";

export async function getStaticProps() {
  const centroidData = getCountryCentroids();
  const cityTempData = getDateRange();

  return {
    props: {
      centroidData,
      cityTempData,
    },
  };
}
