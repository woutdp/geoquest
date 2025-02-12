<script lang="ts">
    import emojiFlags from 'emoji-flags'
    import {onMount} from 'svelte'
    import {quartOut} from 'svelte/easing'
    import {fly, scale} from 'svelte/transition'

    import IconArrowUp from '$lib/icons/IconArrowUp.svelte'
    import IconCheckmark from '$lib/icons/IconCheckmark.svelte'
    import IconFullScreen from '$lib/icons/IconFullScreen.svelte'
    import IconMenu from '$lib/icons/IconMenu.svelte'
    import IconMistake from '$lib/icons/IconMistake.svelte'
    import {chosenMap, noPanNoZoom, showFlagOnly, showTimer} from '$lib/store'
    import {t} from '$lib/translations'
    import BuyMeACoffee from '$lib/ui/BuyMeACoffee.svelte'
    import Menu from '$lib/ui/menu/Menu.svelte'
    import Notifications from '$lib/ui/Notifications.svelte'
    import {achieveAchievement, getTimeStringFromMs} from '$lib/utils'
    import IconLock from '$lib/icons/IconLock.svelte'
    import IconTimer from '$lib/icons/IconTimer.svelte'

    export let foundFeatures
    export let originalToFind
    export let questionFeature
    export let streak
    export let timeMs
    export let restart
    export let showMenu = false
    export let mistakes
    export let correct
    export let interfaceLoaded = false
    export let showWinScreen
    export let arrowRotation: undefined | number
    export let arrowTimeout: number
    export let map

    let rotateFlag = false

    $: showTop = Boolean(questionFeature)
    $: flag = questionFeature?.properties?.ISO2 ? emojiFlags.countryCode(questionFeature?.properties?.ISO2).emoji : undefined

    function toggleFullScreen() {
        const html = document.querySelector('#svelte')
        if (!document.fullscreenElement && html.requestFullscreen) html.requestFullscreen()
        else if (document.exitFullscreen) document.exitFullscreen()
    }

    function toggleSpin() {
        if (!rotateFlag) {
            rotateFlag = true
            window.setTimeout(() => (rotateFlag = false), 600)
        }
    }

    function toggleMenu() {
        showMenu = !showMenu
    }

    export function triggerArrow(bearing?: number) {
        clearTimeout(arrowTimeout)
        arrowRotation = bearing ? [360, 45, 90, 135, 180, 225, 270, 315][Math.round(bearing / 45) % 8] : undefined
        arrowTimeout = window.setTimeout(() => (arrowRotation = undefined), 4000)
    }

    onMount(async () => {
        window.setTimeout(() => (interfaceLoaded = true), 200)
    })
</script>

