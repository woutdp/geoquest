<script lang="ts">
    import _ from 'lodash'
    import {fade} from 'svelte/transition'

    import {chosenMap} from '$lib/store'
    import {t} from '$lib/translations'
    import {getFeaturesFromTags} from '$lib/utils'

    export let newGame
    export let toggleMenu

    type Tag = {checked: boolean; name: string}
    let tags: Tag[] = []

    function loadTags() {
        tags = _(chosenMap.tags)
            .uniq()
            .sort()
            .map(tag => ({name: tag, checked: (chosenMap.defaultTags as string[]).includes(tag)}))
            .value()
    }

    loadTags()

    function toggleGroupDisplay(event) {
        event.target.classList.toggle("foldable-menu-open")
        event.target.nextElementSibling.classList.toggle("hidden")
        event.target.parentElement.classList.toggle("foldable-group-open")
    }

    $: selectedTags = _(tags)
        .filter(tag => tag.checked)
        .map(tag => tag.name)
        .value()
    $: unselectedTranslatedGrouped = _(tags)
        .filter(tag => !tag.checked)
        .map(tag => {
            let translatedTagName = $t(`quests/${chosenMap.id}/groups.${tag.name}`)
            let translatedTagNameSplit = translatedTagName.split(":")
            return {
                fullName: translatedTagName,
                nameWithoutGroup: translatedTagNameSplit.length > 1 ? _.drop(translatedTagNameSplit).join(":") : translatedTagNameSplit[0],
                groupName: translatedTagNameSplit.length > 1 ? translatedTagNameSplit[0] : undefined,
            }
        })
        .groupBy("groupName")
        .value()

    $: disabled = selectedTags.length === 0
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-4 min-h-[300px] justify-between">
        <div class="flex flex-wrap">
            {#each tags as tag}
                <input id={tag.name} type="checkbox" class="hidden" hidden bind:checked={tag.checked} />
            {/each}
            {#each Object.entries(unselectedTranslatedGrouped) as [groupName, groupTags]}
                <div class="pl-2 pr-2">
                    {#if groupName !== "undefined"}
                        <button on:click={(e) => { toggleGroupDisplay(e, this) }} class="p-2 mb-2 text-xl font-bold foldable-menu">{groupName}</button>
                    {/if}
                    <div class="flex flex-wrap {groupName !== "undefined" ? "hidden": ""}">
                        {#each groupTags as tagObject}
                            <div class="flex justify-center mb-2 mr-2">
                                <label
                                    for={tagObject.fullName}
                                    class="px-3 py-1 text-sm font-semibold transition-all border-2 rounded-full cursor-pointer whitespace-nowrap text-background bg-foreground hover:border-background last:mr-0 border-foreground"
                                    title="{tagObject.fullName}"
                                >
                                    {tagObject.nameWithoutGroup}
                                </label>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
        <div>
            {#if selectedTags.length > 0}
                <div in:fade|global={{duration: 200}} class="flex flex-wrap p-2 rounded-md bg-foreground">
                    {#each selectedTags as tag}
                        <div class="flex justify-center my-1 mr-2">
                            <label
                                for={tag}
                                class="px-3 py-1 text-sm font-semibold transition-all border-2 rounded-full cursor-pointer whitespace-nowrap text-background bg-foreground-light hover:border-background last:mr-0 border-foreground"
                            >
                                <span class="text-[#666]">{$t(`quests/${chosenMap.id}/groups.${tag}`).match(/[^\:]*:/) || ""}</span><span>{$t(`quests/${chosenMap.id}/groups.${tag}`).replace(/[^\:]*:/, "")}</span>
                            </label>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    <button
        on:click={async () => {
            newGame({countries: getFeaturesFromTags(selectedTags)})
            toggleMenu()
        }}
        {disabled}
        class="p-2 mb-2 text-xl font-bold rounded-md disabled:hover:bg-foreground disabled:opacity-10 disabled:hover:text-black disabled:cursor-not-allowed bg-foreground-light text-background hover:bg-green outline outline-4 transition-opacity"
    >
        {$t('ui.start')}
    </button>
</div>
