import useApi from 'src/composables/UseApi'

export default function metricsService() {
    const { list } = useApi('metrics')

    return {
        list
    }
}
