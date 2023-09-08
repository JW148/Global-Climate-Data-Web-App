import { Cartesian3, Color, Ion } from "cesium";
import { useState } from "react";
import { Entity, Viewer } from "resium";

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ centroids }) {
  return (
    <Viewer full>
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
            />
          );
        })}
    </Viewer>
  );
}
