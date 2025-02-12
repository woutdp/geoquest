<script lang="ts">
    import {enhance} from '$app/forms'
    import IconCheckmark from '$lib/icons/IconCheckmark.svelte'
    import {goto} from '$app/navigation'
    let data

    import {isSupporter} from '$lib/jwt'
    import {onMount} from 'svelte'

    let supporter = false

    onMount(async () => {
        supporter = await isSupporter()
    })
</script>

<div class="bg-foreground rounded-lg p-4">
    <h1 class="text-2xl my-2">Benefits</h1>
    <ul>
        <li class="flex items-center gap-2"><IconCheckmark />Unlocks the <i>become a supporter</i> achievement</li>
        <li class="flex items-center gap-2"><IconCheckmark />Removal of the Buy Me A Coffee button</li>
        <li class="flex items-center gap-2"><IconCheckmark />A <i>*cool*</i> badge in the menu screen</li>
        <li class="flex items-center gap-2"><IconCheckmark />You directly support the development of GeoQuest</li>
    </ul>

    {#if !supporter}
        <h2 class="text-2xl my-2">How to become a supporter</h2>
        <ul>
            <li>Donate any amount on <a href="https://www.buymeacoffee.com/woutdp" class="underline">Buy Me A Coffee</a></li>
            <li>Contribute on <a href="https://github.com/woutdp/geoquest" class="underline">GitHub</a></li>
        </ul>

        <h2 class="text-2xl my-2">Already a supporter?</h2>
        <label for="code-input">Unlock by entering the code sent to your email</label>
        <form
            class="flex gap-2"
            method="POST"
            use:enhance={() => {
                return ({update, result}) => {
                    update({invalidateAll: true}).finally(async () => {
                        data = result.data
                        if (data?.success) {
                            location.reload()
                        }
                    })
                }
            }}
        >
            <input id="code-input" class="rounded p-2 w-full" maxlength="6" oninput="this.value = this.value.toUpperCase()" name="code" />
            <button id="code-input" type="submit" class="rounded p-2 w-full bg-background text-foreground">Submit</button>
        </form>
    {:else}
        <hr class="my-4" />
        <h2 class="text-3xl font-bold">Thank you for your support!</h2>
    {/if}
</div>
