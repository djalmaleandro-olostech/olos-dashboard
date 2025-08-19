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
        v-model="form.jira_id"
        label="ID Sprint Jira"
        lazy-rules
        class="col-md-6 col-xs-12"
        :rules="[val => val && val.length > 0 || 'Campo Obrigatório!']"
      />

      <q-select
        label="Squad"
        class="col-md-6 col-xs-12"
        outlined
        v-model="form.squad_id"
        :options="squadOptions"
        option-label="name"
        option-value="id"
        emit-value
        map-options
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
          :to="{ name: 'sprints' }"
          outline
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import sprintsService from 'src/services/sprintsService'
import squadsService from 'src/services/squadsService'
import { useRouter, useRoute } from 'vue-router'
import ViewHeader from 'components/ViewHeader.vue'
import notifications from '../utils/notifications'
import { activeInactive } from 'src/constants/statusOptions'

const headerProps = {
  title: '',
  btnIcon: 'format_list_numbered',
  btnName: 'Listar',
  btnTo: 'sprints'
}

export default defineComponent({
  name: 'SprintsForm',
  components: { ViewHeader },
  props: {
    sprint: { type: Object, required: false }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { post } = sprintsService()
    const { list: listSquads } = squadsService()
    const { notifySuccess, notifyError } = notifications()

    const form = ref({
      jira_id: null,
      squad_id: null
    })

    const isEditMode = computed(() => !!route.params.id)
    headerProps.title = isEditMode.value ? 'Editar Sprint' : 'Cadastrar Sprint'

    const squadOptions = ref([])

    onMounted(async () => {
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

    const makePayload = () => ({
      jira_id: form.value.jira_id,
      squad_id: form.value.squad_id
    })


    const newSprint = async () => {
      try {
        await post(makePayload())
        notifySuccess('Sprint criada com sucesso!')
        router.push({ name: 'sprints' })
      } catch (error) {
        Object.values(error.response.data.errors || {}).forEach(notifyError)
      }
    }

    const onSubmit = () => {
      newSprint()
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
