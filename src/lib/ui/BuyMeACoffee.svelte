<script lang="ts">
    import Cookies from 'js-cookie'
    import {onMount} from 'svelte'

    import {browser} from '$app/environment'

    const cookieName = 'buymeacoffeevisible'

    let timer = 300
    let el: HTMLElement | null

    if (browser) {
        const interval = setInterval(() => {
            if (timer <= 0 || Cookies.get(cookieName)) {
                el?.classList?.add('show')
                Cookies.set(cookieName, true)
                clearInterval(interval)
                return
            }
            timer = timer - 1
        }, 1000)
    }

    onMount(() => {
        el = document.getElementById('bmc-wbtn')
    })
</script>

<svelte:head>
    <script
        defer
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="woutdp"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        data-color="#FE8019"
        data-position="Right"
        data-x_margin="20"
        data-y_margin="20"
    >
    </script>
</svelte:head>

<style global lang="stylus">
    #bmc-wbtn
        transform translateY(100px)
        &.show
            transform translateY(0)

        @media screen and (max-width: 767px)
            display none !important
</style>
