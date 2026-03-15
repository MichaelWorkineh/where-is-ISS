import * as THREE from "three"
import { useMemo } from "react"

function latLonToXYZ(lat, lon, radius) {
  const latRad = lat * Math.PI / 180
  const lonRad = lon * Math.PI / 180

  const x = radius * Math.cos(latRad) * Math.sin(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.cos(lonRad)

  return [x, y, z]
}

export default function LatLonGrid({ radius = 5 }) {

  const geometry = useMemo(() => {

    const points = []

    // latitude lines
    for (let lat = -80; lat <= 80; lat += 10) {
      for (let lon = -180; lon <= 180; lon += 2) {

        const p1 = latLonToXYZ(lat, lon, radius)
        const p2 = latLonToXYZ(lat, lon + 2, radius)

        points.push(...p1, ...p2)
      }
    }

    // longitude lines
    for (let lon = -180; lon <= 180; lon += 10) {
      for (let lat = -90; lat <= 90; lat += 2) {

        const p1 = latLonToXYZ(lat, lon, radius)
        const p2 = latLonToXYZ(lat + 2, lon, radius)

        points.push(...p1, ...p2)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    )

    return geo

  }, [radius])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="white" opacity={0.4} transparent />
    </lineSegments>
  )
}