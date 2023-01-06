<script lang="ts">
    import {enableDailyQuestNotification, notificationsPermission, showFlagOnly} from '$lib/store'

    let notificationsSupported = 'Notification' in window
    $: permissionDenied = $notificationsPermission === 'denied'
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-4 justify-between">
        <div class="flex flex-wrap text-lg bg-foreground p-2 rounded items-start flex-col gap-y-1">
            {#if notificationsSupported}
                <div class="flex items-center hover:bg-foreground-light p-2 sm:px-4 rounded w-full">
                    <input
                        id="enableDailyQuestNotification"
                        class="form-checked h-6 w-6 rounded text-gray focus:ring-0 focus:ring-offset-0 transition cursor-pointer {permissionDenied ? 'opacity-50' : ''}"
                        type="checkbox"
                        disabled={permissionDenied}
                        bind:checked={$enableDailyQuestNotification}
                    />
                    <label for="enableDailyQuestNotification" class="ml-3 cursor-pointer flex flex-col">
                        <span class={permissionDenied ? 'opacity-50' : ''}>Daily Quest Reminder</span>
                        {#if $notificationsPermission !== 'granted'}
                            <span class="text-xs leading-3 italic mb-1">
                                {#if permissionDenied}
                                    <span class="text-red font-bold">Web notifications disabled: </span>
                                {/if}
                                Make sure to allow web notifications
                            </span>
                        {/if}
                    </label>
                </div>
            {/if}
            <div class="flex items-center hover:bg-foreground-light p-2 sm:px-4 rounded w-full">
                <input id="displayFlagOnly" class="form-checkbox h-6 w-6 rounded text-gray focus:ring-0 focus:ring-offset-0 transition cursor-pointer" type="checkbox" bind:checked={$showFlagOnly} />
                <label for="displayFlagOnly" class="ml-3 cursor-pointer">Display Flag Only</label>
            </div>
        </div>
    </div>
</div>
