import {topojson} from '$lib/store'
import {preprocessTopojson} from '$lib/utils'

export async function loadMap(map) {
    topojson.set(preprocessTopojson(await map.topojson))
}
