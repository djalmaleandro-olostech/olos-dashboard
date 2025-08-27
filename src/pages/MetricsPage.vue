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
                label="Squad"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.squad"
                :options="selectOptions.squads"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                @update:model-value="selectFunctions.handleSquadChange"
            />
            <q-select
                label="Sprint"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.sprint"
                :options="selectOptions.sprints"
                option-label="name"
                option-value="id"
                emit-value
                map-options
            />
            <q-select
                label="Colaboradores"
                class="col-md-3 col-xs-12"
                dense
                v-model="filterData.employees"
                :options="selectOptions.employees"
                option-label="name"
                option-value="id"
                multiple
                emit-value
                map-options
                @update:model-value="selectFunctions.handleEmployeeChange"
            />
            <q-btn
                :disabled="filterData.sprint == null || loading"
                class="col-md-2 offset-md-1 col-xs-12 q-mt-md"
                size="sm"
                :loading="loading"
                color="primary"
                label="Obter Métricas"
                @click="getMetrics"
            />
        </q-form>
		<div class="row q-col-gutter-md q-mt-lg">
			<!-- Chart 1 -->
			<div class="col-12 col-md-12">
				<q-card>
					<q-card-section style="height: 50vh;">
						<div class="text-subtitle1">Estimado x Real + Bugs</div>
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
       <q-card class="q-mt-lg">
            <q-card-section>
                <div class="text-subtitle1">Detalhe de Tarefas</div>
            </q-card-section>
             <q-table
                :rows="rows"
                :columns="columns"
                row-key="name"
            >
                <template v-slot:top-right>
					<q-btn
                        :disabled="rows.length < 1 && bugsRows.length < 1"
                        label="Exportar PDF" 
                        icon="picture_as_pdf"
                        size="sm"
						color="primary"
                        @click="exportPDF"
					/>
				</template>
                <template v-slot:body-cell-key="props">
                    <q-td :props="props">
                        <a 
                            :href="`https://olostecnologia.atlassian.net/browse/${props.row.key}`" 
                            target="_blank" 
                            class="text-primary text-bold"
                        >
                            {{ props.row.key }}
                        </a>
                    </q-td>
                </template>
            </q-table>
        </q-card>
        <q-card class="q-mt-lg">
            <q-card-section>
                <div class="text-subtitle1">Bugs</div>
            </q-card-section>

            <q-table
                :rows="bugsRows"
                :columns="bugsColumns"
                row-key="name"
            >

                <template v-slot:body-cell-key="props">
                    <q-td :props="props">
                        <a 
                            :href="`https://olostecnologia.atlassian.net/browse/${props.row.key}`" 
                            target="_blank" 
                            class="text-primary text-bold"
                        >
                            {{ props.row.key }}
                        </a>
                    </q-td>
                    
                </template>
                <template v-slot:body-cell-parentkey="props">
                    <q-td :props="props">
                        <a 
                            :href="`https://olostecnologia.atlassian.net/browse/${props.row.parentkey}`" 
                            target="_blank" 
                            class="text-primary text-bold"
                        >
                            {{ props.row.parentkey }}
                        </a>
                    </q-td>
                    
                </template>
            </q-table>
        </q-card>
    </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts'
