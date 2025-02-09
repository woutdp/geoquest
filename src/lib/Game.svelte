<script lang="ts">
    import * as turf from '@turf/turf'
    import {polyfillCountryFlagEmojis} from 'country-flag-emoji-polyfill'
    import _ from 'lodash'
    import {onMount} from 'svelte'

    import {dev} from '$app/environment'
    import {loadMap} from '$lib/map'
    import Map from '$lib/map/Map.svelte'
    import {successSound} from '$lib/sounds'
    import {chosenMap, clientX, clientY, day, geojson, geometries, loadedMap, mousePos, save, showDebug} from '$lib/store'
    import DebugInterface from '$lib/ui/DebugInterface.svelte'
    import LoadingScreen from '$lib/ui/LoadingScreen.svelte'
    import MouseTooltip from '$lib/ui/MouseTooltip.svelte'
    import UI from '$lib/ui/UI.svelte'
    import {achieveAchievement, ALREADY_GUESSED, CORRECT, getGeojsonByName, processExtraAchievements, shuffleColors, WRONG} from '$lib/utils'

    polyfillCountryFlagEmojis()
    import dailyQuestCountries from '$lib/assets/data/daily-quest.json'

    let questionFeature
    let lastFocusedCountry
    let focusedCountry
    let foundFeatures = []
    let unfoundFeatures = []
    let toFind = []
    let originalToFind = []
    let correctCountries = []
    let streak = 0
    let mistakes = 0
    let mistakesThisGuess = 0
    let intervalId: NodeJS.Timeout
    let timeMs: number
    let interfaceLoaded = false
    let showMenu: boolean
    let showWinScreen = false
    let ui
    let map
    let gameConfiguration = {
        mode: 'dailyQuest',
        countries: dailyQuestCountries[$day % 999],
        randomize: false,
        possibleCountries: 'all',
        restart: false,
        maxGuesses: 5
    }

    $: showLoadingScreen = Boolean(!$loadedMap)
    $: correct = correctCountries.length
    $: canRestart = gameConfiguration.restart ?? true

    function pickFeature() {
        const possibilities = _(toFind).filter(feature => feature !== questionFeature)
        questionFeature = gameConfiguration.randomize ?? true ? possibilities.sample() : possibilities.value()[0]
    }

    function restart() {
        showWinScreen = false
        timeMs = 0
        mistakes = 0
        mistakesThisGuess = 0
        streak = 0
        toFind = originalToFind
        foundFeatures = []
        correctCountries = []

        if (gameConfiguration.possibleCountries === 'all') unfoundFeatures = $geometries
        else unfoundFeatures = toFind

        clearInterval(intervalId)
        const startTime = Date.now()
        intervalId = setInterval(() => {
            timeMs = Date.now() - startTime
        }, 1000)

        questionFeature = undefined
        shuffleColors()
        pickFeature()
    }

    function newGame(configuration) {
        gameConfiguration = configuration
        toFind = _($geometries)
            .filter(geometry => configuration.countries.includes(geometry.properties.name))
            .sortBy(g => _(configuration.countries).findIndex(c => c === g.properties.name))
            .value()
        originalToFind = toFind

        clearInterval(intervalId)
        const startTime = Date.now()
        intervalId = setInterval(() => {
            timeMs = Date.now() - startTime

            if (configuration?.mode === 'dailyQuest') {
                $save.dailyQuestProgress = {...$save.dailyQuestProgress, timeMs: timeMs}
            }
        }, 1000)

        if (configuration?.restart ?? true) restart()

        if (configuration?.mode === 'dailyQuest') {
            const progress = $save.dailyQuestProgress.progress

            if (gameConfiguration.possibleCountries === 'all') unfoundFeatures = $geometries
            else unfoundFeatures = toFind

            const alreadyFound = _(progress)
                .filter(arr => configuration.countries.includes(arr.slice(-1)[0]))
                .map(arr => arr.slice(-1)[0])
                .value()

            foundFeatures = alreadyFound
            correctCountries = _(progress)
                .filter(arr => arr.length === 1)
                .map(arr => arr[0])
                .value()

            mistakes = _(progress)
                .flatten()
                .reject(c => configuration.countries.includes(c))
                .value().length

            timeMs = $save.dailyQuestProgress.timeMs

            if (alreadyFound.length === progress.length) mistakesThisGuess = 0
            else mistakesThisGuess = _(progress.slice(-1)[0]).difference(configuration.countries).value().length

            if (mistakesThisGuess > 0) streak = 0
            else {
                const i = _(progress)
                    .map(arr => arr.length)
                    .reverse()
                    .findIndex(c => c !== 1)
                if (i === -1) streak = progress.length
                else streak = i
            }

            toFind = _($geometries)
                .filter(geometry =>
                    _(configuration.countries)
                        .reject(c => alreadyFound.includes(c))
                        .value()
                        .includes(geometry.properties.name)
                )
                .sortBy(g => _(configuration.countries).findIndex(c => c === g.properties.name))
                .value()

            if (toFind.length !== 0) {
                questionFeature = undefined
                pickFeature()
            } else {
                clearInterval(intervalId)

                unfoundFeatures = []
                showMenu = true
                showWinScreen = true
            }
        }
    }

    function newDailyQuest() {
        if ($save?.dailyQuestProgress?.day !== $day) $save.dailyQuestProgress = {...$save.dailyQuestProgress, progress: [], day: $day, timeMs: 0}

        newGame({
            mode: 'dailyQuest',
            countries: dailyQuestCountries[$day % 999],
            randomize: false,
            possibleCountries: 'all',
            restart: false,
            maxGuesses: 5
        })
    }

    function clickCountryHandler(feature) {
        if (foundFeatures.includes(feature)) return ALREADY_GUESSED
        if (!unfoundFeatures.includes(feature)) return ALREADY_GUESSED

        if (questionFeature?.properties?.name === feature.properties.name) {
            successSound.play()

            if (gameConfiguration.mode === 'dailyQuest') logGuess(feature.properties.name)

            foundFeatures = [...foundFeatures, feature]
            unfoundFeatures = _.filter(unfoundFeatures, e => e.properties.name !== feature.properties.name)
            toFind = _.filter(toFind, e => e.properties.name !== feature.properties.name)

            pickFeature()

            if (mistakesThisGuess === 0) correctCountries = [...correctCountries, feature.properties.name]

            mistakesThisGuess = 0
            streak += 1
            ui.triggerArrow()

            if (toFind.length === 0) {
                clearInterval(intervalId)

                const currentQuestId = `${chosenMap.id}-${gameConfiguration.countries}`
                const currentQuestLeaderboard = $save.localLeaderboard[currentQuestId]
                const leaderboardEntry = {total: originalToFind.length, correct: correct + 1 /* correct counter hasnt't yet updated */, timeMs, createdAt: Date.now()}
                if (!currentQuestLeaderboard) {
                    $save.localLeaderboard[currentQuestId] = [leaderboardEntry]
                } else {
                    const place = currentQuestLeaderboard.findIndex(entry => entry.timeMs >= timeMs)
                    if (place !== -1) {
                        currentQuestLeaderboard.splice(place, 0, leaderboardEntry)
                        $save.localLeaderboard[currentQuestId] = currentQuestLeaderboard.slice(0, 10)
                    }
                }

                showMenu = true
                showWinScreen = true
                focusedCountry = undefined
                unfoundFeatures = []
                if (mistakes === 0 && gameConfiguration.mode === 'dailyQuest') achieveAchievement('daily-challenge')
            }

            if ($loadedMap.id === 'world-countries') {
                achieveAchievement('1-country')
                if (streak === 5) achieveAchievement('5-streak')
                if (streak === 10) achieveAchievement('10-streak')
                if (streak === 30) achieveAchievement('30-streak')
            }
            processExtraAchievements(correctCountries, $loadedMap.id)

            return CORRECT
        }

        const bearing = turf.bearingToAzimuth(
            turf.rhumbBearing(
                getGeojsonByName($geojson, feature.properties.name).properties.center.geometry.coordinates,
                getGeojsonByName($geojson, questionFeature.properties.name).properties.center.geometry.coordinates
            )
        )

        ui.triggerArrow(bearing)

        if (gameConfiguration.mode === 'dailyQuest') logGuess(feature.properties.name)

        mistakesThisGuess += 1
        mistakes += 1
        streak = 0
        return WRONG
    }

    function countryFocusedHandler(feature = undefined) {
        if (feature) lastFocusedCountry = feature
        focusedCountry = feature
    }

    function logGuess(country) {
        let progress = $save?.dailyQuestProgress?.progress ?? []
        const guess = foundFeatures.length
        progress[guess] = [...(progress[guess] ?? []), country]
        $save.dailyQuestProgress = {...$save.dailyQuestProgress, progress: progress}
    }

    function handleMousemove(e) {
        $mousePos = {x: e.clientX, y: e.clientY}
    }

    function handleKeypress(e) {
        if (dev && e.key === 'd') $showDebug = !$showDebug
    }

    onMount(async () => {
        await loadMap(chosenMap)
        newDailyQuest()
    })
</script>

<svelte:window on:keypress={handleKeypress} on:mousemove={handleMousemove} bind:innerWidth={$clientX} bind:innerHeight={$clientY} />

{#if dev}
    <DebugInterface {mistakesThisGuess} {toFind} {unfoundFeatures} {lastFocusedCountry} />
{/if}

<UI
    bind:this={ui}
    {questionFeature}
    {foundFeatures}
    {originalToFind}
    {mistakes}
    {correct}
    {timeMs}
    {restart}
    {newGame}
    {showWinScreen}
    {map}
    {streak}
    {newDailyQuest}
    {canRestart}
    {gameConfiguration}
    bind:interfaceLoaded
    bind:showMenu
/>

{#if $loadedMap && interfaceLoaded}
    <Map bind:this={map} {clickCountryHandler} {countryFocusedHandler} {foundFeatures} {unfoundFeatures} {toFind} />
{/if}

{#if showLoadingScreen}
    <LoadingScreen />
{/if}

<MouseTooltip {focusedCountry} {unfoundFeatures} />
