<script>
    import _ from 'lodash'
    import {fly} from 'svelte/transition'

    import IconClose from '$lib/icons/IconClose.svelte'
    import IconTrophy from '$lib/icons/IconTrophy.svelte'
    import {notifications} from '$lib/store'

    export let notification
</script>

<div
    transition:fly={{y: 100}}
    class="flex items-center justify-between p-4 mb-6 shadow-md pointer-events-auto shrink-0 ring-offset-4 ring-offset-black bg-foreground text-background rounded-xl ring-4 ring-yellow"
>
    <div class="flex items-center">
        <div class="text-foreground-background animate-wiggle">
            <IconTrophy />
        </div>
        <div class="mx-4 text-lg">
            <h1 class="text-sm">Achievement Unlocked!</h1>
            <p class="font-extrabold">{notification.title}</p>
        </div>
    </div>
    <button
        on:click={() => {
            $notifications = _($notifications)
                .filter(n => n !== notification)
                .value()
        }}
        class="items-start transition-all rounded-full opacity-50 cursor-pointer hover:opacity-80 "
    >
        <IconClose />
    </button>
</div>
