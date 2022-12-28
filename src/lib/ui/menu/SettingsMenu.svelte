<script lang="ts">
    import {showFlagOnly} from '$lib/store'
</script>

<div class="flex flex-col">
    <div class="flex flex-col mb-4 justify-between">
        <div class="flex flex-wrap text-lg bg-foreground p-3 rounded items-center">
            <input id="displayFlagOnly" class="form-checkbox h-6 w-6 rounded text-gray focus:ring-0 focus:ring-offset-0 transition cursor-pointer" type="checkbox" bind:checked={$showFlagOnly} />
            <label for="displayFlagOnly" class="ml-2 cursor-pointer">Display Flag Only</label>
        </div>
    </div>
</div>