import { defineComponent, ref, onMounted } from 'vue'
import ViewHeader from 'components/ViewHeader.vue'
import squadsService from 'src/services/squadsService'
import metricsService from 'src/services/metricsService'
import employeesService from 'src/services/employeesService'
import sprintsService from 'src/services/sprintsService'
import notifications from '../utils/notifications'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const headerProps = {
    title: 'Metricas',
    btnIcon: 'add',
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
        const { list } = metricsService()
        const { list: listSquads } = squadsService()
        const { list: listEmployees } = employeesService()
        const { list: listSprints } = sprintsService()
        const { notifyError } = notifications()
        const loading = ref(false);
        const rows = ref([])
        const bugsRows = ref([])
        const columns = [
            { label: 'Tarefa', field: 'key', name: 'key', sortable: true, align: 'left' },
            { label: 'Colaborador', field: 'employee_name', name: 'employee_name', sortable: true, align: 'left' },
            { label: 'Estimado (h)', field: 'estimate_hours', name: 'estimate_hours', sortable: true, align: 'left' },
            { label: 'Real (h)', field: 'spent_hours', name: 'spent_hours', sortable: true, align: 'left' },
            { label: 'Desvio (%)', field: 'deviation', name: 'deviation', sortable: true, align: 'left' },
        ];

        const bugsColumns = [
            { label: 'Tarefa', field: 'key', name: 'key', sortable: true, align: 'left' },
            { label: 'História', field: 'parentkey', name: 'parentkey', sortable: true, align: 'left' },
            { label: 'Colaborador', field: 'employee_name', name: 'employee_name', sortable: true, align: 'left' },
            { label: 'Real (h)', field: 'spent_hours', name: 'spent_hours', sortable: true, align: 'left' },
        ];

	 	const filterData = ref({
            squad: null,
            employees: [],
            sprint: null,
        })

		const selectOptions = ref({
            squads: [],
            employees: [],
            sprints: [],
        });
        
        onMounted(async () => {
            getSquads();
		})

        const getSquads = async () => {
            try {
                const squads = await listSquads()		
                selectOptions.value.squads = squads.data.data
            } catch (error) {
                notifyError('Erro ao carregar categorias ou contas.')
            }
        }

        const getEmployees = async (squadId) => {
            try {
                const employees = await listEmployees("", {squad_id: squadId})		
                selectOptions.value.employees = [
                    { id: "all", name: "Todos" }, 
                    ...employees.data.data
                ];
                filterData.value.employees = ["all"];
            } catch (error) {
                notifyError('Erro ao carregar categorias ou contas.')
            }
        }

        const getSprints = async (squadId) => {
            try {
                const sprints = await listSprints("", {squad_id: squadId})		
                selectOptions.value.sprints = sprints.data.data;
                filterData.value.sprint = sprints.data.data[0].id;
            } catch (error) {
                notifyError('Erro ao carregar categorias ou contas.')
            }
        }

        const getMetrics = async () => {
            loading.value = true;
            try {
                const { data } = await list('', getReqParams());
                console.log(data.data);
                
                rows.value = data.data.table_data;
                bugsRows.value = data.data.table_data_bugs;
			    updateChartData(data.data.metrics)
                
            } catch (error) {
                console.error(error); 
                notifyError('Erro ao obter métricas.')
            } finally {
                loading.value = false; // re-enable button
            }
        }        

         const getReqParams = () => {
           
            const queryParams = {
                sprint: filterData.value.sprint,
                employees: [...filterData.value.employees]
            };

            if(filterData.value.employees[0] == 'all'){
                queryParams.employees = selectOptions.value.employees
                    .filter(emp => emp.id !== "all").map(emp => emp.id);
            };

            return queryParams;
        }
    
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


        const selectFunctions = {
			handleSquadChange: (squadId) => {
                getEmployees(squadId);
                getSprints(squadId);
			},

            handleEmployeeChange: (selected) => {                
                if (selected.length == 0 || selected.at(-1) == "all") {
                    filterData.value.employees = ["all"];                 
                    return;
                }

                filterData.value.employees = selected.filter(id => id !== "all");

                if (filterData.value.employees.length === selectOptions.value.employees.length - 1) {
                    filterData.value.employees = ["all"];
                }
            } 
        }

        const exportPDF = () => {
            const doc = new jsPDF();

            const sprint = selectOptions.value.sprints.find(
                item => item.id === filterData.value.sprint
            );

            let titleTasks = false;
            let titleBugs = false;

            autoTable(doc, {
                head: [columns.map(col => col.label)],
                body: rows.value.map(row => columns.map(col => row[col.field])),
                startY: 20,
                didDrawPage: (data) => {
                    if (!titleTasks) {
                        doc.setFontSize(14);
                        doc.text(`Detalhe de Tarefas - ${sprint.name}`, 14, 15);
                        titleTasks = true;
                    }
                }
            });

            autoTable(doc, {
                head: [bugsColumns.map(col => col.label)],
                body: bugsRows.value.map(row => bugsColumns.map(col => row[col.field])),
                startY: doc.lastAutoTable.finalY + 15,
                didDrawPage: (data) => {
                    if (!titleBugs) {
                        doc.setFontSize(14);
                        doc.text(`Bugs - ${sprint.name}`, 14, doc.lastAutoTable.finalY + 10);
                        titleBugs = true;
                    }
                }
            });

            doc.save(`${sprint?.name || "sprint"}_metricas.pdf`);
        };
    
        return {
            headerProps,
            loading,
			filterData,
            columns,
            bugsColumns,
            rows,
            bugsRows,
            selectFunctions,
            getMetrics,
            exportPDF,
			selectOptions,
			chartOptions1,
			series1
        }
    }
})
</script>
