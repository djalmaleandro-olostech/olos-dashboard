<template>
  <div class="q-pa-md">
    <ViewHeader
      :title="headerProps.title"
      :btnTo="headerProps.btnTo"
      :btnIcon="headerProps.btnIcon"
      :btnName="headerProps.btnName"
    />
    <q-form @submit="onSubmit" class="row q-col-gutter-sm">
      <q-input
        outlined
        v-model="form.name"
        label="Nome"
        lazy-rules
        class="col-md-6 col-xs-12"
        :rules="[val => val && val.length > 0 || 'Campo Obrigatório!']"
      />

      <q-input
        outlined
        v-model="form.email"
        label="Email"
        lazy-rules
        class="col-md-6 col-xs-12"
        :rules="[val => val && val.length > 0 || 'Campo Obrigatório!']"
      />

      <q-input
        outlined
        v-model="form.jira_account_id"
        label="Jira Account ID"
        class="col-md-6 col-xs-12"
      />

      <q-select
        label="Status"
        class="col-md-6 col-xs-12"
        outlined
        v-model="form.status"
        :options="activeInactive"
        option-label="name"
        emit-value
        map-options
        :rules="[val => !!val || 'Campo Obrigatório!']"
      />

      <q-select
        label="Squads"
        class="col-md-6 col-xs-12"
        outlined
        v-model="form.squads"
        :options="squadOptions"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        multiple
      />

      <div class="col-lg-12 col-xs-12">
        <q-btn
          label="Salvar"
          type="submit"
          class="float-right"
          color="primary"
          icon="save"
        />
        <q-btn
          label="Sair"
          color="primary"
          class="float-right q-mr-sm"
          icon="arrow_back"
          :to="{ name: 'employees' }"
          outline
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import employeesService from 'src/services/employeesService'
import squadsService from 'src/services/squadsService'
import { useRouter, useRoute } from 'vue-router'
import ViewHeader from 'components/ViewHeader.vue'
import notifications from '../utils/notifications'
import { activeInactive } from 'src/constants/statusOptions'

const headerProps = {
  title: '',
  btnIcon: 'format_list_numbered',
  btnName: 'Listar',
  btnTo: 'employees'
}

export default defineComponent({
  name: 'EmployeesForm',
  components: { ViewHeader },
  props: {
    employee: { type: Object, required: false }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { post, getByID, update } = employeesService()
    const { list: listSquads } = squadsService()
    const { notifySuccess, notifyError } = notifications()

    const form = ref({
      name: null,
      email: null,
      jira_account_id: '',
      status: null,
      squads: []
    })

    const isEditMode = computed(() => !!route.params.id)
    headerProps.title = isEditMode.value ? 'Editar Colaborador' : 'Cadastrar Colaborador'

    const squadOptions = ref([])

    onMounted(async () => {
      if (route.params.id) await getEmployee(route.params.id)
      await loadSquads()
    })

    const loadSquads = async () => {
      try {
        const { data } = await listSquads('/getactive')
        squadOptions.value = data.data
      } catch (error) {
        notifyError(error.response?.data?.message)
      }
    }

    const getEmployee = async id => {
      try {
        const { data } = await getByID(id)
        form.value = {
          name: data.data.name,
          email: data.data.email,
          jira_account_id: data.data.jira_account_id || '',
          status: data.data.status.id,
          squads: data.data.squads.map(s => s.id)
        }
      } catch (error) {
        notifyError(error.response?.data?.message)
        router.push({ name: 'employees' })
      }
    }

    const makePayload = () => ({
      name: form.value.name,
      email: form.value.email,
      jira_account_id: form.value.jira_account_id,
      status: form.value.status,
      squads: form.value.squads
    })

    const updateEmployee = async () => {
      try {
        await update(makePayload(), route.params.id)
        notifySuccess('Colaborador atualizado com sucesso!')
        router.push({ name: 'employees' })
      } catch (error) {
        Object.values(error.response.data.errors || {}).forEach(notifyError)
      }
    }

    const newEmployee = async () => {
      try {
        await post(makePayload())
        notifySuccess('Colaborador criado com sucesso!')
        router.push({ name: 'employees' })
      } catch (error) {
        Object.values(error.response.data.errors || {}).forEach(notifyError)
      }
    }

    const onSubmit = () => {
      isEditMode.value ? updateEmployee() : newEmployee()
    }

    return {
      form,
      onSubmit,
      headerProps,
      activeInactive,
      squadOptions
    }
  }
})
</script>
