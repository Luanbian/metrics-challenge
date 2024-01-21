<template>
  <div>
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
            <h3 class="card-title"><i class="tim-icons icon-calendar-60 text-primary "></i> MRR por assinatura</h3>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="purple-line-chart"
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
            <h3 class="card-title"><i class="tim-icons icon-chart-bar-32 text-info "></i>MRR geral</h3>
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
            <h3 class="card-title"><i class="tim-icons icon-single-02 text-success "></i> Número de clientes por assinatura </h3>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="purple-line-chart"
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
            <h3 class="card-title"><i class="tim-icons icon-coins text-warning "></i>Número de clientes atual por assinatura</h3>
          </template>
          <div class="chart-area">
            <bar-chart style="height: 100%"
                       chart-id="blue-bar-chart"
                       :chart-data="currencyClien.chartData"
                       :gradient-colors="currencyClien.gradientColors"
                       :gradient-stops="currencyClien.gradientStops"
                       :extra-options="currencyClien.extraOptions">
            </bar-chart>
          </div>
        </card>
      </div>
    </div>
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
          allData: [
            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
          ],
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
          extraOptions: chartConfigs.purpleChartOptions,
          chartData: {
            labels: ['30', '360', '365', '730', 'total'],
            datasets: [{
              label: "Data",
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
              data: [80, 100, 70, 80, 120, 80],
            }]
          },
          gradientColors: config.colors.purpleGradient,
          gradientStops: [1, 0.2, 0],
        },
        clientsPerSignature: {
          extraOptions: chartConfigs.purpleChartOptions,
          chartData: {
            labels: ['30', '360', '365', '730', 'total'],
            datasets: [{
              label: "Data",
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
              data: [80, 100, 70, 80, 120, 80],
            }]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.2, 0],
        },
        currencyClien: {
          extraOptions: chartConfigs.barChartOptions,
          chartData: {
            labels: ['30', '360', '365', '730'],
            datasets: [{
              fill: true,
              borderColor: config.colors.warning,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [53, 20, 10, 80, 100, 45],
            }]
          },
          gradientColors: config.colors.warningGradient,
          gradientStops: [1, 0.4, 0],
        },
        mrrGeneral: {
          extraOptions: chartConfigs.barChartOptions,
          chartData: {
            labels: ['30', '360', '365', '730'],
            datasets: [{
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [53, 20, 10, 80, 100, 45],
            }]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
        }
      }
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
        return this.$t('dashboard.chartCategories');
      }
    },
    methods: {
      initBigChart(index) {
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
