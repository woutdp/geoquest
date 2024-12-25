<script lang="ts">
    import {showFlagOnly} from '$lib/store'
    import {t} from '$lib/translations'
    import {DE, GB, ES} from 'emoji-flags'
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-4 justify-between gap-2">
        <div class="flex flex-wrap text-lg bg-foreground p-3 rounded items-center">
            <input id="displayFlagOnly" class="form-checkbox h-6 w-6 rounded text-gray focus:ring-0 focus:ring-offset-0 transition cursor-pointer" type="checkbox" bind:checked={$showFlagOnly} />
            <label for="displayFlagOnly" class="ml-2 cursor-pointer">{$t('geoquest.ui.flags-only')}</label>
        </div>
        <div class="flex flex-wrap gap-2 text-lg bg-foreground p-3 rounded items-center">
            <!-- Each of the language names is only directly written in their own language -->
            <a href="/"> <button>{GB.emoji} English</button></a>
            <a href="/de"><button>{DE.emoji} Deutsch</button></a>
            <a href="/es"><button>{ES.emoji} Español</button></a>
        </div>
    </div>
</div>
