export const update_lang = () => {
    let lang = (
        navigator.languages && navigator.languages[0] ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.userLanguage ||
        'en-US'
    );

    if ((lang.toLowerCase() == 'zh-tw') || (lang.toLowerCase() == 'zh-hk')){
        i18n.setLocale('zh-Hant');
    }
    else if ((lang.toLowerCase() == 'zh-cn') || (lang.toLowerCase() == 'zh-hans-cn') || (lang.toLowerCase() == 'zh')){
        i18n.setLocale('zh-Hans');
    }
    else{
        i18n.setLocale(lang);
    }
}