<script lang="ts">
    import _ from 'lodash'
    import IconTrophySmall from '$lib/icons/IconTrophySmall.svelte'
    import {browser, dev} from '$app/environment'
    import {maps, save} from '$lib/store'
    import achievements from '$lib/assets/data/achievements.json'
    import {t} from '$lib/translations'

    $: missingAchievementsInQuests = _(achievements).groupBy("quest").mapValues(function (achivementsForThisQuest) {
      return _.reduce(achivementsForThisQuest, function (iteratee, achievement) {
        return iteratee + ($save.achievements.includes(achievement.slug) ? 0 : 1);
      }, 0);
    }).value();

    $: inIframe = browser && window.location !== window.parent.location
</script>

<div class="flex flex-col">
{#each maps as map}
  <button on:click={() => { let urlParams = new URLSearchParams(window.location.search); urlParams.set("m", map.id); window.location.search = urlParams;}} class="flex items-center p-2 mb-2 text-xl uppercase text-black transition-colors rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
      <div class="flex-grow">{$t(`quests/index.${map.id}`)}</div>
      {#if !missingAchievementsInQuests[map.id]} <IconTrophySmall /> {/if}
  </button>
{/each}
</div>
