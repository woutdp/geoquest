<script lang="ts">
    import {fly, scale} from 'svelte/transition'

    import IconCake from '$lib/icons/IconCake.svelte'
    import IconCheckmark from '$lib/icons/IconCheckmark.svelte'
    import IconMistake from '$lib/icons/IconMistake.svelte'
    import {save} from '$lib/store'

    export let mistakes
    export let correct
    export let originalToFind
    export let gameConfiguration

    $: perfectScore = originalToFind.length === correct
</script>

<div class="flex flex-row justify-start p-4 mb-8 text-xl border-4 rounded-md shadow-md bg-background border-background-dark ring-4 ring-green">
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
            <span class="ml-1"
                >{mistakes} mistake{#if mistakes !== 1}s{/if}</span
            >
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
    {#if perfectScore}
        <div in:scale={{delay: 1200}} class="flex items-center justify-end text-foreground">
            <span class="animate-wiggle"><IconCake /></span>
        </div>
    {/if}
</div>
