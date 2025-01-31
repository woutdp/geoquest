<script lang="ts">
    import emojiFlags from 'emoji-flags'

    import {chosenMap,clientX, mousePos} from '$lib/store'
    import {t} from '$lib/translations'

    export let focusedCountry
    export let unfoundFeatures

    let h
    let show

    $: ({x, y} = $mousePos)
    $: flag = focusedCountry?.properties?.ISO2 ? emojiFlags.countryCode(focusedCountry?.properties?.ISO2).emoji : undefined
    $: show = focusedCountry && !unfoundFeatures.includes(focusedCountry) && $clientX > 700
</script>

{#if show}
    <span bind:clientHeight={h} class="fixed z-50 inline-block px-2 py-1 font-bold rounded-md pointer-events-none bg-background-dark whitespace-nowrap" style:left="{x}px" style:top="{y - h}px">
        {#if flag}{flag}{/if}
        {$t(`quests/${chosenMap.id}/elements.${focusedCountry?.properties?.name}`)}
    </span>
{/if}
