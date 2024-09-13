'use strict';
let EXTERNAL_BFF_NAME = '1.0/one-year-renewable-life-term-service';

module.exports = {
    DEFAULT_DATETIME_FORMATER: 'YYYY/MM/DD',
    DEFAULT_DATETIME_SUBMIT_FORMATER: 'YYYY-MM-DDTHH:mm:ss',
    DEFAULT_CODETABLE_KEYVALUE: { KEY: 'id', VALUE: 'text' },
    DEFAULT_LOCALSTORAGE_I18NKEY: 'system_i18nKey',
    DEFAULT_TABLE_SORT: false,
    DEFAULT_TABLE_SEARCHABLE: false,
    DEFAULT_TABLE_ACTIONBAR_SHOW: '',
    DEFAULT_INPUT_LAYOUT: 'vertical',
    DEFAULT_TABLE_PAGESIZE: 10,
    DEFAULT_SYSTEM_I18N: 'en_US',
    DEFAULT_I18N_CACHE: true,
    DEFAULT_SYSTEM_THEME: 'default',
    DOES_USE_I18N: true,
    DEFAULT_I18N_CONFIGURATION_GROUP: ['PA External'],
    PRELOADING_CODETABLE_LIST: true,
    ASYNC_GET_CODETABLE_LIST: true,
    DEFINE_CODETABLE_VO_LIST_API: 'dd/public/codetable/v1/codeTableVoList/byNameList',
    DEFINE_CODETABLE_LIST_API: 'dd/public/codetable/v1/byCodeTableNameList',
    DEFINE_CODETABLE_LIST: [],
    USER: {
        USER_INFO: 'urp/public/users/v1/current/info',
        GET_USER_LANG: 'urp/public/users/v1/getlang',
        SET_USER_LANG: 'urp/public/users/v1/changelang',
        GET_LANGUAGE_LIST: 'i18n/language/v1/list',
        AUTH: 'urp/public/system/v1/user/auth',
        LOGIN: 'v1/json/tickets',
        GET_MENU: 'urp/public/authorities/v1/loadAllMenu',
        GETPERMISSIONCODES: 'urp/public/authorities/v1/users/permissioncodes',
        GETALLUSER: 'urp/public/users/v1/loadAllUsersInfo'
    },
    I18N: {
        LOAD_UILABELS: 'i18n/translation/v1/ui/load',
        LOAD_UILABELS_CONFIG_GROUPS: 'i18n/translation/v1/ui/load/groups'
    },
    EXTERNALBFF: {
        PROPOSAL_SAVE: EXTERNAL_BFF_NAME + '/proposal/v1/save',
        PROPOSAL_CALCULATE: EXTERNAL_BFF_NAME + '/proposal/v1/calculate',
        PROPOSAL_CONFIRM: EXTERNAL_BFF_NAME + '/proposal/v1/proposalConfirm',
        PROPOSAL_ISSUE: EXTERNAL_BFF_NAME + '/proposal/v1/issue',
        LIFE_PROPOSAL_CALCULATE: EXTERNAL_BFF_NAME + '/life/quotation',
        LIFE_APPLICATION: EXTERNAL_BFF_NAME + '/life/application',
        LIFE_ISSURANCE: EXTERNAL_BFF_NAME + '/life/issurance',
        LIFE_PROPOSAL: EXTERNAL_BFF_NAME + '/life/proposal',
        LIFE_POLICY_SEARCH: EXTERNAL_BFF_NAME + '/life/policies/search',
        LIFE_POLICY: EXTERNAL_BFF_NAME + '/life/policies/',
        LIFE_PRODUCT_ALL_INFO: EXTERNAL_BFF_NAME + '/life/products/allInfo/',
        LIFE_PRODUCT_FUND: EXTERNAL_BFF_NAME + '/life/products/funds',
        LIFE_PD_PRODUCT_DETAIL: EXTERNAL_BFF_NAME + '/life/pd/products/allInfo/',
        LIFE_PD_PRODUCT_AGE_LIMIT: EXTERNAL_BFF_NAME + '/life/pd/products/limits/age'
    }
};
