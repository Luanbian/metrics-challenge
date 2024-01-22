<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">Informações gerais</h4>
          <div class="table-responsive">
            <user-table></user-table>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="'text-left'">
                <h2 class="card-title"><i class="tim-icons icon-alert-circle-exc text-danger"></i> Churn Rate mensal</h2>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle"
                     :class="'float-right'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: bigLineChart.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="initBigChart(index)"
                           name="options" autocomplete="off"
                           :checked="bigLineChart.activeIndex === index">
                    {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        ref="bigChart"
                        chart-id="big-line-chart"
                        :chart-data="bigLineChart.chartData"
                        :gradient-colors="bigLineChart.gradientColors"
                        :gradient-stops="bigLineChart.gradientStops"
                        :extra-options="bigLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
      <div class="col-lg-6 col-md-12" :class="'text-left'">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="'text-left'">
                <h3 class="card-title"><i class="tim-icons icon-calendar-60 text-primary "></i> MRR por assinatura</h3>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle" :class="'float-right'" data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories"
                           :key="option"
                           class="btn btn-sm btn-primary btn-simple"
                           :class="{active: mrrPerSignature.activeIndex === index}"
                           :id="index">
                      <input type="radio"
                             @click="initMrrPerSignature(index)"
                             name="options" autocomplete="off"
                             :checked="mrrPerSignature.activeIndex === index">
                      {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="purple-line-chart"
                        ref="mrrPerSignature"
                        :chart-data="mrrPerSignature.chartData"
                        :gradient-colors="mrrPerSignature.gradientColors"
                        :gradient-stops="mrrPerSignature.gradientStops"
                        :extra-options="mrrPerSignature.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
      <div class="col-lg-6 col-md-12" :class="'text-left'">
        <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-chart-bar-32 text-info "></i> MRR geral</h3>
          </template>
          <div class="chart-area">
            <bar-chart style="height: 100%"
                       chart-id="blue-bar-chart"
                       :chart-data="mrrGeneral.chartData"
                       :gradient-stops="mrrGeneral.gradientStops"
                       :extra-options="mrrGeneral.extraOptions">
            </bar-chart>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-md-12" :class="'text-left'">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="'text-left'">
                <h3 class="card-title"><i class="tim-icons icon-single-02 text-success "></i> Número de clientes por assinatura </h3>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle" :class="'float-right'" data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories"
                           :key="option"
                           class="btn btn-sm btn-primary btn-simple"
                           :class="{active: clientsPerSignature.activeIndex === index}"
                           :id="index">
                      <input type="radio"
                             @click="initClientsPerSignature(index)"
                             name="options" autocomplete="off"
                             :checked="clientsPerSignature.activeIndex === index">
                      {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="purple-line-chart"
                        ref="clientsPerSignature"
                        :chart-data="clientsPerSignature.chartData"
                        :gradient-colors="clientsPerSignature.gradientColors"
                        :gradient-stops="clientsPerSignature.gradientStops"
                        :extra-options="clientsPerSignature.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
      <div class="col-lg-6 col-md-12" :class="'text-left'">
        <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-coins text-warning "></i> Número de clientes atual por assinatura</h3>
          </template>
          <div class="chart-area">
            <bar-chart style="height: 100%"
                       chart-id="blue-bar-chart"
                       :chart-data="currencyClients.chartData"
                       :gradient-colors="currencyClients.gradientColors"
                       :gradient-stops="currencyClients.gradientStops"
                       :extra-options="currencyClients.extraOptions">
            </bar-chart>
          </div>
        </card>
      </div>
    </div>
    <div>
      <p>Api response</p>
      <pre>{{ JSON.stringify(apiResponse) }}</pre>
    </div>
  </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  import * as chartConfigs from '@/components/Charts/config'
  import UserTable from './Dashboard/UserTable';
  import config from '@/config';
  import store from '../store';

  export default {
    components: {
      LineChart,
      BarChart,
      UserTable
    },
    data() {
      return {
        bigLineChart: {
          allData: [],
          activeIndex: 0,
          chartData: {
            datasets: [{ }],
            labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
          },
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.dangerGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        },
        mrrPerSignature: {
          allData: [],
          activeIndex: 0,
          chartData: {
            datasets: [{ }],
            labels: ['30', '360', '365', '730', 'total']
          },
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.purpleGradient,
          gradientStops: [1, 0.2, 0],
          categories: []
        },
        clientsPerSignature: {
          allData: [],
          activeIndex: 0,
          chartData: {
            datasets: [{ }],
            labels: ['30', '360', '365', '730']
          },
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        },
        currencyClients: {
          allData: [],
          chartData: {
            labels: ['30', '360', '365', '730'],
            datasets: [{ }]
          },
          extraOptions: chartConfigs.barChartOptions,
          gradientColors: config.colors.warningGradient,
          gradientStops: [1, 0.4, 0],
        },
        mrrGeneral: {
          allData: [],
          chartData: {
            labels: ['30', '360', '365', '730'],
            datasets: [{ }]
          },
          extraOptions: chartConfigs.barChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
        }
      }
    },
    created() {
      this.updateChartData();
      this.updateClientsPerSignature();
      this.updateMrrPerSignatureChart();
      this.defineGeneralMrr();
      this.defineCurrencyClients();
    },
    computed: {
      apiResponse() {
        return store.state.response;
      },
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      },
      bigLineChartCategories() {
        return Object.keys(this.apiResponse.churn.perYear);
      }
    },
    methods: {
      updateChartData() {
        if (this.apiResponse && this.apiResponse.churn && this.apiResponse.churn.perYear) {
          const years = Object.keys(this.apiResponse.churn.perYear);

          this.bigLineChart.allData = [];
          const orderedMonths = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

          const all = [];
          years.forEach((year) => {
            const organized = orderedMonths.map((month) => {
              return parseFloat(this.apiResponse.churn.perYear[year].monthlyChurnRate[month]);
            })
            all.push(organized);
          });
          this.bigLineChart.allData = all;
        } else {
          this.bigLineChart.allData = [];
          this.bigLineChart.chartData.datasets = [{}];
          this.bigLineChart.categories = [];
        }
      },
      initBigChart(index) {
        this.updateChartData();
        let chartData = {
          datasets: [{
            fill: true,
            borderColor: config.colors.danger,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.danger,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.danger,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.bigLineChart.allData[index]
          }],
          labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        }
        this.$refs.bigChart.updateGradients(chartData);
        this.bigLineChart.chartData = chartData;
        this.bigLineChart.activeIndex = index;
      },
      updateMrrPerSignatureChart () {
        if (this.apiResponse && this.apiResponse.MRR && this.apiResponse.MRR.perYear) {
          const years = Object.keys(this.apiResponse.MRR.perYear);

          this.mrrPerSignature.allData = [];
          const orderedSignature = ["MRRMonthly", "MRRDays360", "MRRAnnually", "MRRBiennial", "MRR"];

          const all = [];
          years.forEach((year) => {
            const organized = orderedSignature.map((signature) => {
              return parseFloat(this.apiResponse.MRR.perYear[year][signature].value);
            })
            all.push(organized);
          });
          this.mrrPerSignature.allData = all;
        } else {
          this.mrrPerSignature.allData = [];
          this.mrrPerSignature.chartData.datasets = [{}];
          this.mrrPerSignature.categories = [];
        }
      },
      initMrrPerSignature(index) {
        this.updateMrrPerSignatureChart();
        let chartData = {
          datasets: [{
              fill: true,
              borderColor: config.colors.purple,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.purple,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.purple,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: this.mrrPerSignature.allData[index]
          }],
          labels: ['30', '360', '365', '730', 'total'],
        }
        this.$refs.mrrPerSignature.updateGradients(chartData);
        this.mrrPerSignature.chartData = chartData;
        this.mrrPerSignature.activeIndex = index;
      },
      defineGeneralMrr () {
        if (this.apiResponse && this.apiResponse.MRR && this.apiResponse.MRR.general) {
          const orderedSignature = ["MRRMonthly", "MRRDays360", "MRRAnnually", "MRRBiennial", "MRR"];
          const all = orderedSignature.map((signature) => {
            return parseFloat(this.apiResponse.MRR.general[signature].value);
          })
          this.mrrGeneral.allData = all;
          let chartData = {
            datasets: [{
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.mrrGeneral.allData,
            }],
            labels: ['30', '360', '365', '730', 'total'],
          }
          this.mrrGeneral.chartData = chartData;
        } else {
          this.mrrGeneral.allData = [];
        }
      },
      updateClientsPerSignature() {
        if (this.apiResponse && this.apiResponse.MRR && this.apiResponse.MRR.perYear) {
          const years = Object.keys(this.apiResponse.MRR.perYear);

          this.clientsPerSignature.allData = [];
          const orderedSignature = ["MRRMonthly", "MRRDays360", "MRRAnnually", "MRRBiennial"];

          const all = [];
          years.forEach((year) => {
            const organized = orderedSignature.map((signature) => {
              return parseFloat(this.apiResponse.MRR.perYear[year][signature].numberOfClients);
            })
            all.push(organized);
          });
          this.clientsPerSignature.allData = all;
        } else {
          this.clientsPerSignature.allData = [];
          this.clientsPerSignature.chartData.datasets = [{}];
          this.clientsPerSignature.categories = [];
        }
      },
      initClientsPerSignature(index) {
        this.updateClientsPerSignature();
        let chartData = {
          datasets: [{
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.clientsPerSignature.allData[index],
          }],
          labels: ['30', '360', '365', '730'],
        }
        this.$refs.clientsPerSignature.updateGradients(chartData);
        this.clientsPerSignature.chartData = chartData;
        this.clientsPerSignature.activeIndex = index;
      },
      defineCurrencyClients() {
        if (this.apiResponse && this.apiResponse.MRR && this.apiResponse.MRR.general) {
          const orderedSignature = ["MRRMonthly", "MRRDays360", "MRRAnnually", "MRRBiennial"];
          const all = orderedSignature.map((signature) => {
            return parseFloat(this.apiResponse.MRR.general[signature].numberOfClients);
          })
          const total = all.reduce((ac, act) => ac + act);
          all.push(total);
          this.currencyClients.allData = all;
          let chartData = {
            datasets: [{
              fill: true,
              borderColor: config.colors.warning,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.currencyClients.allData,
            }],
            labels: ['30', '360', '365', '730', 'total'],
          }
          this.currencyClients.chartData = chartData;
        } else {
          this.currencyClients.allData = [];
        }
      }
    },
    mounted() {
      this.i18n = this.$i18n;
      this.initBigChart(0);
    },
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
</style>
