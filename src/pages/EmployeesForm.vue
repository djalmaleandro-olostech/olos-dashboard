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

      <q-select
        label="Cargo"
        class="col-md-3 col-xs-12"
        outlined
        v-model="form.role"
        :options="roles"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        :rules="[val => !!val || 'Campo Obrigatório!']"
      />

      <q-select
        label="Status"
        class="col-md-3 col-xs-12"
        outlined
        v-model="form.status"
        :options="activeInactive"
        option-label="name"
        emit-value
        map-options
        :rules="[val => !!val || 'Campo Obrigatório!']"
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
import rolesService from 'src/services/rolesService'
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

    const roles = ref([])
    const squadOptions = ref([])
    const form = ref({
      name: null,
      email: null,
      role: null,
      status: null,
      squads: []
    })

    const isEditMode = computed(() => !!route.params.id)
    headerProps.title = isEditMode.value ? 'Editar Colaborador' : 'Cadastrar Colaborador'


    onMounted(async () => {
      if (route.params.id) await getEmployee(route.params.id)
      await loadSquads()
      await getRoles()
    })

    const loadSquads = async () => {
      try {
        const { data } = await listSquads('/getactive')
        squadOptions.value = data.data
      } catch (error) {
        notifyError(error.response?.data?.message)
      }
    }

     const getRoles = async () => {
        try {
            const { list } = rolesService()
            const { data } = await list("/getactive")
            roles.value = data.data
        } catch (error) {
            notifyError(error.response.data.message)
        }
    }

    const getEmployee = async id => {
      try {
        const { data } = await getByID(id)
        form.value = {
          name: data.data.name,
          email: data.data.email,
          role: data.data.role.id,
          status: data.data.status,
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
      role_id: form.value.role,
      status: form.value.status.id,
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
      roles,
      onSubmit,
      headerProps,
      activeInactive,
      squadOptions
    }
  }
})
</script>
