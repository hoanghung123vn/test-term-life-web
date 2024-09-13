import { UrlUtil, Util, I18nUtil } from '@ebaoui/rainbowui-sugar-tools';
import config from 'config';
let lang = sessionStorage.getItem(config.DEFAULT_LOCALSTORAGE_I18NKEY) || config.DEFAULT_SYSTEM_I18N;
const langUrl = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'USER', 'GET_USER_LANG');
const i18nUrl = UrlUtil.getConfigUrl('UI_API_GATEWAY_PROXY', 'I18N', 'LOAD_UILABELS_CONFIG_GROUPS');

if (Util.parseBool(config.DOES_USE_I18N)) {
    lang = I18nUtil.getUserLang(langUrl);
    module.exports = I18nUtil.getI18nData(lang, i18nUrl);
} else {
    module.exports = require('./' + lang);
}

