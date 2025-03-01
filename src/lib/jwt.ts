import {jwtVerify} from 'jose'
import {achieveAchievement} from '$lib/utils'

export async function isSupporter() {
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9jAPoUrQzyiwE+LMlDa4
eCpWkai4fXBXrJm8DDwAwNL/qmxoPrgJokvZnTwxDB5GIR7J5NYSUN6/yzm0GBHB
sDITepo3kJInNcmcBV9Sr9ahKH+dlsGHq0vxsKSFA9QmJ81xzc3ORABhtug7Dc2k
pb/ja9KnEtXzik7hT3mVWCEn86pFzyMD4tJ9FIyN0VZUCbdVIWimAiPnT/Aupc/B
dQNM5SuLHl/Nh+oyrouJAh4xBydlktCUGV+QXERh6fGrSQSfpLNx4GUS1XbzlISL
7yOLp471yK287PgQWV+p/7yNMsObd1NVr7sQgoiBumv1yGSREiYHFo/qPgu8CbTC
KQIDAQAB
-----END PUBLIC KEY-----`

    // Convert PEM to ArrayBuffer
    const keyBuffer = pemToArrayBuffer(publicKeyPem)
    const cryptoKey = await crypto.subtle.importKey('spki', keyBuffer, {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}, false, ['verify'])

    const token = getCookie('jwt')
    try {
        const {payload} = await jwtVerify(token, cryptoKey, {algorithms: ['RS256']})
        achieveAchievement('supporter')
        return true
    } catch (err) {
        return false
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

function pemToArrayBuffer(pem) {
    // Remove header, footer, and line breaks
    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '')
    const binary = atob(b64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
}
