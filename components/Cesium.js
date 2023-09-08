import { Cartesian3, Color, Ion } from "cesium";
import { useState } from "react";
import { Entity, Viewer } from "resium";

import { API_KEY } from "../API";

Ion.defaultAccessToken = API_KEY;

export default function Cesium() {
  const [flag, setFlag] = useState(false);

  return (
    <Viewer full>
      <Entity
        name="Tokyo"
        position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
        point={{ pixelSize: 20, color: Color.WHITE }}
        description="hoge"
        onClick={() => setFlag((f) => !f)}
      />
      {flag && (
        <Entity
          position={Cartesian3.fromDegrees(139.767052, 34.681167, 100)}
          point={{ pixelSize: 20, color: Color.RED }}
        />
      )}
    </Viewer>
  );
}
