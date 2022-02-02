<script lang="ts">
    import _ from 'lodash'
    import {fade} from 'svelte/transition'

    import {tags} from '$lib/store'
    import {getCountriesFromTags} from '$lib/utils'

    export let newGame
    export let toggleMenu

    $: selectedTags = _($tags)
        .filter(tag => tag.checked)
        .map(tag => tag.name)
        .value()
    $: unselected = _($tags)
        .filter(tag => !tag.checked)
        .map(tag => tag.name)
        .value()

    $: disabled = selectedTags.length === 0
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-4 min-h-[300px] justify-between">
        <div class="flex flex-wrap">
            {#each $tags as tag}
                <input id={tag.name} type="checkbox" hidden bind:checked={tag.checked} />
            {/each}
            {#each unselected as tag}
                <div class="flex justify-center mb-2 mr-2">
                    <label
                        for={tag}
                        type="checkbox"
                        class="px-3 py-1 text-sm font-semibold uppercase transition-all border-2 rounded-full cursor-pointer whitespace-nowrap text-background bg-foreground hover:border-background last:mr-0 border-foreground"
                    >
                        {tag}
                    </label>
                </div>
            {/each}
        </div>
        <div>
            {#if selectedTags.length > 0}
                <div in:fade={{duration: 200}} class="flex flex-wrap p-2 rounded-md bg-foreground">
                    {#each selectedTags as tag}
                        <div class="flex justify-center my-1 mr-2">
                            <label
                                for={tag}
                                type="checkbox"
                                class="px-3 py-1 text-sm font-semibold uppercase transition-all border-2 rounded-full cursor-pointer whitespace-nowrap text-background bg-foreground-light hover:border-background last:mr-0 border-foreground"
                            >
                                {tag}
                            </label>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    <button
        on:click={() => {
            newGame({countries: getCountriesFromTags(selectedTags)})
            toggleMenu()
        }}
        {disabled}
        class="p-2 mb-2 text-xl font-bold transition-colors rounded-md disabled:bg-red disabled:hover:text-black disabled:cursor-not-allowed bg-foreground-light text-background hover:bg-green outline outline-4"
    >
        START
    </button>
</div>
