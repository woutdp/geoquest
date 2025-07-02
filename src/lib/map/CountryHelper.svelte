<script lang="ts">
    import {greyOutFoundFeatures} from '$lib/store'

    export let data
    export let foundFeatures
    export let path
    export let activeFeatures
    export let clickCountryHandler
    export let countryFocusedHandler
    export let strokeWidth

    let feature = data[0]
    let topojson = data[1]

    $: found = foundFeatures.includes(topojson)
    $: disabled = !activeFeatures.includes(topojson)
    $: isGreyedOut = (found && $greyOutFoundFeatures) || disabled
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<path
    on:mouseover={() => countryFocusedHandler(topojson)}
    on:mouseleave={() => countryFocusedHandler()}
    on:click={() => clickCountryHandler(topojson)}
    style="stroke-width: {strokeWidth}px"
    class={isGreyedOut ? 'opacity-0' : `hover:opacity-90 fill-transparent stroke-white hover:fill-white cursor-pointer`}
    d={path(feature.properties.center)}
/>
