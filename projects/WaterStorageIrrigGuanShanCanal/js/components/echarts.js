

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
        chart: null
        return {
        }
    },
    methods: {
        initEcharts: function(){
            this.chart = echarts.init(document.getElementById(this.chartId));
            this.chart.setOption(this.option);
        },
        resizeChart() {
            if (this.chart) {
                console.log('resizeChart');
                this.chart.resize();
                this.updatedOptions(); // 调整视窗大小时也更新 grid.left
            }
        },
        getGridLeft() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) { // 手機或平板
                return '20%';
            } else if (screenWidth <= 1200) { 
                return '15%';
            } else { // 桌面
                return '100px';
            }
        },
        updatedOptions() {
            
            // 確保 this.option.grid 已初始化
            if (!this.option.grid) {
                this.option.grid = {}; // 初始化為空物件
            }
        
            // 設定 left 屬性
            this.option.grid.left = this.getGridLeft();
            
            // 更新圖表選項
            this.chart.setOption(this.option);
        }
        ,
    }, 
    mounted() {
        this.initEcharts();
        window.addEventListener('resize', this.resizeChart);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeChart);
    },
    template: `
    <div class="chart_wrap">
        <div :id="chartId" style="width:100%;height:300px;"></div>
    </div>
    `
};

