<script>
    import '../app.css'
</script>

<svelte:head>
    <script>
        window.addEventListener("beforeinstallprompt", e => {
            e.preventDefault()
            window.deferredInstallEvent= e
        })
    </script>
</svelte:head>

<slot />