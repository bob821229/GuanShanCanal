

export default {
    props: {
        chartId: {
          type: String,
          required: true
        },
        option: {
          type: Object,
          required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    methods: {

        initEcharts: function(){
            var myChart = echarts.init(document.getElementById(this.chartId));
            myChart.setOption(this.option);
        }
    }, 
    mounted() {
        this.initEcharts();
    },
    template: `
    <div class="chart_wrap">
        <div :id="chartId" style="width:100%;height:300px;"></div>
    </div>
    `
};

