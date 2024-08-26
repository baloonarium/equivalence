import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['fr-FR'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

// somehow firefox decide to have its local stripped so...
type LanguageFamily = 'fr' | 'en';
const mapLanguage: Record<LanguageFamily, string> = {
  fr: 'fr-FR',
  en: 'en-EN',
};

const fallbackLocale = mapLanguage.fr;

const local =
  mapLanguage[navigator.language.slice(0, 2) as LanguageFamily] ||
  fallbackLocale;

export function translate(text?: Record<string, string>): string {
  if (!text) return '';
  return text[local] || text[fallbackLocale] || '';
}

const i18n = createI18n({
  locale: local,
  fallbackLocale,
  legacy: false,
  messages,
  inheritLocale: true,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
