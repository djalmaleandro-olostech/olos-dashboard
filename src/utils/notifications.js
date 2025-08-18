import { Notify } from 'quasar'

export default function notifications() {

    const notifySuccess = (message) => {
        Notify.create({
            group: false,
            message,
            icon: 'check',
            color: 'positive'
        })
    }

    const notifyWarning = (message) => {
        Notify.create({
            group: false,
            message,
            icon: 'warning',
            color: 'warning'
        })
    }

    const notifyError = (message) => {
        Notify.create({
            group: false,
            message,
            icon: 'error',
            color: 'negative'
        })
    }

    return {
        notifySuccess,
        notifyError,
        notifyWarning
    }
}
