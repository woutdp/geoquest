<script lang="ts">
    import * as turf from '@turf/turf'

    import {countryColors} from '$lib/store'
    import {antimeridian, buffer, getCountryColor} from '$lib/utils'

    export let data
    export let foundFeatures
    export let path
    export let unfoundFeatures
    export let clickCountryHandler
    export let countryFocusedHandler
    export let strokeWidth
    export let scale

    let feature = data[0]
    let topojson = data[1]
    let islandHelpersMargin = data[0]?.properties.islandHelpersMargin;

    $: found = foundFeatures.includes(topojson)
    $: disabled = !unfoundFeatures.includes(topojson)
    $: color = getCountryColor(feature, $countryColors)
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<path
    on:mouseover={() => countryFocusedHandler(topojson)}
    on:mouseleave={() => countryFocusedHandler()}
    on:click={() => clickCountryHandler(topojson)}
    style="stroke-width: {strokeWidth}px"
    class="
        stroke-white
        {found || disabled
        ? 'fill-transparent opacity-20'
        : `
            cursor-pointer
            ${color}
            opacity-40
            hover:opacity-90
            hover:fill-foreground
        `}
    "
    stroke-dasharray="1,{0.6 * scale}"
    stroke-linecap="round"
    d={path(buffer(turf.concave(antimeridian(turf.explode(feature)), {units: 'kilometers', maxEdge: 100}), islandHelpersMargin))}
/>
