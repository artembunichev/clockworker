import { handleAppEvents } from './app-events';
import { handleAppSettings } from './app-settings';
import { handleUpdater } from './updater';

handleAppEvents();

handleAppSettings();

handleUpdater();
