import i18n, {type Config} from 'sveltekit-i18n'

type ParserPayload = {[count: string]: number | string}

const config: Config<ParserPayload> = {
    initLocale: 'en',
    fallbackLocale: 'en',
    loaders: [
        {locale: 'en', key: 'geoquest', loader: async () => (await import('./en.json')).default},
        {locale: 'de', key: 'geoquest', loader: async () => (await import('./de.json')).default},
        {locale: 'es', key: 'geoquest', loader: async () => (await import('./es.json')).default}
    ]
}

export const {t, locale, locales, loading, loadTranslations} = new i18n(config)
