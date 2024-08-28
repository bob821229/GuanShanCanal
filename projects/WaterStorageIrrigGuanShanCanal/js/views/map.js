import { firebaseDataAccess } from '../firebaseDataAccess.js'
const { toRaw } = Vue;
import Enumerable from '../../plugins/linq.js'
export default {
    components: {

    },
    //inject: ['currentComponent'],
    emit:['show-cctv'],
    data() {
        return {
            esri: {
                esriConfig: null,
                Map: null,
                WebMap: null,
                MapImageLayer: null,
                MapView: null,
                SimpleFillSymbol: null,
                TextSymbol: null,
                SimpleLineSymbol: null,
            },
            mapProfile: {
                map: null,
                mapView: null,
                layer: null,
                subLayers: {
                    associationLayer: null,
                    workstationLayer: null,
                    groupLayer: null,
                    pondLayer: null,
                    riverLayer: null,
                },
                search: {
                    association: '桃園管理處',
                    irrigationGroup: '',
                    workstation: '',
                    group: '',
                },
                highlightLayer: {
                    //BB_4水利小組範圍_桃管_石管
                    '10': {
                        cache: [],
                        style: {
                            //fillColor: 'rgba(128, 128, 128, 0.7)', 
                            color: 'blue',
                            //opacity: 0, 

                        },
                        layerCaption: `水利小組範圍`,
                        legend: `#DBFCBD`,
                    },
                    //BB_5圳路渠道_桃管_石管_幹支線
                    '11': {
                        cache: [],
                        style: {
                            fillColor: 'blue',
                            color: 'black'
                        },
                        layerCaption: `圳路渠道(幹支線)`,
                        legend: `#FC0012`,
                    },
                    //BB_3工作站範圍_桃管_石管
                    '13': {
                        cache: [],
                        style: {
                            // fillColor: 'rgba(255, 254, 78, 0.7)', 
                            color: 'red'
                        },
                        layerCaption: `工作站範圍`,
                        legend: `#DBFCBD`,
                    },
                    //BB_6埤塘_1120512_桃管_石管
                    '14': {
                        cache: [],
                        style: {
                            //fillColor: '#666666',//'rgba(128, 128, 128, 0.7)', 
                            color: 'black',
                            // opacity: 0, 
                            // fill: true, 
                        },
                        layerCaption: `埤塘`,
                        legend: `#BED2FF`,
                    },
                    //BB_1管理處範圍_桃管_石管
                    '15': {
                        cache: [],
                        style: {
                            // fillColor: 'lime', 
                            color: 'black'
                        },
                        layerCaption: `管理處範圍`,
                        legend: `#FC0012`,
                    },
                }
            },
            dataAccess: null,
            
        }
    },
    watch: {
        // associationList: function (n, o) {
        //     if (n != null) {
        //         this.mapProfile.search.association = n[0];
        //     }
        // },
    },
    computed: {
        mapBaseQuery() {
            return `管理處名稱 = '${this.mapProfile.search.association}'`;
        },
        // workstationGroupListData() {
        //     let filteredList = Enumerable.from(this.pondProfile.workstationGroupList).where(w => w['管理處'] == this.mapProfile.search.association).toArray();
        //     filteredList.forEach(w => {
        //         w.pondCount = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).count()
        //         w.totalQty = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).sum(item => item['有效庫容(m3)'])
        //         w.totalCurrentQty = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).sum(item => item['Dummy目前容量'])
        //         w.totalCurrentPercentage =
        //             (w.totalQty == 0) ? 0 : Math.round10(w.totalCurrentQty / w.totalQty * 100, -2);
        //     });
        //     return filteredList;
        // },
        // pickedWorkstationGroupListData() {
        //     if (this.mapProfile.search.workstation == null || this.mapProfile.search.workstation == '') {
        //         return this.workstationGroupListData;
        //     } else {
        //         let r = Enumerable.from(this.workstationGroupListData).where(f => f['工作站'] == this.mapProfile.search.workstation).toArray();
        //         return r;
        //     }

        // },
        // associationList() {
        //     if (this.pondProfile.hierarchyList == null) {
        //         return [];
        //     }
        //     let r = Enumerable.from(this.pondProfile.hierarchyList).groupBy(_i => _i["管理處名稱"]).select(g => g.key()).toArray();
        //     return r;
        // },
        // workstationList() {
        //     let r = Enumerable.from(this.pondProfile.hierarchyList)
        //         .where(f => f["管理處名稱"] == this.mapProfile.search.association)
        //         .groupBy(_i => _i["工作站名稱"])
        //         .select(g => g.key())
        //         .toArray();


        //     return r;
        // },
        // groupList() {
        //     let r = Enumerable.from(this.pondProfile.hierarchyList)
        //         .where(f =>
        //             f["管理處名稱"] == this.mapProfile.search.association &&
        //             f["工作站名稱"] == this.mapProfile.search.workstation
        //         )
        //         .groupBy(_i => _i["水利小組名稱"])
        //         .select(g => g.key()).toArray();
        //     return r;
        // },
    },
    methods: {
        init: function () {
            require([
                "esri/config",
                "esri/Map",
                "esri/WebMap",
                "esri/layers/TileLayer",
                "esri/layers/MapImageLayer",
                "esri/views/MapView",

                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/TextSymbol",
                "esri/symbols/SimpleLineSymbol",

                "esri/rest/support/Query",
                "esri/layers/WebTileLayer",
                "esri/widgets/Legend"

            ], (esriConfig, Map, WebMap, TileLayer, MapImageLayer, MapView
                , SimpleFillSymbol
                , TextSymbol
                , SimpleLineSymbol
                , Query
                ,WebTileLayer
                ,Legend
            ) => {
                this.esri.esriConfig = esriConfig;
                this.esri.Map = Map;
                this.esri.WebMap = WebMap;
                this.esri.MapImageLayer = MapImageLayer;
                this.esri.MapView = MapView;
                this.esri.SimpleFillSymbol = SimpleFillSymbol;
                this.esri.TextSymbol = TextSymbol;
                this.esri.SimpleLineSymbol = SimpleLineSymbol;
                this.esri.Query = Query;
                this.esri.WebTileLayer = WebTileLayer;
                this.esri.Legend = Legend;


                this.$nextTick(() => {
                    this.initMap();
                });
            });

            this.loadData();

            
        },
        loadData: function () {
            //載入config資料
            // this.dataAccess = firebaseDataAccess();
            // this.dataAccess.getData(
            //     {
            //         path: '/bigboss-pond-hierarchy',
            //         key: '管理處名稱',
            //         value: this.mapProfile.search.association//'桃園管理處',
            //     },
            //     (returnList) => {
            //         this.pondProfile.hierarchyList = returnList;
            //     }
            // );
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
        initMap: function () {
            // this.mapProfile.map = L.map("map").setView(
            //     [23.80745279701942, 120.29574021937988],
            //     //[23.973993,120.9772426],
            //     16
            // );
            // this.addLayer();
            let self = this;
            
            let mapImagelayer = new this.esri.MapImageLayer({
                //gis Map Image Layer
                url:
                    "https://gisportal.triwra.org.tw/server/rest/services/GuanShanCanal/MapServer",

                    sublayers: [ 
                        
                        {   
                            // 關山圳水利小組
                            id: 6,
                            visible: true,
                            renderer: {
                                type: "unique-value",
                                legendOptions: {
                                    title: "分區表"
                                },
                                field: "分區",
                                uniqueValueInfos: [
                                    {
                                        value: "上區",
                                        label: "State highway",
                                        symbol: {
                                            type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
                                            size: 300,
                                            color: "#FFB5B5"
                                          }
                                    },
                                    {
                                        value: "下區",
                                        label: "State highway",
                                        symbol: {
                                            type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
                                            size: 300,
                                            color: "#D2E9FF"
                                          }
                                    },
                                ],
                                
                            },
                            labelingInfo: [
                                {
                                  labelExpression: "[水利小組名稱]",
                                  labelPlacement: "always-horizontal",
                                  symbol: {
                                    type: "text", // autocasts as new TextSymbol()
                                    color: [255, 255, 255, 0.7],
                                    haloColor: [0, 0, 0, 0.7],
                                    haloSize: 1,
                                    font: {
                                      size: 11
                                    }
                                  },
                                }
                              ]
                        },
                        {   
                            // 關山圳渠道
                            id: 3,
                            visible: true,
                            renderer: {
                                type: "simple", // autocasts as new SimpleRenderer()
                                symbol: {
                                  type: "simple-line", // autocasts as new SimpleMarkerSymbol()
                                  color: "black"
                                }
                            }
                        },
                        {
                            // 農工中心綱要計畫113年大尺度計畫建置
                            id: 1,
                            visible: true,
                            renderer: {
                                type: "simple", // autocasts as new SimpleRenderer()
                                symbol: {
                                    type: "simple-marker", // 正確的符號類型應該是 "simple-marker" 而不是 "simple-line"
                                    style: "circle", // 指定標記的樣式為圓圈
                                    size: 6, // 標記的大小
                                    color: "red", // 標記的顏色
                                    outline: { // 為標記添加輪廓
                                        color: [255, 255, 255], // 白色輪廓
                                        width: 1 // 輪廓寬度
                                    }
                                }
                            }
                        },
                    ]
                 
            });
            console.log("mapImagelayer:",mapImagelayer.sublayers)
            
            // let tiledLayer = new this.esri.WebTileLayer({
            //     urlTemplate: "https://wmts.nlsc.gov.tw/wmts/PHOTO_MIX/default/GoogleMapsCompatible/{z}/{y}/{x}",
            // });
            
            const tiledLayer1 = new this.esri.WebTileLayer({
                urlTemplate: "https://wmts.nlsc.gov.tw/wmts/PHOTO_MIX/default/GoogleMapsCompatible/{z}/{y}/{x}",
                opacity: 0.5
                // subDomains: ["a", "b", "c"],
                // copyright: 'Map data from &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Map design by &copy; <a href="http://opentopomap.org/" target="_blank">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>) contributors'
            });

            let map = new this.esri.Map({
                //basemap: "topo-vector", // You can choose other basemaps as well
                
                layers: [
                    //tileLayer,  //最下層
                    tiledLayer1,
                    mapImagelayer,  //次下層
                ]
            });
            

            let view = new this.esri.MapView({
                map: map,
                // map: webmap,
                center: [121.17810, 23.03036], // Longitude, latitude
                zoom: 12, // Zoom level
                container: "map",  // Div element
                spatialReference: {
                    wkid: 3857,
                },
                // center: [121.171561, 23.117738], // Initial center
                // //basemap: "oceans",
                // layers: [
                //   housingLayer, 
                //   layer, 
                // ] // layers can be added as an array to the map's constructor
            });

            const legend = new this.esri.Legend({
                view: view
              });
      
            //   view.ui.add(legend, "bottom-right");

            view.on('click', (event) => {

                console.log('view click', event);
                this.$emit('show-cctv', 'Hello from child');
            });
            
            

        },
        
    },
    mounted() {
        this.init();
    },
    template: `
        

        <div id="map">
        </div>

        

    
    `
};

