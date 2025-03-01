<script lang="ts">
    import {fly} from 'svelte/transition'
</script>

<div transition:fly|global={{y: 100, duration: 200}} class="z-50 flex h-screen">
    <div class="z-50 flex m-auto">
        <h1 class="font-serif text-4xl font-black md:text-9xl sm:text-6xl text-green">GeoQuest.gg</h1>
    </div>
</div>
