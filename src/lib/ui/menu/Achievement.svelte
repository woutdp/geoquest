<script lang="ts">
    import IconTrophy from '$lib/icons/IconTrophy.svelte'
    import {save} from '$lib/store'
    import {t} from '$lib/translations'

    export let slug
    export let quest
    export let hideQuestName

    let unlocked = false

    $: unlocked = $save.achievements.includes(slug)
</script>

<div class="{unlocked ? 'opacity-100' : 'opacity-50'} flex items-center mb-2 last:mb-0 bg-foreground-light rounded-md p-2">
    <div class="mr-2">
        <IconTrophy />
    </div>
    <div>
        <h1 class="font-black">
            {#if unlocked}{$t(`quests/${quest}/achievements.${slug}.name`)}{:else}???{/if}
        </h1>
        <p>{$t(`quests/${quest}/achievements.${slug}.description`)}</p>
        {#if !hideQuestName}<div class="text-xs"><i>{$t(`quests/index.${quest}`)}</i></div>{/if}
    </div>
</div>
