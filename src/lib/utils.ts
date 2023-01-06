import * as turf from '@turf/turf'
import _ from 'lodash'
import {get} from 'svelte/store'

import achievements from '$lib/assets/data/achievements.json'
import {notifications, save} from '$lib/store'
import {countryColors, geometries, loadedMap} from '$lib/store'

export const CORRECT = 'correct'
export const WRONG = 'wrong'
export const ALREADY_GUESSED = 'already_guessed'

export function getCountryColor(feature, countryColors) {
    return countryColors[feature?.properties?.color] || 'fill-[#F0F]'
}

export function shuffleColors() {
    countryColors.set(_.shuffle(get(countryColors)))
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

export async function pushNotification(message: string) {
    const registration = await navigator.serviceWorker.getRegistration()

    if ('showTrigger' in Notification.prototype) {
        console.log('supported')
        /* Notification Triggers supported */
    } else {
        console.log('unsupported')
    }


    window.setTimeout(() => (
        registration.showNotification(
            'GeoQuest',
            {
            //   tag: timestamp, // a unique ID
            body: message, // content of the push notification
            // timestamp: timestamp, // set the time for the push notification
            //   data: {
                // url: window.location.href, // pass the current url to the notification
            //   },
            //   badge: 'https://geoquest.wout.space/favicon.png',
              icon: 'https://geoquest.wout.space/favicon.png'
            }
        )
        // new Notification('GeoQuest', {body: message, icon: 'https://geoquest.wout.space/favicon.png'})
    ), 1)
    // const registration = await navigator.serviceWorker.getRegistration()
    // // console.log(serviceWorker)
    // const timestamp = new Date().getTime() + 5 * 1000 // now plus 5000ms

    // try {
    //     await registration.periodicSync.register('get-latest-news', {
    //         minInterval: 5 * 1000
    //     })
    // } catch (error) {
    //     console.error('Periodic Sync could not be registered!')
    //     console.error(error)
    // }

    // registration.showNotification(
    //     'GeoQuest',
    //     {
    //     //   tag: timestamp, // a unique ID
    //       body: message, // content of the push notification
    //       timestamp: timestamp, // set the time for the push notification
    //     //   data: {
    //         // url: window.location.href, // pass the current url to the notification
    //     //   },
    //     //   badge: 'https://geoquest.wout.space/favicon.png',
    //     //   icon: 'https://geoquest.wout.space/favicon.png'
    //     }
    //   );

    // return new Notification('GeoQuest', {body: message, icon: 'https://geoquest.wout.space/favicon.png'})
}
