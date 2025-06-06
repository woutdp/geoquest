import {sveltekit} from '@sveltejs/kit/vite'
import {defineConfig} from 'vite'

export default defineConfig({
    plugins: [sveltekit()],
    build: {
        target: 'es2022',
        sourcemap: false
    },
    resolve: {
        alias: {
            crypto: 'node:crypto'
        }
    }
})
