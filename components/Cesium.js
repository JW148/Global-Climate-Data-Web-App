import {
  Cartesian3,
  Color,
  Ion,
  JulianDate,
  ClockRange,
  ClockStep,
  KeyboardEventModifier,
  ScreenSpaceEventType,
} from "cesium";
import { useState, useRef, useEffect } from "react";
import {
  Clock,
  Entity,
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEvent,
} from "resium";

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ centroids }) {
  const ref = useRef(null);
  const [state, setState] = useState(null);

  return (
    <Viewer full ref={ref} timeline={false} animation={false}>
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
      <ScreenSpaceEventHandler>
        <ScreenSpaceEvent
          action={(evt) => console.log(evt)}
          type={ScreenSpaceEventType.LEFT_CLICK}
        />
      </ScreenSpaceEventHandler>
    </Viewer>
  );
}
