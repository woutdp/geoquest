<script lang="ts">
    import IconTrophy from '$lib/icons/IconTrophy.svelte'
    import {save} from '$lib/store'

    export let slug
    export let name
    export let description

    let unlocked = false

    $: unlocked = $save.achievements.includes(slug)
</script>

<div class="{unlocked ? 'opacity-100' : 'opacity-50'} flex items-center mb-2 last:mb-0 bg-foreground-light rounded-md p-2">
    <div class="mr-2">
        <IconTrophy />
    </div>
    <div>
        <h1 class="font-black">
            {#if unlocked}{name}{:else}???{/if}
        </h1>
        <p>{description}</p>
    </div>
</div>