<div class="container relative">
    {#if showTop}
        <div transition:fly|global={{y: -100, duration: 500}} class="container absolute z-30 flex flex-col items-center justify-center mt-4 pointer-events-none">
            <div class="flex">
                <div class="flex py-2 rounded-md shadow-md pointer-events-auto bg-background-dark">
                    <span class="flex items-center justify-center mx-2 text-red">
                        <IconMistake />
                        {#key mistakes}
                            <span in:scale|global={{start: 1.5}} class="ml-1"> {mistakes}</span>
                        {/key}
                    </span>
                    <span class="flex items-center justify-center mx-2 text-green">
                        <IconCheckmark />
                        {#key correct}
                            <span in:scale|global={{start: 1.5}} class="ml-1">{correct}</span>
                        {/key}
                    </span>
                    {#if $showTimer}
                        <span class="flex items-center justify-center mx-2 text-foreground">
                            <IconTimer />
                            {#key timeMs}
                                <span class="ml-1">{getTimeStringFromMs(timeMs)}</span>
                            {/key}
                        </span>
                    {/if}
                    <span class="mx-5 whitespace-nowrap">{foundFeatures.length} / {originalToFind.length}</span>
                    {#key streak}
                        {#if streak > 1}
                            <span class="flex items-center justify-center mr-2 font-bold">
                                <span in:scale|global={{start: 1.5}} class="ml-1">{streak}x</span>
                            </span>
                        {/if}
                    {/key}
                </div>
            </div>
            <div transition:fly|global={{y: 20, duration: 500, delay: 500}}>
                {#key questionFeature}
                    <div class="flex justify-center mt-4">
                        <span
                            class="z-30 flex items-center justify-center px-2 py-2 mx-4 font-serif text-3xl font-black text-center rounded-md shadow-md pointer-events-auto sm:px-4 sm:text-4xl bg-foreground text-background"
                            in:fly|global={{y: 20}}
                        >
                            {#if flag}
                                <div
                                    class="select-none cursor-pointer {$showFlagOnly ? 'text-5xl' : 'mr-2 sm:mr-3'} {rotateFlag ? 'animate-double-spin' : ''}"
                                    on:click={() => {
                                        toggleSpin()
                                        achieveAchievement('spin-flag')
                                    }}
                                >
                                    {flag}
                                </div>
                            {/if}
                            {#if !$showFlagOnly}
                                {$t(`quests/${chosenMap.id}/elements.${questionFeature?.properties?.name}`)}
                            {/if}
                        </span>
                    </div>
                {/key}
            </div>
            {#if arrowRotation}
                <div
                    in:fly|global={{y: -80, duration: 200}}
                    out:fly|global={{y: 20, duration: 2500, easing: quartOut}}
                    class="z-20 flex items-center justify-center w-10 h-10 mt-10 text-xl font-black rounded-full pointer-events-auto bg-background-dark"
                >
                    <div style="transform: rotate({arrowRotation}deg);" class="transition-all rounded-full shadow-md bg-background-dark">
                        <IconArrowUp />
                    </div>
                </div>
            {/if}
        </div>
    {/if}
    <div class="container absolute z-40 items-start justify-between hidden mt-4 pointer-events-none md:flex">
        <div class="flex flex-col font-black rounded-md shadow-md pointer-events-auto text-md text-foreground-light bg-background-dark">
            <div class="relative">
                <input id="noPanNoZoom" class="absolute opacity-0 peer cursor-pointer" type="checkbox" bind:checked={$noPanNoZoom} />
                <label
                    for="noPanNoZoom"
                    class="flex items-center justify-center w-10 h-10 transition-all duration-75 rounded-md hover:text-xl hover:text-foreground hover:bg-background peer-checked:bg-foreground peer-checked:text-background cursor-pointer"
                    ><span class="sr-only">{$t('ui.noPanNoZoom')}</span><IconLock /></label
                >
            </div>
            <button
                on:click={() => map.zoomIn()}
                class="flex items-center justify-center w-10 h-10 transition-all duration-75 rounded-md hover:text-xl hover:text-foreground hover:bg-background disabled:opacity-50 disabled:pointer-events-none"
                disabled={$noPanNoZoom}>+</button
            >
            <button
                on:click={() => map.zoomOut()}
                class="flex items-center justify-center w-10 h-10 transition-all duration-75 rounded-md hover:text-xl hover:text-foreground hover:bg-background disabled:opacity-50 disabled:pointer-events-none"
                disabled={$noPanNoZoom}>-</button
            >
        </div>
        <div class="flex">
            <button on:click={toggleMenu} class="flex p-2 transition rounded-md shadow-md pointer-events-auto text-background bg-foreground hover:bg-foreground-light">
                <IconMenu /><span class="ml-2">{$t('ui.menu')}</span>
            </button>
            <button on:click={toggleFullScreen} class="mx-4 transition-transform pointer-events-auto hover:scale-110 text-foreground-light">
                <IconFullScreen />
            </button>
        </div>
    </div>
</div>

<div class="absolute bottom-0 left-0 flex flex-col m-6 font-black rounded-md shadow-md pointer-events-auto md:hidden text-md text-foreground-light bg-background-dark">
    <button on:click={() => map.zoomIn()} class="flex items-center justify-center w-10 h-10 transition-all duration-75 rounded-md hover:text-xl hover:text-foreground hover:bg-background">+</button>
    <button on:click={() => map.zoomOut()} class="flex items-center justify-center w-10 h-10 transition-all duration-75 rounded-md hover:text-xl hover:text-foreground hover:bg-background">-</button>
</div>
<div class="absolute top-0 right-0 m-6 md:hidden">
    <button class="z-40 flex p-4 transition rounded-full shadow-md pointer-events-auto text-background bg-foreground hover:bg-foreground-light" on:click={toggleMenu}>
        <IconMenu />
    </button>
</div>

{#if showMenu}
    <Menu {showWinScreen} {mistakes} {correct} {toggleMenu} {restart} {originalToFind} {...$$props} />
{/if}

<Notifications />

<BuyMeACoffee />
