<template>
    <div class="q-pa-md">
		<router-view />
		<ViewHeader
			:title="headerProps.title"
			:btnTo="headerProps.btnTo"
			:btnIcon="headerProps.btnIcon"
			:btnName="headerProps.btnName"
		/>
		 <q-form class="row q-col-gutter-sm q-mb-md">
            <q-select
                label="Squad / Projeto"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.payment_type"
                :options="selectOptions.payment_type"
                option-label="name"
                option-value="id"
                multiple
                emit-value
                map-options
            />
            <q-select
                label="Board"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.category"
                :options="selectOptions.category"
                option-label="name"
                option-value="id"
                multiple
                emit-value
                map-options
            />
			<q-select
                label="Sprint"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.category"
                :options="selectOptions.category"
                option-label="name"
                option-value="id"
                multiple
                emit-value
                map-options
            />
        </q-form>
		<div class="row q-col-gutter-md q-mt-lg">
			<!-- Chart 1 -->
			<div class="col-12 col-md-12">
				<q-card>
					<q-card-section style="height: 50vh;">
						<div class="text-subtitle1">Estimado x Real + Bugs </div>
						<apexchart
							height="95%"
							type="bar"
							:options="chartOptions1"
							:series="series1"
						/>
					</q-card-section>
				</q-card>
			</div>
		</div>
    </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts'
import { defineComponent, ref, onMounted } from 'vue'
import ViewHeader from 'components/ViewHeader.vue'

const headerProps = {
    title: 'Metricas',
    btnTo: 'rolesForm',
    btnIcon: 'add',
    btnName: 'Adicionar'
}

export default defineComponent({
    name: 'MetricsPage',
    components: { ViewHeader, apexchart: ApexChart },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup () {

	 	const filterData = ref({
            type: 'all',
            payment_type: ['all'],
            refresh: { payment_type: false, category: false },
            category: ['all']
        })

		const selectOptions = ref({
            payment_type: [
                {id: 'all', name: 'Todos'},
                {id: 'single', name: 'Único'},
                {id: 'installment', name: 'Parcelado'},
                {id: 'recurrent', name: 'Recorrente'}
            ],
            category: []
        });

    
		const categories = ref([])
		const series1 = ref([])

		const chartOptions1 = ref({
			chart: { id: 'metrics', stacked: false },
			xaxis: { categories: categories.value },
			plotOptions: { bar: { columnWidth: '50%' } },
			colors: ['#005392', '#ff8c28', '#db2c2c'],
			legend: { position: 'bottom' },
			yaxis: { min: 0 },
		})
		

		function updateChartData(dataFromApi) {
			categories.value = dataFromApi.map(dev => dev.name)
		
			series1.value = [
				{ name: 'Estimado (h)', data: dataFromApi.map(dev => dev.est), color: '#005392' },
				{ name: 'Real (h)',     data: dataFromApi.map(dev => dev.real), color: '#ff8c28' },
				{ name: 'Bugs Criados', data: dataFromApi.map(dev => dev.bugs), color: '#db2c2c' },
			]
			
			chartOptions1.value = {
				...chartOptions1.value,
				xaxis: { categories: categories.value }
			}
		}

        onMounted(async () => {
		//const response = await fetch('/api/performance')
		//const data = await response.json()
		const data = [
				{ "name": "User 1", "est": 5, "real": 4, "bugs": 1 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
				{ "name": "User 3", "est": 6, "real": 5, "bugs": 2 },
				{ "name": "User 4", "est": 7, "real": 8, "bugs": 4 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
				{ "name": "User 2", "est": 8, "real": 9, "bugs": 3 },
			];
			updateChartData(data)
		})

    
        return {
            headerProps,
			filterData,
			selectOptions,
			chartOptions1,
			series1
        }
    }
})
</script>
