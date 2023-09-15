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
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Clock,
  Entity,
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEvent,
  useCesium,
} from "resium";

import { API_KEY } from "../API";
Ion.defaultAccessToken = API_KEY;

export default function Cesium({ centroids, date, setDate }) {
  const ref = useRef(null);
  const [entity, setEntity] = useState(null);
  useEffect(() => {
    if (ref.current && ref.current.cesiumElement) {
      setDate(ref.current.cesiumElement.animation._knobDate);
    }
  }, []);

  return (
    <Viewer full ref={ref}>
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
