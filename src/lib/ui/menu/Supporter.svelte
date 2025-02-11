<script lang="ts">
    import {enhance} from '$app/forms'
    let data
</script>

<div class="bg-foreground rounded-lg p-4">
    <h1 class="text-2xl my-2">Benefits</h1>
    <p>Donating to buy me a coffee will give you access to the supporter features.</p>
    <ul class="list-disc">
        <li>Unlocks the final achievement</li>
        <li>Removal of the Buy Me A Coffee button</li>
        <li>A *cool* badge in the menu screen</li>
        <li>My eternal appreciation</li>
        <li>You directly support the development of GeoQuest</li>
    </ul>

    <h2 class="text-2xl my-2">How to become a supporter</h2>

    A way to get a free token is to contribute to the project on GitHub. If you have a pull request merged, you will receive a token as a thank you. If you've contributed in the past, reach out to me
    and a token will be given to you.

    <a href="https://www.buymeacoffee.com/woutdp" class="underline">Become a supporter by giving a donation</a>
    <a href="https://github.com/woutdp/geoquest" class="underline">Become a supporter by contributing on GitHub</a>

    <h2 class="text-2xl my-2">Already a supporter?</h2>
    <label for="code-input">Unlock by entering the code sent to your email</label>
    <form
        class="flex gap-2"
        method="POST"
        use:enhance={() => {
            // sending = true
            return ({update, result}) => {
                update({invalidateAll: true}).finally(async () => {
                    data = result.data
                })
            }
        }}
    >
        <input id="code-input" placeholder="ABC123" class="rounded p-2 w-full" maxlength="6" oninput="this.value = this.value.toUpperCase()" name="code" />
        <button id="code-input" type="submit" placeholder="ABC123" class="rounded p-2 w-full bg-background text-foreground">Submit</button>
    </form>
    {#if data?.success}
        <p>Success!</p>
    {:else if data?.error}
        <p>Error: {data.error}</p>
    {/if}
</div>
