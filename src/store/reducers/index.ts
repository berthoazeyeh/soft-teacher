import { combineReducers } from 'redux';
import { TranslationReducer } from '@store/reducers/TranslationReducer';
import { SelectedRouteScreenReducer } from '@store/reducers/SelectedRouteScreenReducer';
import { ThemeReducer } from './ThemeReducer';
import { CountNotificationReducer } from './CountNotificationReducer';
import { UserReducer } from './UserReducer';
import { SynchroisationReducer } from './SynchroisationReducer';
import { NotificationReducer } from './NotificationReducer';

const RootReducer = combineReducers({
    translation: TranslationReducer, // Ajoutez le reducer de traduction ici
    current_screen: SelectedRouteScreenReducer,
    theme: ThemeReducer,
    notificationCount: CountNotificationReducer,
    user: UserReducer,
    sync: SynchroisationReducer,
    notif_settings: NotificationReducer,
});

export default RootReducer
