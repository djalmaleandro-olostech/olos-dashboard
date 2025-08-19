import useApi from 'src/composables/UseApi'

export default function sprintsService() {
    const { list, getByID, post, update, changeStatus, destroy } = useApi('sprints')

    return {
        list,
        getByID,
        post,
        update,
        changeStatus,
        destroy
    }
}
