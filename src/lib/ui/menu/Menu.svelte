<script lang="ts">
    import {fade, fly} from 'svelte/transition'

    import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte'
    import IconClose from '$lib/icons/IconClose.svelte'
    import MainMenu from '$lib/ui/menu/MainMenu.svelte'

    export let toggleMenu

    let activeMenu = MainMenu

    function setActiveMenu(screen) {
        activeMenu = screen
    }
</script>

<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
            in:fade|global={{duration: 200}}
            out:fade|global={{duration: 100}}
            on:click={toggleMenu}
            class="fixed inset-0 transition-opacity bg-opacity-10 bg-background bg-gradient-to-bl from-green/30"
            aria-hidden="true"
        />
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden select-none sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
            in:fly|global={{y: 15, duration: 400}}
            out:fly|global={{y: 5, duration: 100}}
            class="inline-block w-full overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-gradient-to-br from-green outline outline-8 outline-background text-background bg-foreground sm:my-8 sm:align-middle sm:max-w-lg"
        >
            <div class="flex flex-col p-5">
                <div class="flex justify-between mb-4">
                    {#if activeMenu !== MainMenu}
                        <button on:click={() => setActiveMenu(MainMenu)} class="p-2 rounded-full hover:bg-foreground-light">
                            <IconArrowLeft />
                        </button>
                    {:else}
                        <span />
                    {/if}
                    <button on:click={toggleMenu} class="p-2 rounded-full hover:bg-foreground-light">
                        <IconClose />
                    </button>
                </div>
                <svelte:component this={activeMenu} {setActiveMenu} {...$$props} />
            </div>
        </div>
    </div>
</div>
