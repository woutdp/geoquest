import * as turf from '@turf/turf'
import bboxCalc from 'geojson-bbox'
import _ from 'lodash'
import * as topojsonClient from 'topojson-client'

import {loadedMap as loadedMapStore} from '$lib/store'

export async function loadMap(map) {
    if (map?.loaded) {
        loadedMapStore.set(map)
        return
    }

    const loadedMap = map
    loadedMap.topojson = await loadedMap.topojson

    let json = loadedMap.topojson

    for (const [key, dataPromise] of Object.entries(map.data)) {
        const data = (await dataPromise).default
        loadedMap.data[key] = data
        json = preprocessTopojson(json, key, data, loadedMap)
    }

    map.loaded = true
    loadedMapStore.set(loadedMap)
}

function preprocessTopojson(json, dataKey, data, mapObject) {
    const geometriesByName = _.keyBy(json.objects[dataKey].geometries, 'properties.name')
    const mergeGroups = _(data)
        .pickBy(value => _.has(value, 'belongsTo'))
        .map((value, key) => {
            value.name = key
            return value
        })
        .groupBy('belongsTo')
        .value()

    for (const [key, value] of Object.entries(mergeGroups)) {
        const names = _.map(value, v => v.name)
        const toMerge = _.filter(geometriesByName, (v, key) => names.includes(key))
        const geometries = [...toMerge, geometriesByName[key]]
        const merged = topojsonClient.mergeArcs(json, geometries)

        names.forEach(element => {
            delete geometriesByName[element]
        })

        merged.properties = geometriesByName[key].properties
        geometriesByName[key] = merged
    }

    json.objects[dataKey].geometries = Object.values(geometriesByName)
    json.objects[dataKey].geometries = _.filter(json.objects[dataKey].geometries, geometry => {
        // Filter out some countries, not the best way to handle but fine for now
        if (geometry.properties.name === 'Antarctica') return false
        if (geometry.properties.name === 'Spratly Islands') return false
        if (geometry.properties.name === 'Scarborough Shoal') return false
        return true
    })

    const neighbors = topojsonClient.neighbors(json.objects[dataKey].geometries)
    const geojson = topojsonClient.feature(json, json.objects[dataKey])

    json.objects[dataKey].geometries = _.map(json.objects[dataKey].geometries, (geometry, i) => {
        const feature = geojson.features[i]
        const countryData = data[geometry.properties.name]
        geometry.properties = {...geometry.properties, ...countryData}
        geometry.properties.neighbors = _.map(neighbors[i], n => geojson.features[n].properties.name)
        geometry.properties.isIsland = geometry.properties.neighbors.length === 0
        geometry.properties.squareKm = countryData?.squareKm || Math.floor(turf.area(feature) / 1000000)
        if (countryData?.center) geometry.properties.center = {type: 'Feature', geometry: {type: 'Point', coordinates: countryData?.center}, properties: {}}
        else geometry.properties.center = turf.center(feature)

        const bbox = bboxCalc(feature)
        const xs = Math.abs(bbox[0] - bbox[2])
        const ys = Math.abs(bbox[1] - bbox[3])


        if (countryData?.helper || (mapObject?.helpers !== false && countryData?.helper !== false && !geometry.properties.isIsland && geometry.properties.squareKm < 6000 && xs < 0.7 && ys < 0.7)) geometry.properties.helper = true
        else geometry.properties.helper = false

        return geometry
    })

    return json
}
