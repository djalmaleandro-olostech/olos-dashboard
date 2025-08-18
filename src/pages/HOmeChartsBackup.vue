<template>
  <q-page class="q-pa-md">
    <div>
	
      <div class="row q-col-gutter-md q-mt-lg">
        <!-- Chart 1 -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section style="height: 40vh;">
              <div class="text-subtitle1">Métricas</div>
              <apexchart
                height="95%"
                type="bar"
                :options="chartOptions1"
                :series="series1"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Chart 2 -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section style="height: 40vh;">
              <div class="text-subtitle1">Exemplo 2</div>
              <apexchart
                height="95%"
                type="line"
                :options="chartOptions2"
                :series="series2"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Chart 3 -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section style="height: 40vh;">
              <div class="text-subtitle1">Exemplo 3</div>
              <apexchart
                height="95%"
                type="area"
                :options="chartOptions3"
                :series="series3"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Chart 4 -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section style="height: 40vh;">
              <div class="text-subtitle1">Exemplo 4</div>
              <apexchart
                height="95%"
                type="pie"
                :options="chartOptions4"
                :series="series4"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ApexChart from 'vue3-apexcharts'
import { ref, onMounted } from 'vue'

defineProps(['user'])

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
		{ "name": "User 1User 1 User 1 User 1", "est": 5, "real": 4, "bugs": 1 },
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

// Chart 2 - Line
const series2 = ref([{ name: 'Lucro', data: [3000, 4200, 3900, 5100, 6100, 5800] }])
const chartOptions2 = ref({
  chart: { id: 'lucro-mensal' },
  xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'] }
})

// Chart 3 - Area
const series3 = ref([{ name: 'Clientes', data: [5, 10, 15, 20, 30, 25] }])
const chartOptions3 = ref({
  chart: { id: 'clientes-ativos' },
  xaxis: { categories: ['2020', '2021', '2022', '2023', '2024', '2025'] }
})

// Chart 4 - Pie
const series4 = ref([44, 33, 12, 11])
const chartOptions4 = ref({
  labels: ['Categoria A', 'Categoria B', 'Categoria C', 'Categoria D']
})
</script>

<script>
export default {
  name: 'HomePage',
  components: {
    apexchart: ApexChart,
  },
}
</script>
