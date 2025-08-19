<template>
    <div class="q-pa-md">
    <router-view />
    <ViewHeader
        :title="headerProps.title"
        :btnTo="headerProps.btnTo"
        :btnIcon="headerProps.btnIcon"
        :btnName="headerProps.btnName"
    />
        <q-table :rows="rows" :columns="columns" row-key="name">
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-sm">
                    <q-btn
                        v-if="true == false"
                        :icon="props.row.status.name === 'Ativo' ? 'toggle_on' : 'toggle_off'"
                        color="secondary"
                        dense size="sm"
                        @click="handleChangeStatus(props.row.id)">
                        <q-tooltip class="bg-secondary">
                            {{ props.row.status.name === 'Ativo' ? 'Inativar' : 'Ativar' }}
                        </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="edit"
                        color="secondary"
                        dense size="sm"
                        @click="handleEdit(props.row.id)"
                    >
                        <q-tooltip class="bg-secondary">
                            Editar
                        </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="delete"
                        color="secondary"
                        dense size="sm"
                        @click="handleDestroy(props.row.id)"
                    >
                        <q-tooltip class="bg-secondary">Excluir</q-tooltip>
                    </q-btn>
                </q-td>

            </template>
        </q-table>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import squadsService from 'src/services/squadsService'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ViewHeader from 'components/ViewHeader.vue'
import notifications from '../utils/notifications'

const headerProps = {
    title: 'Squads',
    btnTo: 'squadsForm',
    btnIcon: 'add',
    btnName: 'Adicionar'
}

export default defineComponent({
    name: 'SquadsPage',
    components: { ViewHeader },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup () {
        const $q = useQuasar()
        const { notifySuccess, notifyError } = notifications()
        const router = useRouter()
        const rows = ref([])
        const { list, changeStatus, destroy } = squadsService()
        const columns = [
            {
                label: 'ID',
                field: 'id',
                name: 'id',
                sortable: true,
                align: 'left'
            },
            {
                label: 'Nome',
                field: 'name',
                name: 'name',
                sortable: true,
                align: 'left'
            },
            {
                label: 'Project Key Jira',
                field: 'project_key',
                name: 'project_key',
                sortable: true,
                align: 'left'
            },
            {
                label: 'Status',
                field: row => row.status.name,
                name: 'email',
                sortable: true,
                align: 'left'
            },
            {
                label: 'Ações',
                field: 'actions',
                name: 'actions',
                align: 'right'
            }
        ]

        onMounted(() => {
            getSquads()
        })

        const getSquads = async () => {
            try {
                const { data } = await list()
                console.log(data.data);
                
                rows.value = data.data
            } catch (error) {
                console.log(error)
            }
        }

        const handleChangeStatus = async (id) => {
            
            try {             
                $q.dialog({
                    title: 'Confirmação',
                    message: 'Deseja realmente alterar o status?',
                    cancel: {
                        label: 'Cancelar',
                        color: 'primary',
                        outline: true 
                    },
                    ok: {
                        label: 'Confirmar',
                        color: 'primary',
                    },
                    persistent: true
                }).onOk(async () => {
                    await changeStatus(id)
                    notifySuccess('Status alterado com sucesso!')
                    await getSquads()
                })
            } catch (error) {
                Object.keys(error.response.data.errors).forEach(key => {
                    notifyError(error.response.data.errors[key])
                })
            }
        }

        const handleEdit = (id) => {
            router.push({ name: 'squadsForm', params: { id } })
        }

        const handleDestroy = async (id) => {
            try {
                $q.dialog({
                    title: 'Confirmação',
                    message: 'Deseja realmente excluir o registro?',
                    cancel: {
                        label: 'Cancelar',
                        color: 'primary',
                        outline: true 
                    },
                    ok: {
                        label: 'Confirmar',
                        color: 'primary',
                    },
                    persistent: true
                }).onOk(async () => {
                    await destroy(id)
                    $q.notify({
                        message: `Registro ${id} removido!`,
                        icon: 'check',
                        color: 'positive'
                    })
                    await getSquads()
                })
            } catch (error) {
                $q.notify({
                    message: 'Erro ao excluir registro!',
                    icon: 'times',
                    color: 'negative'
                })
            }
        }

        return {
            headerProps,
            rows,
            columns,
            handleChangeStatus,
            handleEdit,
            handleDestroy
        }
    }
})
</script>
