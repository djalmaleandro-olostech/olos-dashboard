<template>
  <div class="q-pa-md">
    <router-view />
    <ViewHeader
      :title="headerProps.title"
      :btnTo="headerProps.btnTo"
      :btnIcon="headerProps.btnIcon"
      :btnName="headerProps.btnName"
    />
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="pagination"
      :loading="loading"
      :rows-per-page-options="[5, 10, 20]"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Busca">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
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
import sprintsService from 'src/services/sprintsService'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ViewHeader from 'components/ViewHeader.vue'
import notifications from '../utils/notifications'

const headerProps = {
  title: 'Sprints',
  btnTo: 'sprintsForm',
  btnIcon: 'add',
  btnName: 'Adicionar'
}

export default defineComponent({
  name: 'SprintPage',
  components: { ViewHeader },
  setup () {
    const $q = useQuasar()
    const { notifySuccess, notifyError } = notifications()
    const router = useRouter()
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
    const { list, destroy } = sprintsService()

    const columns = [
      { label: 'ID', field: 'id', name: 'id', sortable: true, align: 'left' },
      { label: 'Nome', field: 'name', name: 'name', sortable: true, align: 'left' },
      { label: 'Squad', field: row => row.squad?.name ?? 'Sem squad', name: 'squad', align: 'left' },
      { label: 'Data Criação Jira', field: 'created_date_jira', name: 'created_date_jira', sortable: true, align: 'left' },
      { label: 'Data Inicio', field: 'start_date_jira', name: 'start_date_jira', sortable: true, align: 'left' },
      { label: 'Data Fim', field: 'end_date_jira', name: 'end_date_jira', sortable: true, align: 'left' },
      { label: 'Jira ID', field: 'jira_id', name: 'jira_id', sortable: true, align: 'left' },
      { label: 'Criado em', field: 'created_at', name: 'created_at', sortable: true, align: 'left' },
      { label: 'Ações', field: 'actions', name: 'actions', align: 'right' }
    ]

    onMounted(() => {
      getSprints()
    })

    const getSprints = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.value.page,
          per_page: pagination.value.rowsPerPage,
          filter: filter.value
        }
        const { data } = await list('', params)
        rows.value = data.data
        pagination.value.rowsNumber = data.meta.total
      } catch (error) {
        console.error(error)
        notifyError('Erro ao carregar as sprints.')
      } finally {
        loading.value = false
      }
    }

    const onRequest = (params) => {
      const { page, rowsPerPage } = params.pagination
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      getSprints()
    }

    const handleDestroy = async (id) => {
      $q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente excluir o registro?',
        cancel: { label: 'Cancelar', color: 'primary', outline: true },
        ok: { label: 'Confirmar', color: 'primary' },
        persistent: true
      }).onOk(async () => {
        try {
          await destroy(id)
          $q.notify({ message: `Registro ${id} removido!`, icon: 'check', color: 'positive' })
          await getSprints()
        } catch (error) {
          $q.notify({ message: 'Erro ao excluir registro!', icon: 'times', color: 'negative' })
        }
      })
    }

    return {
      headerProps,
      rows,
      columns,
      filter,
      pagination,
      loading,
      onRequest,
      handleDestroy
    }
  }
})
</script>
