import {fail} from '@sveltejs/kit'
import jwt from '@tsndr/cloudflare-worker-jwt'

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, platform, request}) => {
        if (typeof globalThis.CryptoKey === 'undefined') {
            // Generate a dummy key to get its CryptoKey constructor
            const key = await crypto.subtle.generateKey({name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt'])
            globalThis.CryptoKey = key.constructor
        }

        const data = await request.formData()
        const code = data.get('code')

        let queryResult = await platform.env.DB.prepare('SELECT * FROM users WHERE code = ?').bind(code).run()
        if (queryResult.results.length === 0) {
            return fail(400, {code, error: 'Code not found'})
        } else {
            // Generate a signed JWT (ensure to secure your secret, e.g. via environment variables)
            const privateKey = atob(platform.env.JWT_PRIVATE_KEY_BASE_64)
            const token = await jwt.sign({}, privateKey, {algorithm: 'RS256', expiresIn: 30 * 24 * 60 * 60})

            // Set the JWT as a cookie
            cookies.set('jwt', token, {
                path: '/',
                httpOnly: false, // This is fine, as the JWT is not sensitive
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 // 1 month
            })

            return {success: true}
        }
        return {}
    }
}
