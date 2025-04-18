<script lang="ts">
    import {chosenMap,clientX, mousePos} from '$lib/store'

    export let focusedCountry
    export let unfoundFeatures

    let h
    let show

    $: ({x, y} = $mousePos)
    $: show = focusedCountry && !unfoundFeatures.includes(focusedCountry) && $clientX > 700 && focusedCountry?.properties?.info
</script>

{#if show}
    <span bind:clientHeight={h} class="fixed z-50 inline-block px-2 py-1 font-bold rounded-md pointer-events-none bg-background-dark whitespace-nowrap" style:left="{x}px" style:top="{y}px">
    {#each Object.entries(focusedCountry?.properties?.info) as [key, value]}
        {#if value }<div>{`${key}: ${value}`}</div>{/if}
    {/each}
    </span>
{/if}
