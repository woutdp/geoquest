import {fail} from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, platform, request}) => {
        const data = await request.formData()
        const code = data.get('code')

        let queryResult = await platform.env.DB.prepare('SELECT * FROM users WHERE code = ?').bind(code).run()
        if (queryResult.results.length === 0) {
            return fail(400, {code, error: 'Code not found'})
        } else {
            // Generate a signed JWT (ensure to secure your secret, e.g. via environment variables)
            const privateKey = Buffer.from(platform.env.JWT_PRIVATE_KEY_BASE_64, 'base64').toString('utf-8')
            const token = jwt.sign({code}, privateKey, {algorithm: 'RS256', expiresIn: '1m'})

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
