import Map from './map.js'
import MyChart from '../components/echarts.js'
import { firebaseDataAccess } from '../firebaseDataAccess.js'
import Enumerable from '../../plugins/linq.js'

export default {
    components: {
        Map,
        MyChart,
    },
    inject: ['currentComponent'],
    data() {
        return {
            xAxisData:['10/3','10/4','10/5','10/6','10/7','10/8','10/9'], 
            option1 :{
                title: {
                  text: '向陽站降雨組體圖'
                },
                tooltip: {
                    valueFormatter: (value) => value + ' mm'
                },
                legend: {
                    show:false
                },
                xAxis: {
                    data: ['10/3','10/4','10/5','10/6','10/7','10/8','10/9'],
                    name:'日期',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:16,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'日\n雨\n量\n(mm)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                      padding:[0,50,0,0],
                      fontSize:16,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name:'同期網格雨量',
                    type: 'bar',
                    data: [
                        { value: 5},   // 100年
                        { value: 20 },                                // 101年
                        { value: 36 },                                // 102年
                        { value: 30 },                                // 103年
                        { value: 28 },                                // 104年
                        { value: 20 },                                // 105年
                        { value: 25 },                                // 106年
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
                 text: '關山、池上圳流量歷線圖'
                },
                tooltip: {
                  trigger: 'axis',
                  valueFormatter: (value) => value + ' cms'
                },
                legend: {
                    padding: [
                        30,  // 上
                        0, // 右
                        0,  // 下
                        0, // 左
                    ]
                },
                xAxis: {
                    data: ['10/3','10/4','10/5','10/6','10/7','10/8','10/9'],
                    name:'日期',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:16,
                      align:'center'
                    }
                  },
                yAxis: {
                    name:'流\n量\n(cms)',
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,50,0,0],
                        fontSize:16,
                      align:'center'
                    },
                    type: "value"
                },
                series: [
                  {
                    name: '關山圳',
                    type: 'line',
                    data: [
                        { value: 10,}, // 100年
                        { value: 11 }, // 101年
                        { value: 13 }, // 102年
                        { value: 11 }, // 103年
                        { value: 12 }, // 104年
                        { value: 12 }, // 105年
                        { value: 9 },  // 106年
                    ],
                    // markPoint: {
                    //     symbolSize:30,
                    //     itemStyle:{
                    //         color:'red'
                    //     },
                    //     data: [
                    //         {  xAxis: '100', yAxis: 10 }, // 101年
                    //         {  xAxis:'113', yAxis: 9 } // 103年
                    //     ],
                    //     label: {
                    //         show: true, 
                    //         formatter: function(params) {
                    //             return '歷史停灌年' // 顯示標記的名稱
                    //         }
                    //     },
                    //     // symbol: "circle"
                    // },
                  },
                  {
                    name: '池上圳',
                    type: 'line',
                    data: [
                        { value: 1}, // 100年
                        { value: 2 }, // 101年
                        { value: 2 }, // 102年
                        { value: 5 }, // 103年
                        { value: 3 }, // 104年
                        { value: 2 }, // 105年
                        { value: 0 },  // 106年
                    ],
                    // markPoint: {
                    //     symbolSize:30,
                    //     itemStyle:{
                    //         color:'red'
                    //     },
                    //     data: [
                    //         {  xAxis: '100', yAxis: 1 }, // 101年
                    //         {  xAxis:'113', yAxis: 0 } // 103年
                    //     ],
                    //     label: {
                    //         show: true, 
                    //         formatter: function(params) {
                    //             return '歷史停灌年' // 顯示標記的名稱
                    //         }
                    //     }
                    // },
                    
                  },
                  {
                    name: '整田期所需流量',
                    type: 'line',
                    data: [10, 10, 10, 10, 10, 10, 10],
                    lineStyle: {
                        width: 4,
                        type: 'dashed'  // 使用虛線
                    }
                    
                },
                {
                    name: '本田期所需流量',
                    type: 'line',
                    data: [7, 7, 7, 7, 7, 7, 7],
                    lineStyle: {
                        width: 4,
                        type: 'dashed'  // 使用虛線
                    }
                }
                ],
            },
            option3:{
                title: {
                //   text: '同期SPI'
                 text: 'SPI'
                },
                tooltip: {},
                legend: {
                    show:false
                //   data: ['销量']
                },
                xAxis: {
                    data: [
                        "5.上",
                        "5.中",
                        "5.下",
                        "6.上",
                        "6.中",
                        "6.下",
                        "7.上",
                        "7.中",
                        "7.下",
                        "8.上",
                        "8.中",
                        "8.下",
                        "9.上",
                        "9.中",
                        "9.下",
                        "10.上",
                        "10.中",
                        "10.下",
                        "11.上",
                        "11.中",
                        "11.下",
                        "12.上",
                        "12.中",
                        "12.下",
                        "1.上",
                        "1.中",
                        "1.下",
                        "2.上",
                        "2.中",
                        "2.下",
                        "3.上",
                        "3.中",
                        "3.下",
                        "4.上",
                        "4.中",
                        "4.下",
                      ],
                    name:'旬',
                    nameLocation:'center',
                    nameTextStyle:{
                      padding:[20,0,0,0],
                      fontSize:16,
                      align:'center'
                    }
                  },
                yAxis: {
                    type: "value",
                    name:'SPI',
                    max: 0.5,
                    min: -3,
                    interval: 0.5,
                    nameLocation:'center',
                    nameRotate:0,
                    position:'left',
                    nameTextStyle:{
                        padding:[0,60,0,0],
                        fontSize:16,
                      align:'center'
                    },
                    
                },
                series: [
                  {
                    name: 'SPI',
                    type: 'line',
                    symbol: "none",
                    data: [
                        { value: 0 },   
                        { value: -2 },                                
                        { value: -3 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: -1.5 },                                
                        { value: -0.8 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: -2 },                                
                        { value: -1.8 },                                
                        { value: -1.3 },                                
                        { value: -0.2 },    
                        { value: 0 },   
                        { value: -2 },                                
                        { value: -3 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: -1.5 },                                
                        { value: -0.8 },                                
                        { value: 0 },                                
                        { value: 0 },                                
                        { value: -2 },                                
                        { value: -1.8 },                                
                        { value: -1.3 },                                
                        { value: -0.2 }    
                    ],
                    lineStyle: {
                        width: 4,
                        type: 'dashed'
                      },
                  },
                  {
                    data: [],
                    z: 9999,
                    type: "line",
                    markArea: {
                      silent: true,
                      itemStyle: {
                        color: "rgba(195, 223, 176, 0)",
                      },
                      label: {
                        position: "right",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2E2B21",
                      },
                      data: [
                        [
                          {
                            name: "正\n常",
                            yAxis: "-0.5",
                          },
                          {
                            yAxis: "0",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    z: 9999,
                    type: "line",
                    markArea: {
                      silent: true,
                      itemStyle: {
                        color: "rgba(197, 51, 27, 1)",
                      },
                      label: {
                        position: "right",
                        fontWeight: 600,
                        fontSize: 12,
                        color: "#2E2B21",
                      },
                      data: [
                        [
                          {
                            name: "極\n度",
                            yAxis: "-3",
                          },
                          {
                            yAxis: "-2",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    data: [],
                    z: 9999,
                    type: "line",
                    markArea: {
                      silent: true,
                      itemStyle: {
                        color: "rgba(244, 169, 89, 1)",
                      },
                      label: {
                        position: "right",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2E2B21",
                      },
                      data: [
                        [
                          {
                            name: "重\n度",
                            yAxis: "-2",
                          },
                          {
                            yAxis: "-1.5",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    data: [],
                    z: 9999,
                    type: "line",
            
                    markArea: {
                      silent: true,
                      itemStyle: {
                        color: "rgba(255, 228, 148, 1)",
                      },
                      label: {
                        position: "right",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2E2B21",
                      },
                      data: [
                        [
                          {
                            name: "中\n度",
                            yAxis: "-1.5",
                          },
                          {
                            yAxis: "-1",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    data: [],
                    z: 9999,
                    type: "line",
            
                    markArea: {
                      silent: true,
                      itemStyle: {
                        color: "rgba(195, 223, 176, 1)",
                      },
                      label: {
                        position: "right",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2E2B21",
                      },
                      data: [
                        [
                          {
                            name: "輕\n度",
                            yAxis: "-1",
                          },
                          {
                            yAxis: "-0.5",
                          },
                        ],
                      ],
                    },
                  },
                ]
            },
            // option4:{
            //     title: {
            //      text: '同期水稻種植面積比較圖'
            //     },
            //     tooltip: {},
            //     legend: {
            //       show:false
            //     },
            //     xAxis: {
            //         data:['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
            //         name:'民國年',
            //         nameLocation:'center',
            //         nameTextStyle:{
            //           padding:[20,0,0,0],
            //           fontSize:12,
            //           align:'center'
            //         }
            //       },
            //     yAxis: {
            //         name:'種\n植\n面\n積\n(公頃)',
            //         nameLocation:'center',
            //         nameRotate:0,
            //         position:'left',
            //         nameTextStyle:{
            //             padding:[0,50,0,0],
            //             fontSize:12,
            //           align:'center'
            //         },
            //         type: "value"
            //     },
            //     series: [
            //       {
            //         name: '水稻種植面積',
            //         type: 'bar',
            //         data: [
            //             { value: 5, itemStyle: { color: 'red' } },   // 100年
            //             { value: 20 },                                // 101年
            //             { value: 36 },                                // 102年
            //             { value: 30 },                                // 103年
            //             { value: 28 },                                // 104年
            //             { value: 20 },                                // 105年
            //             { value: 25 },                                // 106年
            //             { value: 20 },                                // 107年
            //             { value: 36 },                                // 108年
            //             { value: 15 },                                // 109年
            //             { value: 12 },                                // 110年
            //             { value: 20 },                                // 111年
            //             { value: 15 },                                // 112年
            //             { value: 9, itemStyle: { color: 'red' } }    // 113年
            //         ],
            //         markPoint: {
            //             symbolSize:30,
            //             itemStyle:{
            //                 color:'red'
            //             },
            //             data: [
            //                 { xAxis: '100', yAxis: 5 }, // 101年
            //                 { xAxis:'113', yAxis: 9 }, // 113年
            //             ],
            //             label: {
            //                 show: true, 
            //                 formatter: function(params) {
            //                     return '歷史輪灌年' // 顯示標記的名稱
            //                 }
            //             }
            //         }
            //       }
            //     ]
            // },
            // option5:{
            //     title: {
            //         text: '同期灌溉率比較圖'
            //     },
            //     tooltip: {
            //         valueFormatter: (value) => value + ' (公頃/cms)'
            //     },
            //     legend: {
            //         show:false
            //     },
            //     xAxis: {
            //         data:['100','101','102','103','104','105','106','107','108','109','110','111','112','113'],
            //         name:'民國年',
            //         nameLocation:'center',
            //         nameTextStyle:{
            //         padding:[20,0,0,0],
            //         fontSize:16,
            //         align:'center'
            //       }
            //     },
            //     yAxis: {
            //         name:'灌\n溉\n率\n(公頃/cms)',
            //         nameLocation:'center',
            //         nameRotate:0,
            //         position:'left',
            //         nameTextStyle:{
            //             padding:[0,50,0,0],
            //             fontSize:12,
            //           align:'center'
            //         },
            //         type: "value"
            //     },
            //     series: [
            //       {
            //         name: '灌溉率',
            //         type: 'bar',
            //         data: [
            //             { value: 5, itemStyle: { color: 'red' } },   // 100年
            //             { value: 20 },                                // 101年
            //             { value: 36 },                                // 102年
            //             { value: 30 },                                // 103年
            //             { value: 28 },                                // 104年
            //             { value: 20 },                                // 105年
            //             { value: 25 },                                // 106年
            //             { value: 20 },                                // 107年
            //             { value: 36 },                                // 108年
            //             { value: 15 },                                // 109年
            //             { value: 12 },                                // 110年
            //             { value: 20 },                                // 111年
            //             { value: 15 },                                // 112年
            //             { value: 9, itemStyle: { color: 'red' } }    // 113年
            //         ],
            //         markPoint: {
            //             symbolSize:30,
            //             itemStyle:{
            //                 color:'red'
            //             },
            //             data: [
            //                 { xAxis: '100', yAxis: 5 }, // 101年
            //                 { xAxis:'113', yAxis: 9 }, // 113年
            //             ],
            //             label: {
            //                 show: true, 
            //                 formatter: function(params) {
            //                     return '歷史輪灌年' // 顯示標記的名稱
            //                 }
            //             }
            //         }
            //       }
            //     ]
            // },
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
            myModal:null,
            gateName:'無無無',
            isShowTimeline:false,
        }
    },
    mounted() {
        this.myModal= new bootstrap.Modal(document.getElementById('exampleModal'))
    },
    methods: { 
        handleShowCCTV(cctvTitle){
            console.log("cct",cctvTitle)
            this.gateName = cctvTitle
            this.myModal.show();
        },
        loadData: function () {
            //載入config資料
            this.dataAccess = firebaseDataAccess();
            this.dataAccess.getData(
                {
                    path: '/WaterStorageIrrigGuanShanCanal',
                    key: 'hasWater',
                    value: true
                },
                (returnList) => {
                    // this.lineReportList = returnList;
                    this.lineReportList=[]
                    let currentDate=dayjs().format('YYYY-MM-DD')
                    returnList.forEach((item) => {
                        if(item.countDate === currentDate){
                            this.lineReportList.push(item)
                        }
                    })
                }
            );
            // this.dataAccess.getData(
            //     {
            //         //path: '/bigboss-water-irrigation-providing'
            //         path: '/bigboss-pond-dep1-with-gis-objectid'
            //     },
            //     (returnList) => {
            //         this.pondProfile.pondInfoList = returnList;

            //         //add dummy data
            //         this.pondProfile.pondInfoList.forEach(obj => {
            //             let dummyCurrent = 0;
            //             let dummyCurrentPercentage = 0;

            //             let recognizedAreaPeriod1 = 0;
            //             let recognizedAreaPeriod2 = 0;
            //             let availabelQty = 0;
            //             try {
            //                 dummyCurrent = getRandomNumber(0, Number(obj["有效庫容(m3)"]));
            //                 dummyCurrentPercentage =
            //                     (Number(obj["有效庫容(m3)"]) == 0) ? 0 : Math.round10((dummyCurrent / Number(obj["有效庫容(m3)"])) * 100, -2);

            //                 // let planArea = Number(obj["灌溉面積(公頃)"]);
            //                 // recognizedAreaPeriod1 = getRandomNumber(0, Number(obj["灌溉面積(公頃)"]));
            //                 // recognizedAreaPeriod2 = getRandomNumber(0, Number(obj["灌溉面積(公頃)"]));
            //                 availabelQty = getRandomNumber(dummyCurrent * 0.5, dummyCurrent * 0.8);
            //             } catch (ex) {
            //                 console.log('random error: ', ex);
            //             }
            //             obj["Dummy目前容量"] = dummyCurrent;
            //             obj["Dummy目前容量比率"] = dummyCurrentPercentage;
            //             obj["可供灌水量"] = availabelQty;

            //             // obj["判釋面積-1期作(公頃)"] = recognizedAreaPeriod1;
            //             // obj["判釋面積-2期作(公頃)"] = recognizedAreaPeriod2;
            //         });
            //     }
            // );
            // this.dataAccess.getData(
            //     {
            //         path: '/bigboss-workstation-group'
            //     },
            //     (returnList) => {

            //         this.pondProfile.workstationGroupList = returnList;
            //         console.log('this.pondProfile.workstationGroupList', this.pondProfile.workstationGroupList.length, this.pondProfile.workstationGroupList)
            //     }
            // );
            // this.dataAccess.getData(
            //     {
            //         path: '/bigboss-pond-hukou-pond-hv-curve'
            //     },
            //     (returnList) => {
            //         this.pondProfile.pondHvCurveList = returnList;
            //         console.log(this.pondProfile.pondHvCurveList);
            //     }
            // );
        },
    }, 
    template: `
<div class="container-fluid">
        <div class="row" style="justify-content: center;">
             <!--手機版顯示-->
            <div class="col-12 d-md-none">
                <div class="col-md-12 mb-3">
                    <button type="button" class="btn btn-outline-success " :class="{'active':isShowTimeline}" @click="isShowTimeline=!isShowTimeline" data-bs-toggle="tooltip" data-bs-placement="right" title="查看供灌期程">
                        <h4 class="title_txt ">供灌期程</h4>
                    </button>
                </div>
                <div v-show="isShowTimeline" class="col-md-12 row ">

                    <div class="col-md-12 mb-3 d-flex align-items-center gap-3" >
                            <div>
                                <i class="pi pi-check"
                                    style="background-color:00F700;border-radius: 50%;padding:4px;color:#fff;margin-bottom:3px"></i>
                                已供灌
                            </div>
                            <div>
                                <i class="pi pi-check"
                                    style="background-color:607D8B;border-radius: 50%;padding:4px;color:#fff"></i> 未供灌
                            </div>
                    </div>
                    
                    <div class="col-md-12 mb-3">
                        <div class="timeline_wrap">
                            <Timeline :value="events2" layout="horizontal" align="top">
                                <template #marker="slotProps">
                                    <div class="timeline_icon"
                                        :style="{ backgroundColor: slotProps.item.color,color: '#ffffff' }">
                                        <i :class="slotProps.item.icon"></i>
                                    </div>
                                </template>

                                <template #opposite="slotProps">
                                    {{slotProps.item.date}}
                                </template>

                                <template #content="slotProps">
                                    <span class="nowrap" style="font-size:14px">
                                        {{ slotProps.item.plan }}
                                    </span>
                                </template>
                            </Timeline>
                        </div>
                    </div>
                    <div class="col-md-12 mb-3">
                        <div class="timeline_wrap">
                            <Timeline :value="events2" layout="horizontal" align="top">
                                <template #marker="slotProps">
                                    <div class="timeline_icon"
                                        :style="{ backgroundColor: slotProps.item.color,color: '#ffffff' }">
                                        <i :class="slotProps.item.icon"></i>
                                    </div>
                                </template>

                                <template #opposite="slotProps">
                                    {{slotProps.item.date}}
                                </template>

                                <template #content="slotProps">
                                    <span class="nowrap" style="font-size:14px">
                                        {{ slotProps.item.plan }}
                                    </span>
                                </template>
                            </Timeline>
                        </div>
                    </div>
                </div>

            </div>

            <!--以上手機版-->

            <div class="col-12 col-md-3 order-1 order-md-1">
                <Map @show-cctv="handleShowCCTV"></Map>
                <div class="info-box row">
                    <div class="col-12 col-xl-6 order-1 order-xl-1 d-flex align-items-center gap-1">
                        <img  class="info-icon" src="https://img.icons8.com/?size=100&id=86814&format=png&color=339AF0" alt="CCTV-icon" /><span>:CCTV</span>
                    </div>
                    <div class="col-12 col-xl-6 order-4 order-xl-3 d-flex align-items-center gap-1">
                        <img  class="info-icon" src="https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FA5252" alt="red-light-icon" /><span>:缺水</span>
                    </div>
                    <div class="col-12 col-xl-6 order-3 order-xl-4 d-flex align-items-center gap-1">
                        <img  class="info-icon" src="/projects/WaterStorageIrrigGuanShanCanal/assets/thermometer.png" /><span>:流量/水位站</span>
                    </div>
                    <div class="col-12 col-xl-6 order-5 order-xl-5 d-flex align-items-center gap-1">
                        <div class="info-icon" style="background-color:rgb(0,128,0);border-radius: 5px;"/><span>:上區</span>
                    </div>
                    <div class="col-12 col-xl-6 order-5 order-xl-5 d-flex align-items-center gap-1">
                        <div class="info-icon" style="background-color:rgb(0,0,255);border-radius: 5px;"/><span>:下區</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-9 order-2 order-md-2">
                <div class="row">
                    <!--TODO:選擇期作-->
                    <div class="col-md-12 mb-3 d-none d-md-block" v-if="false">
                        <span>期作別 : </span> <Select v-model="selectedPeriod" :options="periods" optionLabel="label"
                            optionValue="value" placeholder="請選擇期作" />
                    </div>



                        <div class="col-md-12">
                            <div class="row">
                                <h4 class="title_txt">水情資訊</h4>
                                <div class="col-12 col-md-6">
                                    <MyChart :chartId="'chart1'" :option="option1"></MyChart>
                                </div>
                                <div class="col-12 col-md-6">
                                    <MyChart :chartId="'chart2'" :option="option2"></MyChart>
                                </div>
                                <div class="col-12 col-md-6">
                                    <MyChart :chartId="'chart3'" :option="option3"></MyChart>
                                    <div class="remark">
                                        備註:
                                        <ul>
                                            <li>僅繪製SPI<-0.5之數值</li>
                                            <li>若乾旱持續2個月(6旬)以上或進入中度乾旱，則可考量啟動輪灌</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                                            <!--TODO:供灌期程-->
                    <div class="col-md-12 mb-3 d-none d-md-block" >
                        
                        <button type="button" class="btn btn-outline-success" :class="{'active':isShowTimeline}" @click="isShowTimeline=!isShowTimeline" data-bs-toggle="tooltip" data-bs-placement="right" title="查看供灌期程">
                            <h4 class="title_txt ">供灌期程</h4>
                        </button>

                        <div class="col-md-12 mb-3 ">
                       
                            <div v-show="isShowTimeline">
                                <div class="timeline_wrap">
                                    <Timeline :value="events2" layout="horizontal" align="top">
                                        <template #marker="slotProps">
                                            <div class="timeline_icon"
                                                :style="{ backgroundColor: slotProps.item.color,color: '#ffffff' }">
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
                                <div class="timeline_wrap">
                                    <Timeline :value="events2" layout="horizontal" align="top">
                                        <template #marker="slotProps">
                                            <div class="timeline_icon"
                                                :style="{ backgroundColor: slotProps.item.color,color: '#ffffff' }">
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

                                <div class="icon_wrap d-flex gap-5">
                                    <div class="d-inline-block">
                                        <i class="pi pi-check"
                                            style="background-color:00F700;border-radius: 50%;padding:4px;color:#fff;margin-bottom:3px"></i>
                                        已供灌
                                    </div>
                                    <div class="d-inline-block">
                                        <i class="pi pi-check"
                                            style="background-color:607D8B;border-radius: 50%;padding:4px;color:#fff"></i> 未供灌
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

            </div>



            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">監測站 : {{gateName}}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div
                                style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; max-width: 700px; margin: 20px auto;">
                                <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                                    src="https://www.youtube.com/embed/13C8jdbqQcI?si=ZM83EMPlSw5pAZlo&autoplay=1"
                                    title="YouTube video player" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

