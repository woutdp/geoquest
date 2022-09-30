<script lang="ts">
    import IconEmail from '$lib/icons/IconEmail.svelte'
    import IconGithub from '$lib/icons/IconGithub.svelte'
    import IconLightbulb from '$lib/icons/IconLightbulb.svelte'
    import IconWorld from '$lib/icons/IconWorld.svelte'

    const dev = import.meta.env.DEV

    $: inIframe = window.location !== window.parent.location
</script>

<div class="bg-foreground-light rounded-xl p-5 flex flex-col gap-y-2 mb-2">
    <p class="font-bold">Thank you for playing!</p>
    <p class="mb-0">
        It would mean a lot to me if you answered <a class="font-bold underline" target="_blank" href="https://forms.gle/gXjQB1KHA4vZNND19">4 quick questions</a>
    </p>
    <hr class="mb-4 mt-3 text-gray" />
    <a class="font-medium rounded-full bg-foreground p-2 min-w-full flex items-center hover:bg-foreground hover:scale-[1.02] transition-all" target="_blank" href="https://geoquest.sleekplan.app/">
        <span class="ml-4 mr-2 text-gray"><IconLightbulb /></span>Suggestions
    </a>
    <a class="font-medium rounded-full bg-foreground p-2 min-w-full flex items-center hover:bg-foreground hover:scale-[1.02] transition-all" target="_blank" href="https://github.com/woutdp/geoquest">
        <span class="ml-4 mr-2 text-gray"><IconGithub /></span>Contribute
    </a>
    <a class="font-medium rounded-full bg-foreground p-2 min-w-full flex items-center hover:bg-foreground hover:scale-[1.02] transition-all" target="_blank" href="mailto:geoquest@wout.space">
        <span class="ml-4 mr-2 text-gray"><IconEmail /></span>geoquest@wout.space
    </a>
    <div class="min-w-full bg-brand-buy-me-a-coffee rounded-full hover:scale-[1.02] transition-all">
        <a href="https://www.buymeacoffee.com/woutdp" target="_blank" class="flex">
            <img class="h-[47px] w-[170px] ml-4" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
        </a>
    </div>
    {#if inIframe || dev}
        <a class="bg-background text-foreground p-3 rounded-full hover:scale-[1.02] transition-all flex items-center" href="https://geoquest.wout.space/">
            <span class="ml-3 mr-2 text-foreground"><IconWorld /></span><span class="font-black underline">geoquest.wout.space</span>
        </a>
    {/if}
</div>
