<script lang="ts">
    import IconMistake from '$lib/icons/IconMistake.svelte'
    import {chosenMap, save} from '$lib/store'
    import {getTimeStringFromMs} from '$lib/utils'

    export let gameConfiguration

    $: leaderboardEntries = ($save.localLeaderboard[`${chosenMap.id}-${gameConfiguration.countries}`] ?? [])
        .sort(function (a, b) {
            if (a.correct !== b.correct) return b.correct - a.correct
            return a.timeMs - b.timeMs
        })
        .slice(0, 10)

    function indexClass(index) {
        if (index === 0) return 'bg-[#FED700] text-2xl'
        if (index === 1) return 'bg-[#C0C0C0] text-xl'
        if (index === 2) return 'bg-[#CD8032] text-lg'
        return 'text-sm'
    }
</script>

<ol role="list" class="bg-foreground p-2 flex flex-col gap-1 rounded-lg">
    {#each leaderboardEntries as entry, i}
        <li class="flex items-center gap-2 mx-4 py-2 text-xl text-black rounded-md">
            <span class="opacity-50 min-w-8">{i + 1}.</span>
            <span class="{indexClass(i)} py-1 px-2 rounded">{getTimeStringFromMs(entry.timeMs, true)}</span>
            {#if entry.correct !== entry.total}
                <span class="flex bg-red items-center justify-center gap-1 ml-2 px-2 py-1 rounded">
                    {entry.total - entry.correct}
                    <IconMistake />
                </span>
            {/if}
        </li>
    {:else}
        <li class="text-center font-bold m-2 text-2xl">No highscores yet</li>
    {/each}
</ol>
