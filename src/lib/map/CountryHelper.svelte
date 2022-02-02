<script lang="ts">
    export let data
    export let foundFeatures
    export let path
    export let unfoundFeatures
    export let clickCountryHandler
    export let countryFocusedHandler
    export let strokeWidth

    let feature = data[0]
    let topojson = data[1]

    $: found = foundFeatures.includes(topojson)
    $: disabled = !unfoundFeatures.includes(topojson)
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<path
    on:mouseover={() => countryFocusedHandler(topojson)}
    on:mouseleave={() => countryFocusedHandler()}
    on:click={() => clickCountryHandler(topojson)}
    style="stroke-width: {strokeWidth}px"
    class={found || disabled ? 'opacity-0' : `hover:opacity-90 fill-transparent stroke-white hover:fill-white cursor-pointer`}
    d={path(feature.properties.center)}
/>
