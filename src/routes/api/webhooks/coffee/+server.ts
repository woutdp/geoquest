import {json} from '@sveltejs/kit'
import {dev} from '$app/environment'

export async function POST({request, platform}) {
    const secret = platform.env.COFFEE_WEBHOOK_SECRET || 'SECRET'
    const signature = request.headers.get('x-signature-sha256')

    if (!signature) return json({error: 'missing signature'}, {status: 400})

    const rawBody = await request.text()

    if ((await generateSignature(secret, rawBody)) !== signature && !dev) {
        return json({error: 'Invalid signature'}, {status: 401})
    }

    let result = await platform.env.DB.prepare('SELECT * FROM users').run()

    const data = JSON.parse(rawBody)

    if (data.type === 'donation.created') {
        const code = generateCode(6)
        const email = data.data.supporter_email
        await platform.env.DB.prepare('INSERT OR IGNORE INTO users (email, code) VALUES (?, ?)').bind(email, code).run()
        return json({success: true}, {status: 200})
    }

    if (data.type === 'donation.refunded') {
        const email = data.data.supporter_email
        await platform.env.DB.prepare('DELETE FROM users WHERE email=(?)').bind(email).run()
        return json({success: true}, {status: 200})
    }

    return json({success: false}, {status: 204})
}

async function generateSignature(secret, rawBody) {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const key = await crypto.subtle.importKey('raw', keyData, {name: 'HMAC', hash: 'SHA-256'}, false, ['sign'])
    const dataBuffer = encoder.encode(rawBody)
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer)
    return Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

function generateCode(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({length}, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}
