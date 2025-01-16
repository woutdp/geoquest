<script lang="ts">
    import {browser, dev} from '$app/environment'
    import {maps} from '$lib/store'
    import {t} from '$lib/translations'

    $: inIframe = browser && window.location !== window.parent.location
</script>

<div class="flex flex-col">
{#each maps as map}
  <button on:click={() => { let urlParams = new URLSearchParams(window.location.search); urlParams.set("m", map.id); window.location.search = urlParams;}} class="p-2 mb-2 text-xl uppercase text-black transition-colors rounded-md bg-foreground-light hover:bg-background hover:text-foreground">
      {$t(`quests.${map.id}`)}
  </button>
{/each}
</div>
