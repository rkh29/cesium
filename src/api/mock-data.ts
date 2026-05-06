import type { Instance, InstanceResource, Link, LinkResource, PositionMap } from './types'

const leoLatitudes = [-46, -22, 0, 22, 46]
const leoPlaneLongitudes = [0, 120, -120]
const groundStations = [
  { id: 'ground-boundary-west', name: '边界监测站-西', latitude: 75.2, longitude: 39.1 },
  { id: 'ground-boundary-east', name: '边界监测站-东', latitude: 134.8, longitude: 35.4 },
  { id: 'ground-boundary-south', name: '边界监测站-南', latitude: 110.3, longitude: 18.3 },
  { id: 'ground-boundary-north', name: '边界监测站-北', latitude: 123.5, longitude: 53.2 },
  { id: 'ground-mcs-001', name: '中心主控站', latitude: 104.1, longitude: 35.8 }
]

function buildInstances() {
  const result: Instance[] = []

  for (let plane = 0; plane < 3; plane += 1) {
    for (let index = 0; index < 5; index += 1) {
      const serial = plane * 5 + index + 1
      result.push({
        instance_id: `sat-${String(serial).padStart(3, '0')}`,
        name: `低轨卫星-${String(serial).padStart(2, '0')}`,
        type: 'satellite',
        start: true,
        node_index: 0,
        extra: {
          orbit_layer: 'LEO',
          orbit_plane: String(plane + 1),
          physical_mapping: 'Raspberry Pi'
        }
      })
    }
  }

  for (let index = 0; index < 3; index += 1) {
    result.push({
      instance_id: `geo-${String(index + 1).padStart(3, '0')}`,
      name: `高轨管控星-${index + 1}`,
      type: 'satellite',
      start: true,
      node_index: 0,
      extra: {
        orbit_layer: 'GEO',
        physical_mapping: 'Jetson',
        role: 'AIOps Coordinator'
      }
    })
  }

  groundStations.forEach((station) => {
    result.push({
      instance_id: station.id,
      name: station.name,
      type: 'ground-station',
      start: true,
      node_index: 0,
      extra: {}
    })
  })

  return result
}

