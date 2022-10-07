import * as turf from '@turf/turf'
import _ from 'lodash'
import {get} from 'svelte/store'

import achievements from '$lib/assets/data/achievements.json'
import {notifications, save} from '$lib/store'
import {geometries, loadedMap} from '$lib/store'

export const CORRECT = 'correct'
export const WRONG = 'wrong'
export const ALREADY_GUESSED = 'already_guessed'
export const COUNTRY_COLORS = ['fill-blue', 'fill-yellow', 'fill-green', 'fill-red']

export function getCountryColor(feature) {
    return COUNTRY_COLORS[feature?.properties?.color] || 'fill-[#F0F]'
}

export function antimeridian(featureCollection) {
    featureCollection.features = _.map(featureCollection.features, feature => {
        const c = feature.geometry.coordinates
        if (c[0] < 0) feature.geometry.coordinates = [c[0] + 360, c[1]]
        return feature
    })
    return featureCollection
}

export function buffer(feature) {
    if (feature === null) return ''
    return turf.concave(antimeridian(turf.explode(turf.buffer(feature, 40))), {units: 'kilometers', maxEdge: 300})
}

export function dictToArray(d) {
    return _.map(d, (v, k) => {
        return {...v, name: k}
    })
}

export function getFeaturesFromTags(tags) {
    return _(dictToArray(Object.values(get(loadedMap).data)[0]))
        .filter(feature => _.intersection(feature.tags, tags).length > 0)
        .map(feature => feature.name)
        .compact()
        .uniq()
        .intersection(getActiveCountries())
        .value()
}

export function getActiveCountries() {
    return _(get(geometries))
        .map(country => country.properties.name)
        .value()
}

export function getGeojsonByName(geojson, name) {
    return _(geojson.features).find(['properties.name', name])
}

export function achieveAchievement(slug) {
    const achievement = _(achievements).find({slug})
    const saveFile = get(save)

    if (!saveFile.achievements.includes(slug)) {
        saveFile.achievements = _([...saveFile.achievements, achievement.slug])
            .uniq()
            .value()
        save.set(saveFile)
        const notification = {type: 'achievement', title: achievement.name, description: achievement.description}
        notifications.set([...get(notifications), notification])
        window.setTimeout(
            () =>
                notifications.set(
                    _(get(notifications))
                        .filter(n => n !== notification)
                        .value()
                ),
            4000
        )
    }
}

export function processWorldAchievements(features) {
    if (get(loadedMap).name !== 'World') return
    const achievementsWithTags = _(achievements)
        .filter(achievement => achievement?.extra?.tags)
        .value()

    for (const achievement of achievementsWithTags) {
        if (_.difference(getFeaturesFromTags(achievement.extra.tags), features).length === 0) achieveAchievement(achievement.slug)
    }
}
