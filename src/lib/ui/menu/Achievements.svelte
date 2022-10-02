<script lang="ts">
    import _ from 'lodash'

    import achievements from '$lib/assets/data/achievements.json'
    import {save} from '$lib/store'
    import Achievement from '$lib/ui/menu/Achievement.svelte'

    $: sortedAchievements = _(achievements)
        .orderBy(a => !$save.achievements.includes(a.slug))
        .value()
</script>

<div class="p-2 rounded-md bg-foreground overflow-auto max-h-80">
    {#each sortedAchievements as achievement}
        <Achievement {...achievement} />
    {/each}
</div>
