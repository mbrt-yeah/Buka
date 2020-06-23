import Vue from 'vue';

const appNotificationGroupName = 'app-notifications';

export default class NotificationService {
    public static error(message: string) {
        Vue.notify({
            group: appNotificationGroupName,
            text: message,
            title: 'Error',
            type: 'error'
        });
    }

    public static success(message: string) {
        Vue.notify({
            group: appNotificationGroupName,
            text: message,
            title: 'Success',
            type: 'success'
        });
    }

    public static warn(message: string) {
        Vue.notify({
            group: appNotificationGroupName,
            text: message,
            title: 'Warning',
            type: 'warn'
        });
    }
}