<script lang="ts">
    import {countryColors, greyOutFoundFeatures} from '$lib/store'
    import {getCountryColor} from '$lib/utils'

    export let data
    export let foundFeatures
    export let activeFeatures
    export let path
    export let clickCountryHandler
    export let countryFocusedHandler

    let feature = data[0]
    let topojson = data[1]
    let type = data[0]?.properties.type
    let style = data[0]?.properties.style

    let fill = (isGreyedOut, found, disabled, color, geometryType) => {
        if (!isGreyedOut) return `${color} hover:fill-foreground cursor-pointer`

        if (type == 'basemap') return 'fill-gray stroke-white stroke-[0.1]'
        else if (found) return 'fill-gray stroke-white stroke-[0.1]'
        else if (disabled) return `fill-gray stroke-white ${geometryType == 'Point' ? 'stroke-disabled_point' : 'stroke-[0.1]'}`
        else return `${color} hover:fill-foreground cursor-pointer`
    }

    $: color = getCountryColor(topojson, $countryColors)
    $: found = foundFeatures.includes(topojson)
    $: disabled = !activeFeatures.includes(topojson)
    $: isGreyedOut = (found && $greyOutFoundFeatures) || disabled
</script>

{#key found}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <path
        on:mouseover={() => countryFocusedHandler(topojson)}
        on:mouseleave={() => countryFocusedHandler()}
        on:click={() => clickCountryHandler(topojson)}
        class={fill(isGreyedOut, found, disabled, color, feature.geometry.type)}
        {style}
        d={path(feature)}
    />
{/key}