function buildLinks() {
  const result: Link[] = []
  let linkSerial = 1

  for (let plane = 0; plane < 3; plane += 1) {
    const base = plane * 5 + 1
    for (let index = 0; index < 5; index += 1) {
      const start = `sat-${String(base + index).padStart(3, '0')}`
      const end = `sat-${String(base + ((index + 1) % 5)).padStart(3, '0')}`
      result.push({
        link_id: `link-${String(linkSerial).padStart(3, '0')}`,
        type: 'isl',
        enable: true,
        connect_instance: [start, end],
        node_index: 0
      })
      linkSerial += 1
    }
  }

  const geoIds = ['geo-001', 'geo-002', 'geo-003']
  result.push(
    {
      link_id: `link-${String(linkSerial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: [geoIds[0], geoIds[1]],
      node_index: 0
    },
    {
      link_id: `link-${String(linkSerial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: [geoIds[1], geoIds[2]],
      node_index: 0
    },
    {
      link_id: `link-${String(linkSerial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: [geoIds[2], geoIds[0]],
      node_index: 0
    }
  )

  groundStations
    .filter((item) => item.id !== 'ground-mcs-001')
    .forEach((station) => {
      result.push({
        link_id: `link-${String(linkSerial++).padStart(3, '0')}`,
        type: 'ground-backhaul',
        enable: true,
        connect_instance: [station.id, 'ground-mcs-001'],
        node_index: 0
      })
    })

  // 地面基站 ↔ 低轨卫星 上下行链路 (ground-uplink)
  // 规则：每个地面站按当前经纬度与所有 LEO 卫星起始经纬度的球面距离，选最近的 2 颗 LEO 建立链路
  const leoSatPositions: Array<{ id: string; lat: number; lon: number }> = []
  for (let plane = 0; plane < 3; plane += 1) {
    for (let index = 0; index < 5; index += 1) {
      const serial = plane * 5 + index + 1
      leoSatPositions.push({
        id: `sat-${String(serial).padStart(3, '0')}`,
        lat: leoLatitudes[index],
        lon: leoPlaneLongitudes[plane] + index * 14
      })
    }
  }

  const toRad = (d: number) => (d * Math.PI) / 180
  const greatCircleDeg = (aLat: number, aLon: number, bLat: number, bLon: number) => {
    const la1 = toRad(aLat)
    const la2 = toRad(bLat)
    const dLa = la2 - la1
    const dLo = toRad(bLon - aLon)
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLo / 2) ** 2
    return 2 * Math.asin(Math.min(1, Math.sqrt(h)))
  }

  groundStations.forEach((station) => {
    const ranked = leoSatPositions
      .map((sat) => ({
        id: sat.id,
        d: greatCircleDeg(station.latitude, station.longitude, sat.lat, sat.lon)
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)

    ranked.forEach((sat) => {
      result.push({
        link_id: `link-${String(linkSerial++).padStart(3, '0')}`,
        type: 'ground-uplink',
        enable: true,
        connect_instance: [station.id, sat.id],
        node_index: 0
      })
    })
  })

  return result
}


export const mockInstances: Instance[] = buildInstances()
export const mockLinks: Link[] = buildLinks()

export const mockInstanceResources: Record<string, InstanceResource> = Object.fromEntries(
  mockInstances.map((instance, index) => {
    const isGround = instance.type === 'ground-station'
    const isGeo = instance.instance_id.startsWith('geo-')
    const cpu = isGround ? 18 + (index % 4) * 2 : isGeo ? 28 + (index % 3) * 4 : 34 + (index % 5) * 5
    const memGb = isGround ? 1.5 : isGeo ? 3.6 : 2.4
    return [
      instance.instance_id,
      {
        cpu_usage: cpu,
        mem_byte: memGb * 1024 * 1024 * 1024,
        swap_mem_byte: 0.25 * 1024 * 1024 * 1024
      }
    ]
  })
)

export const mockLinkResources: Record<string, LinkResource> = Object.fromEntries(
  mockLinks.map((link, index) => {
    const isGroundBackhaul = link.type === 'ground-backhaul'
    const isGeoBackbone = link.type === 'geo-backbone'
    const baseBps = isGroundBackhaul ? 420_000_000 : isGeoBackbone ? 260_000_000 : 120_000_000

    return [
      link.link_id,
      {
        recv_bps: baseBps + index * 320_000,
        send_bps: baseBps - 6_000_000 + index * 280_000,
        recv_pps: isGroundBackhaul ? 94_000 : 58_000,
        send_pps: isGroundBackhaul ? 88_000 : 54_000,
        recv_err_pps: 0,
        send_err_pps: 0,
        recv_drop_pps: 1,
        send_drop_pps: 1
      }
    ]
  })
)

export const mockPositions: PositionMap = (() => {
  const result: PositionMap = {}

  for (let plane = 0; plane < 3; plane += 1) {
    for (let index = 0; index < 5; index += 1) {
      const serial = plane * 5 + index + 1
      result[`sat-${String(serial).padStart(3, '0')}`] = {
        latitude: leoLatitudes[index],
        longitude: leoPlaneLongitudes[plane] + index * 14,
        altitude: 1_650_000
      }
    }
  }

  result['geo-001'] = { latitude: 0, longitude: 0, altitude: 35_786_000 }
  result['geo-002'] = { latitude: 0, longitude: 120, altitude: 35_786_000 }
  result['geo-003'] = { latitude: 0, longitude: -120, altitude: 35_786_000 }

  groundStations.forEach((station) => {
    result[station.id] = {
      latitude: station.latitude,
      longitude: station.longitude,
      altitude: 50
    }
  })

  return result
})()


