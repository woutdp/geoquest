import {loadTranslations} from '$lib/translations'

import type {LayoutLoad} from './$types'

export const load: LayoutLoad = async ({url, params}) => {
    const {pathname} = url

    const initLocale = params.locale || 'en' // get from cookie, user session, ...

    await loadTranslations(initLocale, pathname) // keep this just before the `return`

    return {}
}
