<script lang="ts">
    import _ from 'lodash'
    import {fly} from 'svelte/transition'

    import IconCheckmark from '$lib/icons/IconCheckmark.svelte'
    import IconMistake from '$lib/icons/IconMistake.svelte'
    import IconShare from '$lib/icons/IconShare.svelte'
    import {save} from '$lib/store'

    export let mistakes
    export let correct
    export let originalToFind
    export let gameConfiguration

    let copytext = 'Copy to clipboard'

    $: perfectScore = originalToFind.length === correct

    function copyToClipboard() {
        copytext = 'Copied!'
        const emojis = _($save.dailyQuestProgress.progress)
            .map(guess => (guess.length === 1 ? '🟩' : '🟥'))
            .value()
            .join('')

        navigator.clipboard.writeText(`GeoQuest #${$save.dailyQuestProgress.day} ${correct}/${$save.dailyQuestProgress.progress.length}\n${emojis}\n\nhttps://geoquest.spirio.fr`)
    }
</script>

<div class="flex flex-col justify-start p-4 mb-8 text-xl border-4 rounded-md shadow-md bg-background border-background-dark ring-4 ring-green">
    <div class="flex flex-row flex-1 w-full">
        <div class="flex flex-col flex-1 w-full">
            <span class="flex items-center justify-start mb-2 text-foreground">
                {#if gameConfiguration.mode === 'dailyQuest'}
                    <p class="font-black">Daily Quest <span class="font-black">{$save.dailyQuestProgress.day}</span></p>
                {:else}
                    {originalToFind.length}
                    {#if originalToFind.length === 1}country{:else}countries{/if}:
                {/if}
            </span>
            <span in:fly={{x: -10, delay: 400}} class="flex items-center justify-start text-red">
                <IconMistake />
                <span class="ml-1">
                    {mistakes} mistake{#if mistakes !== 1}s{/if}
                </span>
            </span>
            <span in:fly={{x: -10, delay: 800}} class="flex items-center justify-start text-green">
                <IconCheckmark />
                {#if perfectScore}
                    <span class="ml-1">All found!</span>
                {:else}
                    <span class="ml-1">{correct} of {originalToFind.length} correct</span>
                {/if}
            </span>
        </div>
    </div>
    {#if gameConfiguration.mode === 'dailyQuest'}
        <button on:click={copyToClipboard} class="flex group relative bg-background-dark text-foreground rounded mt-4 justify-center items-center p-2 font-bold">
            <IconShare /><span class="ml-2">Share</span>
            <span
                class="absolute hidden group-hover:flex -top-2 -translate-y-full rounded-lg text-center text-foreground text-base py-2 px-4 bg-background-dark justify-center after:content-[''] after:absolute  after:top-[100%] after:border-8 after:border-x-transparent after:border-b-transparent after:border-background-dark"
            >
                {copytext}
            </span>
        </button>
    {/if}
</div>
