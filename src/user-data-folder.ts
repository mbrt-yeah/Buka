import { app } from 'electron';

export default class UserDataFolder {
    public static path: string = app.getPath('userData');
};