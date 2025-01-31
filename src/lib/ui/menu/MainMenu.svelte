<script lang="ts">
    import achievements from '$lib/assets/data/achievements.json'
    import IconInfo from '$lib/icons/IconInfo.svelte'
    import IconLock from '$lib/icons/IconLock.svelte'
    import IconVolumeOff from '$lib/icons/IconVolumeOff.svelte'
    import IconVolumeUp from '$lib/icons/IconVolumeUp.svelte'
    import {day, save, soundEffects, timeLeft} from '$lib/store'
    import {t} from '$lib/translations'
    import AboutMenu from '$lib/ui/menu/AboutMenu.svelte'
    import Achievements from '$lib/ui/menu/Achievements.svelte'
    import NewGameMenu from '$lib/ui/menu/NewGameMenu.svelte'
    import SettingsMenu from '$lib/ui/menu/SettingsMenu.svelte'
    import SwitchQuestMenu from '$lib/ui/menu/SwitchQuestMenu.svelte'
    import WinScreen from '$lib/ui/menu/WinScreen.svelte'

    export let restart
    export let toggleMenu
    export let showWinScreen
    export let newDailyQuest
    export let canRestart
    export let setActiveMenu

    $: disabledDailyQuest = $save?.dailyQuestProgress?.day === $day
</script>

{#if showWinScreen}
    <WinScreen {...$$restProps} />
{/if}

<div class="flex flex-col">
    <button
        on:click={() => {
            newDailyQuest()
            toggleMenu()
        }}
        disabled={disabledDailyQuest}
        class="flex items-center justify-between p-2 mb-2 text-xl text-black transition rounded-md bg-foreground-light hover:bg-background hover:text-foreground disabled:bg-background-dark disabled:text-foreground disabled:cursor-not-allowed disabled:hover:scale-105"
    >
        <span class="w-1/3" />
        <span class="flex items-center justify-center w-1/3 whitespace-nowrap uppercase"><span class:hidden={!disabledDailyQuest} class="mr-2"><IconLock /></span>{$t('ui.dailyQuest')}</span>
        <span class="flex justify-end w-1/3 text-sm">{$timeLeft}</span>
    </button>
    <button on:click={() => setActiveMenu(NewGameMenu)} class="p-2 mb-2 text-xl uppercase text-black rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
        {$t('ui.practice')}
    </button>
    <button on:click={() => setActiveMenu(Achievements)} class="flex items-center justify-between p-2 mb-2 text-xl text-black rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
        <span class="w-1/3" />
        <span class="w-1/3 uppercase">{$t('ui.achievements')}</span>
        <span class="flex justify-end w-1/3 text-sm">{$save.achievements.length} / {achievements.length}</span>
    </button>
    <button on:click={() => setActiveMenu(SwitchQuestMenu)} class="p-2 mb-2 text-xl uppercase text-black rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
        {$t('ui.changeMap')}
    </button>
    <button on:click={() => setActiveMenu(SettingsMenu)} class="p-2 mb-2 text-xl uppercase text-black rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
        {$t('ui.settings')}
    </button>
    <button
        on:click={() => {
            restart()
            toggleMenu()
        }}
        disabled={!canRestart}
        class="p-2 mb-2 text-xl text-black uppercase rounded-md bg-foreground-light hover:bg-background hover:text-foreground disabled:opacity-30 disabled:hover:bg-foreground disabled:hover:text-background"
    >
        {$t('ui.restart')}
    </button>
    <div class="flex items-center justify-between mt-3">
        <button on:click={() => setActiveMenu(AboutMenu)} class="p-2 rounded-full cursor-pointer bg-foreground-light text-background hover:bg-background hover:text-foreground">
            <IconInfo />
        </button>
        <div class="flex justify-end ml-4">
            <input hidden id="Effects" type="checkbox" class="hidden" bind:checked={$soundEffects} />
            <label for="Effects" class="p-2 rounded-full cursor-pointer bg-foreground-light text-background hover:bg-background hover:text-foreground">
                {#if $soundEffects}<IconVolumeUp />{:else}<IconVolumeOff />{/if}
            </label>
        </div>
    </div>
</div>
