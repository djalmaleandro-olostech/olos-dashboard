import useApi from 'src/composables/UseApi'

export default function employeesService() {
    const { list, getByID, post, update, changeStatus, destroy } = useApi('employees')

    return {
        list,
        getByID,
        post,
        update,
        changeStatus,
        destroy
    }
}
