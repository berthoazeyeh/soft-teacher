import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage, isDarkMode, selectLanguageValue, useTheme } from "store";
import { I18n } from 'i18n';
import { changeTheme } from "store/actions/ThemeAction";

export default (Component) => (props) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const language = useSelector(selectLanguageValue);
    const onMapTypeSelect = (mapType) => {
    }
    const onThemeChange = (mapType) => {
        dispatch(changeTheme(mapType));
    }
    const onLanguageSelect = (mapType) => {
        dispatch(changeLanguage(mapType));
    }
    return <Component
        theme={theme}
        language={language}
        I18n={I18n}
        isDarkMode={isDarkMode()}
        selectedLanguage={language}
        onMapTypeSelect={onMapTypeSelect}
        onLanguageSelect={onLanguageSelect}
        onThemeChange={onThemeChange}
        {...props}
    />

}