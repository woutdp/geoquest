<script lang="ts">
    import {chosenMap, save} from '$lib/store'
    import {getTimeStringFromMs} from '$lib/utils'

    export let gameConfiguration

    $: leaderboardEntries = $save.localLeaderboard[`${chosenMap.id}-${gameConfiguration.countries}`] ?? []
</script>

<ol role="list">
    {#each leaderboardEntries as entry, i}
        <li class="flex px-8 py-2 mb-2 text-xl text-black rounded-md bg-foreground-light">
            <span class="opacity-50 mr-2">{i + 1}.</span>
            <span class="grow">{getTimeStringFromMs(entry.timeMs, true)}</span>
            <span class="">{entry.correct}/{entry.total}</span>
        </li>
    {:else}
        <li class="text-center font-bold mb-8">No higscores yet</li>
    {/each}
</ol>
