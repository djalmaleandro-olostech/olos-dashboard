import useApi from 'src/composables/UseApi'

export default function squadsService() {
    const { list, getByID, post, update, changeStatus, destroy } = useApi('squads')

    return {
        list,
        getByID,
        post,
        update,
        changeStatus,
        destroy
    }
}
