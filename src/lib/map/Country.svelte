<script lang="ts">
    import {getCountryColor} from '$lib/utils'

    export let data
    export let foundFeatures
    export let unfoundFeatures
    export let path
    export let clickCountryHandler
    export let countryFocusedHandler

    let feature = data[0]
    let topojson = data[1]
    let color = getCountryColor(topojson)

    $: found = foundFeatures.includes(topojson)
    $: disabled = !unfoundFeatures.includes(topojson)
</script>

{#key found}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <path
        on:mouseover={() => countryFocusedHandler(topojson)}
        on:mouseleave={() => countryFocusedHandler()}
        on:click={() => clickCountryHandler(topojson)}
        class={found || disabled ? 'fill-gray' : `${color} hover:fill-foreground cursor-pointer`}
        d={path(feature)}
    />
{/key}
