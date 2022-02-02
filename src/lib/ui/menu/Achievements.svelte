<script lang="ts">
    import _ from 'lodash'

    import {save} from '$lib/store'
    import Achievement from '$lib/ui/menu/Achievement.svelte'

    import achievements from '../../../assets/achievements.json'

    $: sortedAchievements = _(achievements)
        .orderBy(a => !$save.achievements.includes(a.slug))
        .value()
</script>

<div class="p-2 rounded-md bg-foreground overflow-auto max-h-80">
    {#each sortedAchievements as achievement}
        <Achievement {...achievement} />
    {/each}
</div>
