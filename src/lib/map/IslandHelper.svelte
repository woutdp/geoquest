<script lang="ts">
    import * as turf from '@turf/turf'

    import {countryColors, greyOutFoundFeatures} from '$lib/store'
    import {antimeridian, buffer, getCountryColor} from '$lib/utils'

    export let data
    export let foundFeatures
    export let path
    export let activeFeatures
    export let clickCountryHandler
    export let countryFocusedHandler
    export let strokeWidth
    export let scale

    let feature = data[0]
    let topojson = data[1]

    $: found = foundFeatures.includes(topojson)
    $: disabled = !activeFeatures.includes(topojson)
    $: isGreyedOut = (found && $greyOutFoundFeatures) || disabled
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
        {isGreyedOut
        ? 'fill-transparent opacity-20'
        : `
            cursor-pointer
            ${color}
            opacity-40
            hover:opacity-90
            hover:fill-foreground
        `}
    "
    stroke-dasharray="1,{0.006 * scale}"
    stroke-linecap="round"
    d={path(buffer(turf.concave(antimeridian(turf.explode(feature)), {units: 'kilometers', maxEdge: 100})))}
/>
