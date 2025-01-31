<script lang="ts">
    import _ from 'lodash'

    // import JSONTree from 'svelte-json-tree'
    import {loadMap} from '$lib/map'
    import {day, initialSave, maps, projection, projections, save, showDebug, time} from '$lib/store'

    export let lastFocusedCountry
    export let toFind
    export let unfoundFeatures
    export let mistakesThisGuess

    let mapId = 0
</script>

<div class="absolute z-50 flex flex-col max-w-2xl bg-background-dark" class:hidden={!$showDebug}>
    <p>{$time}</p>
    <p>{$day}</p>
    <p>Mistakes this guess: {mistakesThisGuess}</p>
    <select class="bg-background-dark" bind:value={$projection}>
        {#each projections as projection}
            <option value={projection.func}>{projection.name}</option>
        {/each}
    </select>
    <select class="bg-background-dark" bind:value={mapId} on:change={() => loadMap(maps[mapId])}>
        {#each maps as map, i}
            <option value={i}>{map.name}</option>
        {/each}
    </select>
    <!-- <JSONTree value={lastFocusedCountry?.properties} />
    <p>
        ToFind: <JSONTree
            value={_(toFind)
                .map(f => f.properties.name)
                .value()}
        />
    </p>
    <p>
        Unfound: <JSONTree
            value={_(unfoundFeatures)
                .map(f => f.properties.name)
                .value()}
        />
    </p>
    <JSONTree value={$mousePos} />
    <JSONTree value={{x: $clientX, y: $clientY}} />
    <JSONTree value={$save} />
    <JSONTree value={$notifications} /> -->
    <button on:click={() => ($save = {...initialSave})} class="mt-4 rounded-md bg-foreground text-background hover:bg-foreground-light">Reset Savefile</button>
</div>
