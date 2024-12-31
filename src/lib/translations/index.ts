import emojiFlags from 'emoji-flags'
import i18n, {type Config} from 'sveltekit-i18n'

type ParserPayload = {[key: string]: number | string}

/**
 * Map of available locals. For each locale, there is a country flag,
 * as well as the name of the language, writen in the same language for easy recognition
 *
 * Each is listed in the setting by this name
 */
export const availableLocales: Record<string, [name: string, flag: emojiFlags.CountryData['emoji']]> = {
    en: ['English', emojiFlags.GB.emoji],
    de: ['Deutsch', emojiFlags.DE.emoji],
    es: ['Español', emojiFlags.ES.emoji]
}
export const fallbackLocale = 'en'

const translationConfig: Config<ParserPayload> = {
    initLocale: 'en',
    fallbackLocale,
    loaders: [
        {locale: 'en', key: 'geoquest', loader: async () => (await import('./en.json')).default},
        {locale: 'de', key: 'geoquest', loader: async () => (await import('./de.json')).default},
        {locale: 'es', key: 'geoquest', loader: async () => (await import('./es.json')).default}
    ]
}

export const {t, locale, locales, loading, loadTranslations} = new i18n(translationConfig)
