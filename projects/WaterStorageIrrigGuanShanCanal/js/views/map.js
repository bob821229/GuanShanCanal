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
                    groupLayer: null,//水利小組
                    riverLayer: null,//渠道
                    gateLayer: null,//水閘門
                    lackOfWaterGraphicsLayer: null,//缺水圖層
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
            lineReportList:[
                { id:1,longitude: 121.1615, latitude: 23.032453, name: "幹17給取水門",hasWater:true },
                { id:2,longitude: 121.148736, latitude: 23.008914, name: "13支線取水門",hasWater:true},
                { id:3,longitude: 121.135444, latitude: 22.981669, name: "15支線取水門",hasWater:true},
                { id:4,longitude: 121.137139, latitude: 22.975672, name: "16、17支線取水門",hasWater:true },
                { id:5,longitude: 121.151208, latitude: 22.950414, name: "17支線末端",hasWater:true }
            ],
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
        init:  function () {
            require([
                "esri/config",
                "esri/Map",
                "esri/WebMap",
                "esri/layers/TileLayer",
                "esri/layers/MapImageLayer",
                "esri/layers/GraphicsLayer",
                "esri/views/MapView",

                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/TextSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/PictureMarkerSymbol",

                "esri/rest/support/Query",
                "esri/layers/WebTileLayer",
                "esri/widgets/Legend",

                "esri/geometry/Point",
                "esri/Graphic",
                "esri/PopupTemplate"
            ], (esriConfig, Map, WebMap, TileLayer, MapImageLayer,GraphicsLayer,MapView
                , SimpleFillSymbol
                , TextSymbol
                , SimpleLineSymbol
                ,PictureMarkerSymbol
                , Query
                ,WebTileLayer
                ,Legend,
                Point,
                Graphic,
                PopupTemplate
            ) => {
                this.esri.esriConfig = esriConfig;
                this.esri.Map = Map;
                this.esri.WebMap = WebMap;
                this.esri.MapImageLayer = MapImageLayer;
                this.esri.GraphicsLayer = GraphicsLayer;
                this.esri.MapView = MapView;
                this.esri.SimpleFillSymbol = SimpleFillSymbol;
                this.esri.TextSymbol = TextSymbol;
                this.esri.SimpleLineSymbol = SimpleLineSymbol;
                this.esri.PictureMarkerSymbol = PictureMarkerSymbol;
                this.esri.Query = Query;
                this.esri.WebTileLayer = WebTileLayer;
                this.esri.Legend = Legend;
                this.esri.Point = Point;
                this.esri.Graphic = Graphic;
                this.esri.PopupTemplate = PopupTemplate;


                
                this.$nextTick(() => {
                    this.initMap();
                });
                this.loadData();
            });


            
        },
        loadData: async function () {
            //載入config資料
            this.dataAccess = firebaseDataAccess();
            await this.dataAccess.getData(
                {
                    path: '/WaterStorageIrrigGuanShanCanal',
                    // key: 'hasWater',
                    // value: true
                },
                (returnList) => {
                    // this.lineReportList = returnList;
                    // this.lineReportList=[]
                    let currentDate=dayjs().format('YYYY-MM-DD')
                    let result=Enumerable.from(returnList).where(p=>p.countDate==currentDate&& p.hasWater === false).distinct(p => p.ID).toArray()
                    result.forEach((item)=>{
                        let gateItem=this.lineReportList.find(g => g.id === item.ID)
                        if(gateItem){
                                gateItem.hasWater=item.hasWater
                        }else{
                            console.log(`No matching gate found for ID: ${item.ID}`);
                        }
                    })
                    this.lackOfWaterGraphicsLayerHandle();
                }
                
            );
        },
        initMap: function () {
            // this.mapProfile.map = L.map("map").setView(
            //     [23.80745279701942, 120.29574021937988],
            //     //[23.973993,120.9772426],
            //     16
            // );
            // this.addLayer();
            let vm = this;
            
            let mapImagelayer = new this.esri.MapImageLayer({
                //gis Map Image Layer
                url:"https://gisportal.triwra.org.tw/server/rest/services/GuanShanCanal/MapServer",
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
                                        label: "上區",
                                        symbol:new this.esri.SimpleFillSymbol({
                                            type: "simple-fill",
                                            color: "#FFB5B5"
                                          }
                                        )
                                    },
                                    {
                                        value: "下區",
                                        label: "下區",
                                        symbol:new this.esri.SimpleFillSymbol({
                                            type: "simple-fill", 
                                            color: "#D2E9FF"
                                          }
                                        )
                                    },
                                ],
                            },
                            // renderer: {
                            //     type: "unique-value",
                            //     legendOptions: {
                            //         title: "分區表"
                            //     },
                            //     field: "水利小組名稱",
                            //     uniqueValueInfos: [
                            //         {
                            //             value: "關山圳第9小組",
                            //             label: "上區",
                            //             symbol: {
                            //                 type: "picture-marker",
                            //                 url: "https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FCC419", 
                            //                 width: "30px",
                            //                 height: "30px"
                            //             },
                            //         },
                            //         {
                            //             value: "關山圳第10小組",
                            //             label: "下區",
                            //             symbol: {
                            //                 type: "picture-marker",
                            //                 url: "https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FCC419", 
                            //                 width: "30px",
                            //                 height: "30px"
                            //             },
                            //         },
                            //         {
                            //             value: "關山圳第13小組",
                            //             label: "下區",
                            //             symbol: {
                            //                 type: "picture-marker",
                            //                 url: "https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FA5252", 
                            //                 width: "30px",
                            //                 height: "30px"
                            //             },
                            //         },
                            //         {
                            //             value: "關山圳第14小組",
                            //             label: "下區",
                            //             symbol: {
                            //                 type: "picture-marker",
                            //                 url: "https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FA5252", 
                            //                 width: "30px",
                            //                 height: "30px"
                            //             },
                            //         },
                            //     ],
                            // },
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
                                      size: 10,
                                      weight: "bold"
                                    }
                                  },
                                }
                            ],
                            
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
                                type: "unique-value", 
                                field: "監測項目",
                                uniqueValueInfos: [
                                    {
                                        value: "水位",
                                        label: "水位",
                                        symbol: {
                                            type: "picture-marker",
                                            url: "https://img.icons8.com/?size=100&id=xo4SMxH9H70c&format=png&color=CC5DE8", 
                                            width: "20px",
                                            height: "20px"
                                        },
                                    },
                                    {
                                        value: "流量",
                                        label: "流量",
                                        symbol: {
                                            type: "picture-marker",
                                            url: "https://img.icons8.com/?size=100&id=xo4SMxH9H70c&format=png&color=20C997", 
                                            width: "20px",
                                            height: "20px"
                                        },
                                    },
                                    {
                                        value: "監視器",
                                        label: "監視器",
                                        symbol: {
                                            type: "picture-marker",
                                            url: "https://img.icons8.com/?size=100&id=86814&format=png&color=339AF0", 
                                            width: "20px",
                                            height: "20px"
                                        },
                                        // symbol: {
                                        //     type: "simple-marker", 
                                        //     size: 10,
                                        //     color: "#D2E9FF",
                                        //     style: "solid",
                                        //     outline: {  
                                        //         color: "blue",
                                        //         width: 10
                                        //       }
                                        //   }
                                    },
                                ],
                                
                            },
                            labelingInfo: [
                                {
                                    labelExpressionInfo: {
                                        // 使用 Arcade 表达式根据监测项目信息生成不同的标签内容
                                        expression: `
                                            var type = $feature["監測項目"];
                                            var value = $feature["OBJECTID"];
                                            var labelText = '';
                                            
                                            if (type == "水位") {
                                                if(value==17){
                                                    labelText = "流量: " + value + " cms"
                                                }else{
                                                    labelText = "水位: " + value + " m";
                                                }
                                            } else if (type == "監視器") {
                                                labelText = "";
                                            }
                        
                                            return labelText;
                                        `
                                    },
                                    symbol: {
                                        type: "text",
                                        color: [0, 0, 0, 0.85],  // 黑色文本
                                        haloColor: [255, 255, 255, 0.85],  // 白色光晕
                                        haloSize: 1,
                                        font: {
                                            size: 10,
                                            weight: "bold"
                                        }
                                    },
                                    labelPlacement: "above-center",  // 标签位置
                                    minScale: 0,
                                    maxScale: 0
                                }
                            ]
                        },
                ]
            });
            this.mapProfile.subLayers.groupLayer=mapImagelayer.findSublayerById(6);//水利小組 存到mapProfile
            this.mapProfile.subLayers.riverLayer=mapImagelayer.findSublayerById(3);//渠道 存到mapProfile
            this.mapProfile.subLayers.gateLayer=mapImagelayer.findSublayerById(1);//水閘門 存到mapProfile
            
            //監測設備名稱(監測站)
            // (mapImagelayer.findSublayerById(1)).on('click', (event) => {
            //   console.log(event)  
            // })

            // let tiledLayer = new this.esri.WebTileLayer({
            //     urlTemplate: "https://wmts.nlsc.gov.tw/wmts/PHOTO_MIX/default/GoogleMapsCompatible/{z}/{y}/{x}",
            // });
            
            let tiledLayer1 = new this.esri.WebTileLayer({
                urlTemplate: "https://wmts.nlsc.gov.tw/wmts/PHOTO_MIX/default/GoogleMapsCompatible/{z}/{y}/{x}",
                opacity: 0.5
                // subDomains: ["a", "b", "c"],
                // copyright: 'Map data from &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Map design by &copy; <a href="http://opentopomap.org/" target="_blank">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>) contributors'
            });
            
            let lackOfWaterGraphicsLayer = new this.esri.GraphicsLayer({
                labelingInfo: [{
                  labelExpressionInfo: {
                    labelExpression: "[name]",
                    labelPlacement: "always-horizontal",
                  },
                  symbol: {
                    type: "text",
                    color: "black",
                    font: {
                      size: 12,
                      weight: "bold"
                    }
                  },
                  labelPlacement: "above-center",
                  minScale: 0,
                  maxScale: 0
                }]
              }); //缺少水資源
            this.mapProfile.subLayers.lackOfWaterGraphicsLayer = lackOfWaterGraphicsLayer//存到mapProfile
            
            
            // this.lackOfWaterGraphicsLayerHandle()
            // this.labelHandle()
            let map = new this.esri.Map({
                //basemap: "topo-vector", // You can choose other basemaps as well
                
                layers: [
                    tiledLayer1, //最下層
                    mapImagelayer,  //次下層
                    lackOfWaterGraphicsLayer //最上層
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

            // const legend = new this.esri.Legend({
            //     view: view
            //   });
      
            //   view.ui.add(legend, "bottom-right");

            view.on('click', (event) => {

                // view.hitTest(event).then((response) => {
                //     console.log("response:",response);
                //     if(response.results.length) {
                //         let graphic = response.results[0].graphic;
                //         console.log('graphic', graphic);
                //     }
                // })
                const screenPoint = {
                    x: event.x,
                    y: event.y
                };
                
                console.log('screenPoint', screenPoint);
                const sublayer = mapImagelayer.findSublayerById(1)
                console.log('sublayer', sublayer);
                
                  // 創建查詢
                const query = sublayer.createQuery();
                query.geometry = view.toMap(screenPoint); // 使用點擊位置作為查詢幾何範圍
                query.distance = 0.1;
                query.units = "kilometers";
                query.outFields = ["*"]; // 指定要查詢的屬性名稱
                query.spatialRelationship = "intersects"; // 查詢幾何相交的要素
                query.returnGeometry = true; // 如果需要回傳幾何資料
                // 執行查詢

                sublayer.queryFeatures(query).then(function(result) {
                    console.log('result.features[0].attributes', result.features[0].attributes["監測項目"]);
                    if (result.features.length > 0) {
                        //只有監視器才會觸發
                        if(result.features[0].attributes["監測項目"]==="監視器"){
                            let cctvTitle = result.features[0].attributes["監測設備名稱_監測站_"]
                            vm.$emit('show-cctv', cctvTitle);
                        }
                    } else {
                    console.log("沒有查詢到相關資料。");
                    }
                }).catch(function(error) {
                    console.error("查詢失敗:", error);
                });

                console.log('view click', event);
            });
            
            

        },
        lackOfWaterGraphicsLayerHandle: function () {
            let _lackOfWaterGraphicsLayer = toRaw(this.mapProfile.subLayers.lackOfWaterGraphicsLayer);
            console.log('_lackOfWaterGraphicsLayer:', _lackOfWaterGraphicsLayer);
            this.lineReportList.forEach(item => {
                let point={
                    type: "point",
                    longitude: item.longitude,
                    latitude: item.latitude
                }
                let markerSymbol={
                    type: "simple-marker", 
                    style: "circle",
                    color: "white",
                    size: "8px", 
                    outline: {  
                    color:"red",
                    width: 2
                    }
                }
                let attributes= {
                    name: item.name,
                    description: `${!item.hasWater?'缺水':'有水'}`,
                    id: item.id // 添加 id 屬性
                }
                let popupTemplate = new this.esri.PopupTemplate({
                    title: "{name}", // 使用屬性名稱作為標題
                    content: [                          
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: "name",
                                    label: "地點名稱"
                                },
                                {
                                    fieldName: "description",
                                    label: "水情狀況"
                                }
                            ]
                        }
                    ],
                    dockOptions: {
                        position: "top-right",
                        buttonEnabled: true,
                        breakpoint: false
                    }
                  });
                if(!item.hasWater){
                    markerSymbol = {
                        type: "picture-marker",
                        url: "https://img.icons8.com/?size=100&id=JnBpOWFipVvz&format=png&color=FA5252", 
                        width: "30px",
                        height: "30px"
                    }
                }

                let graphic = new this.esri.Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                    attributes: attributes,
                    popupTemplate: popupTemplate
                });

                
                _lackOfWaterGraphicsLayer.add(graphic);

                item.markerGraphic  = graphic;
            });
            
            
            
            
        },
        labelHandle: function () {
            let mockData=[
                {
                    "groupName": "關山圳幹線_1支線取水後水位",
                    "value": 10
                },
                {
                    "groupName": "關山圳幹9給_起點水位",
                    "value": 20
                },
                {
                    "groupName": "關山圳幹線_3支線取水後水位",
                    "value": 15
                },
                {
                    "groupName": "關山圳幹9給_小尺度取水後水位",
                    "value": 10
                },
                {
                    "groupName": "關山圳1支線取水水位",
                    "value": 20
                },
                {
                    "groupName": "關山圳2支線取水水位",
                    "value": 15
                },
                {
                    "groupName": "關山圳3支線取水水位",
                    "value": 30
                },
                {
                    "groupName": "關山圳幹線_2支線取水後水位",
                    "value": 20
                },
                {
                    "groupName": "關山圳幹9給_小尺度取水前水位",
                    "value": 15
                },
                {
                    "groupName": "關山圳幹線_起點水位",
                    "value": 25
                },
                {
                    "groupName": "關山圳導水路進排水門",
                    "value": ''
                },
                {
                    "groupName": "關山圳沉砂池進排水門",
                    "value": ''
                },
                {
                    "groupName": "池上圳水位計1水位",
                    "value": 10
                },
                {
                    "groupName": "池上圳水位計1流量(計算)",
                    "value": 12
                }
            ]
            let subLayer = toRaw(this.mapProfile.subLayers.gateLayer);

            let query = subLayer.createQuery();
            // let _where = `水利小組名稱 IN (`;"水利小組名稱 IN ('光復圳8-4號池小組', '光復圳8-17號池小組', '光復圳2-4號池小組')"
            // this.lackingWaterGroupListData.forEach((groupName, idx) => {
            //     _where += `${(idx > 0) ? ' ,' : ''}'${groupName}'`
            // });
            // _where += ')';
            // console.log(_where);
            // query.where = _where;//"水利小組名稱 IN ('光復圳8-4號池小組', '光復圳8-17號池小組', '光復圳2-4號池小組')"; // Replace with your own criteria
            query.returnGeometry = true;
            query.outFields = ["*"];
            
            subLayer.queryFeatures(query).then((result) => {
                if (result.features.length > 0) {   
                let labelingInfo = result.features.map((feature) => {
                let type = feature.attributes["監測項目"];
                let itemName= feature.attributes["監測設備名稱_監測站_"];
                let value=''

                mockData.forEach((item) =>{
                    if(item.groupName===itemName){
                        value=item.value
                    }
                })
                let labelText = "";
                if (type==="水位") {
                    labelText = `水位: ${value} m`;
                } else if (type==="流量") {
                    labelText = `流量: ${value} cms`;
                } else {
                    labelText = '';
                }
                console.log("txt:",labelText)
                return {
                    labelExpressionInfo: {
                        expression: `"${labelText}"`
                    },
                    symbol: {
                        type: "text",
                        color: [0, 0, 0, 0.85],
                        haloColor: [255, 255, 255, 0.85],
                        haloSize: 1,
                        font: {
                            size: 10,
                            weight: "bold"
                        }
                    },
                    labelPlacement: "above-center",
                    minScale: 0,
                    maxScale: 0
                };
            });

            console.log('labelingInfo:',labelingInfo)
            subLayer.labelingInfo = labelingInfo;
            } else {
                console.log("No polygons found matching the query criteria.");
            }
            }).catch(function (error) {
                console.error("Error querying features:", error);
            });
        }
        
    },
    mounted() {
        this.init();
        
    },
    template: `
    

        <div id="map">
        </div>

    `
};

