<script lang="ts">
    import {scale} from 'svelte/transition'
    $: inIframe = window.location !== window.parent.location
</script>

<div class="p-2 rounded-md bg-foreground">
    {#if inIframe}
        <p in:scale class=" bg-background text-foreground p-2 text-center rounded-md text-md mb-2">
            Play GeoQuest on <a class="font-black underline" target="_blank" href="https://geoquest.wout.space/">geoquest.wout.space</a> for better performance.
        </p>
    {/if}

    <p>Thank you for playing!</p>
    <p class="mb-4">
        It would mean a lot to me if you gave me your feedback and answered <a class="font-bold underline" target="_blank" href="https://forms.gle/gXjQB1KHA4vZNND19">4 quick questions</a>
    </p>
    <p class="">Contribute on <a class="underline" target="_blank" href="https://github.com/woutdp/geoquest">Github</a></p>
    <p class="">For any enquiries: <a class="underline" target="_blank" href="mailto:geoquest@wout.space">geoquest@wout.space</a></p>
    <a class="underline font-bold" target="_blank" href="https://www.buymeacoffee.com/woutdp">Buy Me a Coffee</a>
</div>
