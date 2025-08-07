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
        label="Nome do Squad"
        lazy-rules
        class="col-md-6 col-xs-12"
        :rules="[val => val && val.length > 0 || 'Campo Obrigatório!']"
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
          :to="{ name: 'squads' }"
          outline
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import squadsService from 'src/services/squadsService'
import { useRouter, useRoute } from 'vue-router'
import ViewHeader from 'components/ViewHeader.vue'
import notifications from '../utils/notifications'
import { activeInactive } from 'src/constants/statusOptions'

const headerProps = {
  title: '',
  btnIcon: 'format_list_numbered',
  btnName: 'Listar',
  btnTo: 'squads'
}

export default defineComponent({
  name: 'SquadsForm',
  components: { ViewHeader },
  props: {
    user: { type: Object, required: true }
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { post, getByID, update } = squadsService()
    const { notifySuccess, notifyError } = notifications()

    const form = ref({
      name: null,
      status: null
    })

    const isEditMode = computed(() => !!route.params.id)
    headerProps.title = isEditMode.value ? 'Editar Squad' : 'Cadastrar Squad'

    onMounted(async () => {
      if (route.params.id) {
        await getSquad(route.params.id)
      }
    })

    const onSubmit = async () => {
      form.value.id ? updateSquad() : createSquad()
    }

    const getSquad = async (id) => {
      try {
        const { data } = await getByID(id)
        const squadData = data.data

        form.value = {
          ...squadData,
          status: squadData.status
        }
      } catch (error) {
        notifyError(error.response?.data?.message || 'Erro ao buscar Squad.')
        router.push({ name: 'squads' })
      }
    }

    const updateSquad = async () => {
      try {
        await update(makePayload(), form.value.id)
        notifySuccess('Squad atualizado com sucesso!')
        router.push({ name: 'squads' })
      } catch (error) {
        Object.keys(error.response?.data?.errors || {}).forEach(key => {
          notifyError(error.response.data.errors[key])
        })
      }
    }

    const createSquad = async () => {
      try {
        await post(makePayload())
        notifySuccess('Squad criado com sucesso!')
        router.push({ name: 'squads' })
      } catch (error) {
        Object.keys(error.response?.data?.errors || {}).forEach(key => {
          notifyError(error.response.data.errors[key])
        })
      }
    }

    const makePayload = () => ({
      name: form.value.name,
      status: form.value.status?.id ?? form.value.status
    })

    return {
      onSubmit,
      form,
      headerProps,
      activeInactive
    }
  }
})
</script>
