<script lang="ts">
    import {onMount} from 'svelte'

    let permittedDomain = 'https://geoquest.gg'

    onMount(async () => {
        console.log(localStorage)
        window.addEventListener('message', function (event) {
            if (event.origin === permittedDomain) {
                if (event.data) {
                    localStorage.setItem('localstorage', event.data)
                } else {
                    localStorage.removeItem('localstorage')
                }
            }
        })
    })
</script>
