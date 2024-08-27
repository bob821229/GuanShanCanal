import Map from './map.js'
import MyChart from '../components/echarts.js'

export default {
    components: {
        Map,
        MyChart,
    },
    inject: ['currentComponent'],
    data() {
        return {
            xAxisData:['100','101','102','103','104','105','106','107','108','109','110','111','112','113'], 
            option1 :{
                title: {
                  text: '近OO週網格雨量比較圖'
                },
                tooltip: {
                    valueFormatter: (value) => value + ' mm'
                },
                legend: {
                    show:false
                },
                xAxis: {
                    data: ['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
                    name:'民國年',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:12,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'集\n水\n區\n網\n格\n累\n積\n雨\n量\n(mm)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                      padding:[0,50,0,0],
                      fontSize:12,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name:'同期網格雨量',
                    type: 'bar',
                    data: [
                        { value: 5, itemStyle: { color: 'red' } },   // 100年
                        { value: 20 },                                // 101年
                        { value: 36 },                                // 102年
                        { value: 30 },                                // 103年
                        { value: 28 },                                // 104年
                        { value: 20 },                                // 105年
                        { value: 25 },                                // 106年
                        { value: 20 },                                // 107年
                        { value: 36 },                                // 108年
                        { value: 15 },                                // 109年
                        { value: 12 },                                // 110年
                        { value: 20 },                                // 111年
                        { value: 15 },                                // 112年
                        { value: 9, itemStyle: { color: 'red' } }    // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            { xAxis: '100', yAxis: 5 }, // 101年
                            { xAxis:'113', yAxis: 9 }, // 113年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史輪灌年' // 顯示標記的名稱
                            }
                        }
                    },
                  }
                ]
            },
            option2 :{
                title: {
                 text: '流量比較圖'
                },
                tooltip: {
                  trigger: 'axis',
                  valueFormatter: (value) => value + ' cms'
                },
                legend: {},
                xAxis: {
                    data: ['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
                    name:'民國年',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:12,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'日\n流\n量\n(cms)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,50,0,0],
                        fontSize:12,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name: '關山圳',
                    type: 'line',
                    data: [
                        { value: 10, itemStyle: { color: 'red' } }, // 100年
                        { value: 11 }, // 101年
                        { value: 13 }, // 102年
                        { value: 11 }, // 103年
                        { value: 12 }, // 104年
                        { value: 12 }, // 105年
                        { value: 9 },  // 106年
                        { value: 10 }, // 107年
                        { value: 11 }, // 108年
                        { value: 13 }, // 109年
                        { value: 11 }, // 110年
                        { value: 12 }, // 111年
                        { value: 12 }, // 112年
                        { value: 9, itemStyle: { color: 'red' } } // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            {  xAxis: '100', yAxis: 10 }, // 101年
                            {  xAxis:'113', yAxis: 9 } // 103年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史停灌年' // 顯示標記的名稱
                            }
                        },
                        // symbol: "circle"
                    },
                  },
                  {
                    name: '池上圳',
                    type: 'line',
                    data: [
                        { value: 1, itemStyle: { color: 'red' } }, // 100年
                        { value: 2 }, // 101年
                        { value: 2 }, // 102年
                        { value: 5 }, // 103年
                        { value: 3 }, // 104年
                        { value: 2 }, // 105年
                        { value: 0 },  // 106年
                        { value: 1 }, // 107年
                        { value: 2 }, // 108年
                        { value: 2 }, // 109年
                        { value: 5 }, // 110年
                        { value: 3 }, // 111年
                        { value: 2 }, // 112年
                        { value: 0, itemStyle: { color: 'red' } } // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            {  xAxis: '100', yAxis: 1 }, // 101年
                            {  xAxis:'113', yAxis: 0 } // 103年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史停灌年' // 顯示標記的名稱
                            }
                        }
                    },
                    
                  }
                ]
            },
            option3:{
                title: {
                //   text: '同期SPI'
                 text: 'SPI比較圖'
                },
                tooltip: {},
                legend: {
                    show:false
                //   data: ['销量']
                },
                xAxis: {
                    data: ['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
                    name:'民國年',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:12,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'SPI',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,50,0,0],
                        fontSize:12,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name: 'SPI',
                    type: 'bar',
                    data: [
                        { value: 5, itemStyle: { color: 'red' } },   // 100年
                        { value: 20 },                                // 101年
                        { value: 36 },                                // 102年
                        { value: 30 },                                // 103年
                        { value: 28 },                                // 104年
                        { value: 20 },                                // 105年
                        { value: 25 },                                // 106年
                        { value: 20 },                                // 107年
                        { value: 36 },                                // 108年
                        { value: 15 },                                // 109年
                        { value: 12 },                                // 110年
                        { value: 20 },                                // 111年
                        { value: 15 },                                // 112年
                        { value: 9, itemStyle: { color: 'red' } }    // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            { xAxis: '100', yAxis: 5 }, // 101年
                            { xAxis:'113', yAxis: 9 }, // 113年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史輪灌年' // 顯示標記的名稱
                            }
                        }
                    }
                  }
                ]
            },
            option4:{
                title: {
                 text: '水稻種植面積比較圖'
                },
                tooltip: {},
                legend: {
                  show:false
                },
                xAxis: {
                    data:['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
                    name:'民國年',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:12,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'種\n植\n面\n積\n(公頃)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,50,0,0],
                        fontSize:12,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name: '水稻種植面積',
                    type: 'bar',
                    data: [
                        { value: 5, itemStyle: { color: 'red' } },   // 100年
                        { value: 20 },                                // 101年
                        { value: 36 },                                // 102年
                        { value: 30 },                                // 103年
                        { value: 28 },                                // 104年
                        { value: 20 },                                // 105年
                        { value: 25 },                                // 106年
                        { value: 20 },                                // 107年
                        { value: 36 },                                // 108年
                        { value: 15 },                                // 109年
                        { value: 12 },                                // 110年
                        { value: 20 },                                // 111年
                        { value: 15 },                                // 112年
                        { value: 9, itemStyle: { color: 'red' } }    // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            { xAxis: '100', yAxis: 5 }, // 101年
                            { xAxis:'113', yAxis: 9 }, // 113年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史輪灌年' // 顯示標記的名稱
                            }
                        }
                    }
                  }
                ]
            },
            option5:{
                title: {
                    text: '灌溉率比較圖'
                },
                tooltip: {
                    valueFormatter: (value) => value + ' (公頃/cms)'
                },
                legend: {
                    show:false
                },
                xAxis: {
                    data:['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
                    name:'民國年',
                    nameLocation:'center',
                    nameTextStyle:{
                    padding:[20,0,0,0],
                    fontSize:16,
                    align:'center'
                  }
                },
                yAxis: {
                    name:'灌\n溉\n率\n(公頃/cms)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,40,0,0],
                        fontSize:12,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name: '灌溉率',
                    type: 'bar',
                    data: [
                        { value: 5, itemStyle: { color: 'red' } },   // 100年
                        { value: 20 },                                // 101年
                        { value: 36 },                                // 102年
                        { value: 30 },                                // 103年
                        { value: 28 },                                // 104年
                        { value: 20 },                                // 105年
                        { value: 25 },                                // 106年
                        { value: 20 },                                // 107年
                        { value: 36 },                                // 108年
                        { value: 15 },                                // 109年
                        { value: 12 },                                // 110年
                        { value: 20 },                                // 111年
                        { value: 15 },                                // 112年
                        { value: 9, itemStyle: { color: 'red' } }    // 113年
                    ],
                    markPoint: {
                        symbolSize:30,
                        itemStyle:{
                            color:'red'
                        },
                        data: [
                            { xAxis: '100', yAxis: 5 }, // 101年
                            { xAxis:'113', yAxis: 9 }, // 113年
                        ],
                        label: {
                            show: true, 
                            formatter: function(params) {
                                return '歷史輪灌年' // 顯示標記的名稱
                            }
                        }
                    }
                  }
                ]
            },
            events2:[ 
                { plan: '輪灌區', date: '日期', icon: 'pi pi-info-circle', color: '#607D8B'},
                { plan: '上區', date: '8/26', icon: 'pi pi-check', color: '#00F700'},
                { plan: '上區', date: '8/27', icon: 'pi pi-check', color: '#00F700' },
                { plan: '上區', date: '8/28', icon: 'pi pi-check', color: '#607D8B' },
                { plan: '上區', date: '8/29', icon: 'pi pi-check', color: '#607D8B' },
                { plan: '下區', date: '8/30', icon: 'pi pi-check', color: '#607D8B' },
                { plan: '下區', date: '8/31', icon: 'pi pi-check', color: '#607D8B' },
                { plan: '下區', date: '9/1', icon: 'pi pi-check', color: '#607D8B' }
            ],
            periods:[
                {value:'1',label:'一期作'},
                {value:'2',label:'二期作'},
            ],
            selectedPeriod:'1',
            myModal:null
        }
    },
    mounted() {
        this.myModal= new bootstrap.Modal(document.getElementById('exampleModal'))
    },
    methods: {
        switchComponent: function(d){
            alert(d);
            this.currentComponent = d;
        },
        initEcharts: function(){
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(this.option);
        },
        openModel: function(){
            this.myModal.show();
        }
    }, 
    template: `
    <div class="container">
         <div class="row" style="justify-content: center;">
            <div class="col-md-3">
                <Map @show-cctv="openModel"></Map>
                
            </div>
            <div class="col-md-9">
            <div class="row">

                <!--TODO:選擇期作-->
                <div class="col-md-12 mb-3" >
                    <span>期作別 : </span> <Select v-model="selectedPeriod" :options="periods" optionLabel="label" optionValue="value" placeholder="請選擇期作"/>
                </div>

                <!--TODO:供灌期程-->
                <div class="col-md-12 mb-3">
                    <h4 class="title_txt">供灌期程</h4>
                    <table class="table table-bordered " v-if="false">
                        <thead>
                            <tr>
                                <th scope="col">系統</th>
                                <th scope="col"></th>
                                <th scope="col">8/20</th>
                                <th scope="col">8/21</th>
                                <th scope="col">8/22</th>
                                <th scope="col">8/23</th>
                                <th scope="col">8/24</th>
                                <th scope="col">8/25</th>
                                <th scope="col">8/26</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" rowspan="2">上區(3/4)</th>
                                <td>預計</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td>X</td>
                                <td>X</td>
                                <td>X</td>
                            </tr>
                            <tr>
                                <td>實際</td>
                                 <td>O</td>
                                <td>O</td>
                                <td>O</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>
                                <th scope="row" rowspan="2">下區(0/3)</th>
                                <td>預計</td>
                                <td>X</td>
                                <td>X</td>
                                <td>X</td>
                                <td>X</td>
                                <td>O</td>
                                <td>O</td>
                                <td>O</td>
                            </tr>
                            <tr>
                                <td>實際</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="col-md-12 mb-3">
                        <div>
                            <i class="pi pi-check" style="background-color:00F700;border-radius: 50%;padding:4px;color:#fff;margin-bottom:3px"></i>  已供灌
                        </div>
                        <div>
                            <i class="pi pi-check" style="background-color:607D8B;border-radius: 50%;padding:4px;color:#fff"></i>  未供灌
                        </div>

                        <div class="timeline_wrap" >
                            <Timeline :value="events2" layout="horizontal" align="top">
                            <template #marker="slotProps">
                                <div  class="timeline_icon" :style="{ backgroundColor: slotProps.item.color,color: '#ffffff' }">
                                    <i :class="slotProps.item.icon"></i>
                                </div>
                            </template>
    
                            <template #opposite="slotProps">
                                {{slotProps.item.date}} 
                            </template>
    
                            <template #content="slotProps">
                                <span class="nowrap">
                                 {{ slotProps.item.plan }}
                                </span>
                            </template>
                            </Timeline>
                        </div>
                    </div>
                
                    <div class="col-md-12">
                        <div class="row">
                            <h4 class="title_txt">歷年同期資訊</h4>
                            <div class="col-md-6">
                                <MyChart :chartId="'chart1'" :option="option1"></MyChart>
                            </div>
                            <div class="col-md-6">
                                <MyChart :chartId="'chart2'" :option="option2"></MyChart>
                            </div>
                            <div class="col-md-6">
                                <MyChart :chartId="'chart3'" :option="option3"></MyChart>
                            </div>
                            <div class="col-md-6">
                            
                                <MyChart :chartId="'chart4'" :option="option4"></MyChart>
                            </div>
                            <div class="col-md-6">
                                <MyChart :chartId="'chart5'" :option="option5"></MyChart>
                            
                            </div>
                        </div>
                    </div>
            </div>
            </div>
            
         </div>

         

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">關山圳幹線_1支線取水後水位</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
       <div class="modal-body">
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; max-width: 700px; margin: 20px auto;">
        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                src="https://www.youtube.com/embed/13C8jdbqQcI?si=ZM83EMPlSw5pAZlo&autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
        </iframe>
    </div>
</div>
        </div>
    </div>
    </div>
    </div>
    
    `
};

