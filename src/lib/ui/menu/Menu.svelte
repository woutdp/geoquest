<script lang="ts">
    import {fade, fly} from 'svelte/transition'

    import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte'
    import IconClose from '$lib/icons/IconClose.svelte'
    import MainMenu from '$lib/ui/menu/MainMenu.svelte'
    import {chosenMap, save} from '$lib/store'
    import IconTrophy from '$lib/icons/IconTrophy.svelte'

    export let toggleMenu
    export let gameConfiguration
    export let timeMs

    let activeMenu = MainMenu

    function setActiveMenu(screen) {
        activeMenu = screen
    }

    // TODO: maybe create a function getLocalLeaderboardEntries
    // we can't show it for daily quests because every time you reload it will show "new best", which is kinda weird
    $: leaderboardEntries = gameConfiguration.mode === 'dailyQuest' ? [] : $save.localLeaderboard[`${chosenMap.id}-${gameConfiguration.countries}`] ?? []
    $: isNewBest = leaderboardEntries.length === 1 || (leaderboardEntries.length > 1 && leaderboardEntries[1 /* prev */].timeMs > timeMs) // curr. could get from leaderboardEntries, but no need
</script>

<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
            in:fade|global={{duration: 200}}
            out:fade|global={{duration: 100}}
            on:click={toggleMenu}
            class="fixed inset-0 transition-opacity bg-opacity-10 bg-background bg-gradient-to-bl from-green/30"
            aria-hidden="true"
        />
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden select-none sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- overflow-hidden was removed to add popover with "new best!" above. nothing will break, right? right?.. --->
        <div
            in:fly|global={{y: 15, duration: 400}}
            out:fly|global={{y: 5, duration: 100}}
            class="relative inline-block w-full text-left align-bottom transition-all transform rounded-lg shadow-xl bg-gradient-to-br from-green outline outline-8 outline-background text-background bg-foreground sm:my-8 sm:align-middle sm:max-w-lg"
        >
            {#if isNewBest && activeMenu === MainMenu}
                <div class="absolute z-20 -top-8 -left-8 -rotate-12 flex items-center gap-2 px-4 py-2 w-fit rounded-md bg-background text-yellow" in:fly|global={{y: 20, duration: 500}}>
                    <IconTrophy />
                    <p class="text-xl font-medium">new best!</p>
                </div>
            {/if}
            <div class="flex flex-col p-5">
                <div class="flex justify-between mb-4">
                    {#if activeMenu !== MainMenu}
                        <button on:click={() => setActiveMenu(MainMenu)} class="p-2 rounded-full hover:bg-foreground-light">
                            <IconArrowLeft />
                        </button>
                    {:else}
                        <span />
                    {/if}
                    <button on:click={toggleMenu} class="p-2 rounded-full hover:bg-foreground-light">
                        <IconClose />
                    </button>
                </div>
                <svelte:component this={activeMenu} {setActiveMenu} {...$$props} />
            </div>
        </div>
    </div>
</div>
