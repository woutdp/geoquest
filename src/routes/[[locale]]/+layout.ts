import {fallbackLocale, loadTranslations} from '$lib/translations'

import type {LayoutLoad} from './$types'

export const load: LayoutLoad = async ({url, params}) => {
    const {pathname} = url

    const initLocale = params.locale || fallbackLocale
    await loadTranslations(initLocale, pathname)

    return {}
}
