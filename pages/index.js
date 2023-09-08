import Head from "next/head";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

const Cesium = dynamic(() => import("../components/Cesium"), { ssr: false });

export default function Home({ centroidData }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
      </Head>
      <Cesium centroids={centroidData} />
    </>
  );
}

import { getCountryCentroids } from "../lib/dataParsing";

export async function getStaticProps() {
  const centroidData = getCountryCentroids();

  return {
    props: {
      centroidData,
    },
  };
}
