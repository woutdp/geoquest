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
        class={isGreyedOut ? 'fill-gray' : `${color} hover:fill-foreground cursor-pointer`}
        d={path(feature)}
    />
{/key}
