import { combineReducers } from 'redux';
import { TranslationReducer } from '@store/reducers/TranslationReducer';
import { SelectedRouteScreenReducer } from '@store/reducers/SelectedRouteScreenReducer';
import { ThemeReducer } from './ThemeReducer';
import { CountNotificationReducer } from './CountNotificationReducer';
import { UserReducer } from './UserReducer';

const RootReducer = combineReducers({
    translation: TranslationReducer, // Ajoutez le reducer de traduction ici
    current_screen: SelectedRouteScreenReducer,
    theme: ThemeReducer,
    notificationCount: CountNotificationReducer,
    user: UserReducer
});

export default RootReducer
