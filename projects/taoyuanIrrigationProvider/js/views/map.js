import { firebaseDataAccess } from '../firebaseDataAccess.js'
import Enumerable from '../../plugins/linq.js'
export default {
    components: {

    },
    //inject: ['currentComponent'],
    data() {
        return {
            ifShowLegend: true, 
            mapProfile: {
                map: null,
                layer: null,
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
            pondProfile: {
                hierarchyList: null,
                pondInfoList: [],
                workstationGroupList: [],
                pondHvCurveList: [], 
                currentQtyLevelStyle: {
                    'dangerous': {
                        definition: '<= 40%', 
                        symbol: '<i class="fa-regular fa-face-frown mx-2" style="color: red;"></i>', 
                    }, 
                    'normal': {
                        definition: '41% ~ 60%', 
                        symbol: '<i class="fa-regular fa-face-smile mx-2" style="color: #FF943D;"></i>'
                    }, 
                    'good': {
                        definition: '> 61%', 
                        symbol: '<i class="fa-regular fa-face-laugh-beam mx-2" style="color: green;"></i>'
                    , }
                }, 
                pondListDataSort:{
                    field: 'Dummy目前容量', 
                    desc: true
                }, 
                pondListDataColumn: [
                    {
                        key: uuid(),
                        caption: "埤塘名稱", 
                        field: "埤塘名稱", 
                    }, 
                    {
                        key: uuid(),
                        caption: "工作站", 
                        field: "工作站", 
                        canSort: false, 
                    }, 
                    {
                        key: uuid(),
                        caption: "有效貯水量", 
                        field: "有效庫容(m3)", 
                        display: (obj, field, value) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${value}</mn>
                                <mi>m</mi>
                                <msup>
                                    <mn></mn>
                                    <mn>3</mn>
                                </msup>

                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "目前貯水量", 
                        field: "Dummy目前容量", 
                        display: (obj, field, value) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${value}</mn>
                                <mi>m</mi>
                                <msup>
                                    <mn></mn>
                                    <mn>3</mn>
                                </msup>
                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "貯水率", 
                        field: "Dummy目前容量比率", 
                        display: (obj, field, value) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${value}</mn>
                                <mi>%</mi>
                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "灌溉面積", 
                        field: "灌溉面積(公頃)", 
                        display: (obj) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${obj["灌溉面積(公頃)"]}</mn>
                                <mi>公頃</mi>
                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "判釋面積-1期作", 
                        field: "判釋面積-1期作(公頃)", 
                        display: (obj) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${obj["判釋面積-1期作(公頃)"]}</mn>
                                <mi>公頃</mi>
                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "判釋面積-2期作", 
                        field: "判釋面積-2期作(公頃)", 
                        display: (obj) => {
                            return `
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>${obj["判釋面積-2期作(公頃)"]}</mn>
                                <mi>公頃</mi>
                            </math>
                            `;
                        }
                    }, 
                    {
                        key: uuid(),
                        caption: "水情", 
                        field: "Dummy目前容量比率", 
                        display: (obj) => {
                            return `${this.pondProfile.currentQtyLevelStyle[this.getLevelFlag(obj['Dummy目前容量比率'])].symbol}`;
                        }
                    }
                ]
            },
            pickedPondInfo: {
                gisData: null, 
                gisDataDisplayFieldList: [
                    {field: "管理處名稱", },
                    {field: "工作站名稱", },
                    {field: "原水利小組名稱", },
                    {field: "水利小組名稱", },
                ], 
                dep1Data: null, 
                dep1DataDisplayFieldWaterStorageList: [
                    // {field: "埤池面積(m2)", caption: "埤池面積(平方公尺)"}, 
                    // {field: "有效庫容(m3)", caption: "有效庫容(立方公尺)"}, 

                    // {field: "給水塔底標高(m)", caption: "給水塔底標高(公尺)"}, 
                    // {field: "滿水位標高(m)", caption: "滿水位標高(公尺)"}, 
                    // {field: "滿水位", caption: "滿水位"}, 

                    {field: "WaterStorageMaximum", caption: '最大貯水量(立方公尺)'},
                    {field: "WaterDepthMaximum", caption: '最高水深(公尺)'},
                    {field: "SurfaceAreaMaximum", caption: '滿水面積(平方公尺)'},
                    {field: "DeadWaterHeight", caption: '給水塔底標高(公尺)'},
                    {field: "FullWaterHeight", caption: '滿水位標高(公尺)'},
                    {field: "FullWaterHeightLoc", caption: '滿水位位置'},
                    {field: "FieldArea", caption: '小組面積'},
                    {field: "CanalName", caption: '支渠名稱'},

                    {field: "水源別", },
                ], 
                dep1DataDisplayFieldOtherInfoList: [
                    
                    {field: "灌溉功能"},
                    {field: "灌溉面積(公頃)"}, 
                    
                    {field: "行政區"}, 

                    {field: "生態敏感區域"}, 
                    {field: "工業用水用途"}, 
                    {field: "農業供灌用途"}, 
                    {field: "魚介用途"}, 
                    {field: "備註1"}, 
                    {field: "備註2"}, 
                ], 
                hvCurveData: null, 
                hvCurveDataDisplayFieldList: [
                    {field: "WaterDepth", caption: "水深(m)"},
                    {field: "SurfaceArea", caption: "水面面積(平方公尺)"}, 
                    {field: "WaterStorage", caption: "貯水量(立方公尺)"}, 
                    {field: "PercentageOfStorage", caption: "貯水率(%)"},
                ], 
            }, 
            rightOffCanvas: null,
            rightOffCanvasChart: null, 
            topOffCanvasPondFilter: null, 
            pondChart: null, 
            dataAccess: null
        }
    },
    watch: {
        associationList: function (n, o) {
            if (n != null) {
                this.mapProfile.search.association = n[0];
            }
        }, 
        'mapProfile.search.workstation': function(n, o){
            //console.log('mapProfile.search.workstation', n, o)
            this.searchMap();
            this.removeHighlightLayer(14);
            this.removeHighlightLayer(10);
            this.highlightPonds(`工作站名稱 = '${n}'`, 13);
            if(n != ''){
                this.drawChart();
            }
        }, 
        'mapProfile.search.group': function(n, o){
            //console.log('mapProfile.search.workstation', n, o)
            this.searchMap();
            //this.highlightPonds(`工作站名稱 = '${n}'`, 13);
        }
    },
    computed: {
        mapBaseQuery() {
            return `管理處名稱 = '${this.mapProfile.search.association}'`;
        },
        workstationGroupListData() {
            let filteredList = Enumerable.from(this.pondProfile.workstationGroupList).where(w => w['管理處'] == this.mapProfile.search.association).toArray();
            filteredList.forEach(w => {
                w.pondCount = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).count()
                w.totalQty = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).sum(item => item['有效庫容(m3)'])
                w.totalCurrentQty = Enumerable.from(this.pondProfile.pondInfoList).where(p => p['工作站'] == w.工作站).sum(item => item['Dummy目前容量'])
                w.totalCurrentPercentage = 
                    (w.totalQty == 0) ? 0 : Math.round10(w.totalCurrentQty / w.totalQty * 100, -2);
            });
            return filteredList;
        },
        pickedWorkstationGroupListData(){
            if(this.mapProfile.search.workstation == null || this.mapProfile.search.workstation == ''){
                return this.workstationGroupListData;
            }else{
                let r = Enumerable.from(this.workstationGroupListData).where(f => f['工作站'] == this.mapProfile.search.workstation).toArray();
                return r;
            }
            
        }, 
        associationList() {
            if (this.pondProfile.hierarchyList == null) {
                return [];
            }
            let r = Enumerable.from(this.pondProfile.hierarchyList).groupBy(_i => _i["管理處名稱"]).select(g => g.key()).toArray();
            return r;
        },
        workstationList() {
            let r = Enumerable.from(this.pondProfile.hierarchyList)
                .where(f => f["管理處名稱"] == this.mapProfile.search.association)
                .groupBy(_i => _i["工作站名稱"])
                .select(g => g.key())
                .toArray();

            
            return r;
        },
        groupList() {
            let r = Enumerable.from(this.pondProfile.hierarchyList)
                .where(f =>
                    f["管理處名稱"] == this.mapProfile.search.association &&
                    f["工作站名稱"] == this.mapProfile.search.workstation
                )
                .groupBy(_i => _i["水利小組名稱"])
                .select(g => g.key()).toArray();
            return r;
        },
        pondListData() {
            let arr = Enumerable.from(this.pondProfile.pondInfoList)
                .where(f => {
                    return (f['工作站'] == 
                            //f['工作站']
                        ((this.mapProfile.search.workstation != null && this.mapProfile.search.workstation.length > 0) ? this.mapProfile.search.workstation : f['工作站'])
                    );
                });
            let sorted;
            if(this.pondProfile.pondListDataSort.desc){
                sorted = arr.orderByDescending(
                    item =>  item[this.pondProfile.pondListDataSort.field]
                );
            }else{
                sorted = arr.orderBy(
                    item =>  item[this.pondProfile.pondListDataSort.field]
                );
            }

            // sorted = 
            //     sorted.orderBy(
            //         item =>  item["埤塘名稱"]
            //     );
            
            //return arr.toArray();
            return sorted.toArray();
        }, 
        pondListDataColumnSortOptionListData(){
            let r = Enumerable.from(this.pondProfile.pondListDataColumn).where(
                f => (f.canSort != false) 
            ).toArray();
            return r;
        }, 
    },
    methods: {
        init: function () {
            this.loadData();
            
            let offcanvasEl = document.getElementById('right-offcanvas')
            let offcanvasChartEl = document.getElementById('right-offcanvas-chart')
            let offcanvasPondFilterEl = document.getElementById('top-offcanvas-pond-filter')
            
            this.rightOffCanvas = new bootstrap.Offcanvas(offcanvasEl);
            this.rightOffCanvasChart = new bootstrap.Offcanvas(offcanvasChartEl);
            this.topOffCanvasPondFilter = new bootstrap.Offcanvas(offcanvasPondFilterEl);

            this.pondChart = echarts.init(document.getElementById("pond-chart"));

            //

            this.$nextTick(() => {
                this.initMap();
            });
        },
        loadData: function () {
            this.dataAccess = firebaseDataAccess();
            this.dataAccess.getData(
                {
                    path: '/bigboss-pond-hierarchy',
                    key: '管理處名稱',
                    value: this.mapProfile.search.association//'桃園管理處',
                },
                (returnList) => {
                    this.pondProfile.hierarchyList = returnList;
                }
            );
            this.dataAccess.getData(
                {
                    //path: '/bigboss-water-irrigation-providing'
                    path: '/bigboss-pond-dep1-with-gis-objectid'
                },
                (returnList) => {
                    this.pondProfile.pondInfoList = returnList;

                    //add dummy data
                    this.pondProfile.pondInfoList.forEach(obj => {
                        let dummyCurrent = 0;
                        let dummyCurrentPercentage = 0;
                        
                        let recognizedAreaPeriod1 = 0;
                        let recognizedAreaPeriod2 = 0;
                        try {
                            dummyCurrent = getRandomNumber(0, Number(obj["有效庫容(m3)"]));
                            dummyCurrentPercentage = 
                                (Number(obj["有效庫容(m3)"]) == 0) ? 0 : Math.round10((dummyCurrent / Number(obj["有效庫容(m3)"])) * 100, -2);
                        
                            let planArea = Number(obj["灌溉面積(公頃)"]);
                            recognizedAreaPeriod1 = getRandomNumber(0, Number(obj["灌溉面積(公頃)"]));
                            recognizedAreaPeriod2 = getRandomNumber(0, Number(obj["灌溉面積(公頃)"]));
                            
                        } catch (ex) {
                            console.log('random error: ', ex);
                        }
                        obj["Dummy目前容量"] = dummyCurrent;
                        obj["Dummy目前容量比率"] = dummyCurrentPercentage;

                        obj["判釋面積-1期作(公頃)"] = recognizedAreaPeriod1;
                        obj["判釋面積-2期作(公頃)"] = recognizedAreaPeriod2;
                    });
                }
            );
            this.dataAccess.getData(
                {
                    path: '/bigboss-workstation-group'
                },
                (returnList) => {

                    this.pondProfile.workstationGroupList = returnList;
                    console.log('this.pondProfile.workstationGroupList', this.pondProfile.workstationGroupList.length, this.pondProfile.workstationGroupList)
                }
            );
            this.dataAccess.getData(
                {
                    path: '/bigboss-pond-hukou-pond-hv-curve'
                },
                (returnList) => {
                    this.pondProfile.pondHvCurveList = returnList;
                    console.log(this.pondProfile.pondHvCurveList);
                }
            );
        },
        initMap: function () {
            this.mapProfile.map = L.map("map").setView(
                [23.80745279701942, 120.29574021937988],
                //[23.973993,120.9772426],
                16
            );
            this.addLayer();
        },
        addLayer: function () {
            let url = //'https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds2/MapServer';
                'https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds/MapServer';
            if (this.mapProfile.layer != null) {

                this.mapProfile.map.removeLayer(this.mapProfile.layer);

            }

            let where = this.mapBaseQuery;//`管理處名稱 = '${this.mapProfile.search.association}'`;
            console.log(where);
            this.mapProfile.layer = L.esri
                .dynamicMapLayer({
                    url: url,
                    //opacity: 0.7,
                    // layerDefs: {
                    //     10: where,
                    //         //"管理處名稱 = '桃園管理處' and 工作站名稱 = '湖口工作站'", 
                    //         //'0=0',
                    //     //11: where,
                    //     13: where,
                    //     14: where,//`管理處名稱 = '桃園管理處' and 工作站名稱 = '湖口工作站' and 水利小組名稱 = '光復圳1-1號池小組'`, //where,
                    //     15: where,
                    // }
                })
                .addTo(this.mapProfile.map);



            this.mapProfile.layer
                .query()
                .layer(14)
                .where(
                    where
                    //`管理處名稱 = '桃園管理處' and 工作站名稱 = '湖口工作站' and 水利小組名稱 = '光復圳1-1號池小組'`
                )
                .bounds((error, latlngbounds) => {
                    if (error) {
                        console.error("Error querying feature layer bounds:", error);
                        alert('查無資料');
                        return;
                    }

                    if (latlngbounds._northEast == null) {
                        alert('查無資料');
                        return;
                    }
                    //this.ifFeatureLayerQuery = true;
                    // Fit the map to the bounds of the features
                    this.mapProfile.map.fitBounds(latlngbounds);
                });


            // this.mapProfile.layer.bindPopup((err, featureCollection, response) => {
            //     console.log('dynamicMapLayer.bindPopup');

            //     let cont = '';

            //     let workstation = null;
            //     let pondName = null;
            //     featureCollection.features.forEach(f => {
            //         console.log(f);
            //         cont += this.getPondContent(f.properties);
            //         if (f.layerId == 14) {
            //             // let obj = f.properties;
            //             //workstation = f.properties['工作站名稱'];
            //             pondName = f.properties['埤塘名稱'];
            //         }
            //     });
            //     cont = pondName;
            //     //console.log(cont);
            //     return `<div class="row waiting-content">${cont}</div>`;
            //     //return `${cont}`;
            // });

            //let identifiedFeature;
            //let pane = document.getElementById("pane-content");
            this.mapProfile.map.on("click", (e) => {
                console.log(e);
                this.mapProfile.layer
                    .identify()
                    .layers('visible:14') // just the counties sublayer
                    .on(this.mapProfile.map)
                    .at(e.latlng)
                    .run(this.showPondContent);
            });

            this.mapProfile.layer.setLayers([
                10, //BB_4水利小組範圍_桃管_石管
                11, //BB_5圳路渠道_桃管_石管_幹支線
                13, //BB_3工作站範圍_桃管_石管
                14, //BB_6埤塘_1120512_桃管_石管
                15//, //BB_1管理處範圍_桃管_石管
                //12, //BB_5圳路渠道_桃管_石管_所有渠道    
            ]);
            // let layers = this.mapProfile.layer.getLayers();
            // console.log(layers);

            //this.highlightPonds(`OBJECTID = 20 OR OBJECTID = 11`);
        },
        removeHighlightLayer: function(layerId){
            if(this.mapProfile.highlightLayer[`${layerId}`].cache.length > 0){
                console.log(`remove layer: ${this.mapProfile.highlightLayer[`${layerId}`].length}`);
                this.mapProfile.highlightLayer[`${layerId}`].cache.forEach(_layer => {
                    this.mapProfile.map.removeLayer(_layer)
                });
                this.mapProfile.highlightLayer[`${layerId}`].cache.length = 0;
            }
        }, 
        highlightPonds: function(where, layerId){
            let _layerId = 14;
            if(layerId != null) _layerId = layerId
            let query = this.mapProfile.layer
            .query()
            .layer(
                //14
                _layerId
            ).where(
                    //`OBJECTID = 20 OR OBJECTID = 11`
                    where
                );

            query.run((error, featureCollection) => {
                if (error) {
                    console.error("Feature query error:", error);
                    return;
                }
                
                this.removeHighlightLayer(_layerId);
                
                console.log(featureCollection);
                console.log(_layerId, this.mapProfile.highlightLayer[`${_layerId}`].style);
                if (featureCollection.features.length > 0) {
                    //identifiedFeature = 
                    featureCollection.features.forEach(_f => {
                        let fLayer = L.geoJSON(_f)
                        fLayer.setStyle(
                            this.mapProfile.highlightLayer[`${_layerId}`].style
                            // {
                            //     color: '#000000', 
                            //     fillColor: '#001910'
                            // }
                        );
                        fLayer.addTo(this.mapProfile.map);
                        this.mapProfile.highlightLayer[`${_layerId}`].cache.push(fLayer);
                    })

                }
            });
        },
        showPondContent: function(error, featureCollection){
            let layerId = 14;
            //let pane = document.getElementById("pane-content");
            if (error) {
                return;
            }

            this.removeHighlightLayer(layerId);
            //pane.innerHTML = "No features identified.";

            // make sure at least one feature was identified.
            if (featureCollection.features.length > 0) {
                console.log(featureCollection);
                
                let feature = featureCollection.features[0];
                
                let identifiedFeatureLayer = L.geoJSON(feature).addTo(this.mapProfile.map);

                this.mapProfile.highlightLayer[`${layerId}`].cache.push(identifiedFeatureLayer);
                
                this.pickedPondInfo.gisData = feature.properties;
                this.pickedPondInfo.dep1Data = this.getDep1DataPondData(this.pickedPondInfo.gisData["埤塘名稱"], this.pickedPondInfo.gisData["工作站名稱"]);
                this.pickedPondInfo.hvCurveData = this.getHvCurveData(this.pickedPondInfo.gisData["埤塘名稱"], this.pickedPondInfo.gisData["工作站名稱"]);
                // let cont = this.getPondContent(this.pickedPondInfo.gisData);
                // cont += this.getDep1DataContent(this.pickedPondInfo.gisData["埤塘名稱"], this.pickedPondInfo.gisData["工作站名稱"]);
                // cont = `<div class="row">${cont}</div>`;
                // pane.innerHTML = cont;//soilDescription;
                this.rightOffCanvas.show();
            } 
            // else {
            //     pane.innerHTML = "No features identified.";
            // }
            
        }, 
        getPondContent: function (gisProperties) {
            let cont = '';
            Object.keys(gisProperties).forEach(key => {
                //console.log(`Key: ${key}, Value: ${obj[key]}`);
                let value = gisProperties[key];
                cont += `<div class="col-md-6">
                    <label class="fw-bold">${key}: </label>
                    <span class="d-block">${value}</span>
                </div>`
            });

            
            cont += '<hr class="col-md-12">'
            return cont;
        },
        getDep1DataPondData: function(pondName, workstation){
            let found = Enumerable.from(this.pondProfile.pondInfoList)
            .where(item => { return item['埤塘名稱'] == pondName && item['工作站'] == workstation; })
            .toArray();
            if (found.length > 0) {
                return found[0];
            }else{
                return null;
            }
        }, 
        getHvCurveData: function(pondName, workstation){
            console.log(pondName, workstation)
            if(workstation == '湖口工作站'){
                console.log('in filter')
                let arr = Enumerable.from(this.pondProfile.pondHvCurveList).where(p => p.PondName == pondName);
                return arr.toArray();
            }else{
                return null;
            }
        }, 
        getDep1DataContent: function (pondName, workstation) {
            let cont = '';
            if (pondName != null) {
                // let found = Enumerable.from(this.pondProfile.pondInfoList)
                //     .where(item => { return item['埤塘名稱'] == pondName && item['工作站'] == workstation; })
                //     .toArray();
                // console.log('found ponds: ', found);
                let dataObject = this.getDep1DataPondData(pondName, workstation);
                if (dataObject != null) {
                    // cont += `<hr class="col-md-12">`;
                    Object.keys(dataObject).forEach(key => {
                        //console.log(`Key: ${key}, Value: ${obj[key]}`);
                        let value = dataObject[key];
                        cont += `<div class="col-md-6">
                            <label>${key}: </label>
                            <span>${value}</span>
                        </div>`
                    });
                }
            }
            return cont;
        },
        getWhereQuery: function (whereString, searchField, gisField) {
            let r = '';

            let conditionValue = this.mapProfile.search[searchField];
            if (conditionValue != null && conditionValue.length > 0) {
                if (whereString.length > 0) {
                    r = `${whereString} and ${gisField} = '${conditionValue}'`;
                } else {
                    r = `${gisField} = '${conditionValue}'`
                }
            } else {
                r = whereString;
            }
            return r;
        },
        searchMap: function () {
            let where = '';
            where = this.getWhereQuery(where, 'association', '管理處名稱');
            where = this.getWhereQuery(where, 'workstation', '工作站名稱');
            where = this.getWhereQuery(where, 'group', '水利小組名稱');
            //`管理處名稱 = '桃園管理處' and 工作站名稱 = '桃園工作站'`;
            console.log(where);

            this.mapProfile.layer.setLayerDefs(
                {
                    10: where,
                    //11: where, 
                    13: where,
                    14: where,
                    15: where,
                }
            );
            setTimeout(() => {
                let q = this.mapProfile.layer
                    .query()
                    .layer(14)
                    .where(where);
                q.bounds((error, latlngbounds) => {
                    if (error) {
                        console.error("Error querying feature layer bounds:", error);
                        alert('查無資料');
                        return;
                    }

                    if (latlngbounds._northEast == null) {
                        alert('查無資料');
                        return;
                    }
                    //this.ifFeatureLayerQuery = true;
                    // Fit the map to the bounds of the features
                    this.mapProfile.map.fitBounds(latlngbounds);
                });
            }, 500);



        },
        getLevelFlag: function(currentQtyPercentage){
            if(currentQtyPercentage <= 40){
                return 'dangerous';
            }else if (currentQtyPercentage <= 45){
                return 'normal';
            }
            else{
                return 'good';
            }
        }, 
        pinPond: function(OBJECTID, group){
            console.log(OBJECTID);

            //水利小組
            this.highlightPonds(`水利小組名稱 = '${group}'`, 10);

            this.highlightPonds(`OBJECTID = ${OBJECTID}`, 14);
            // this.highlightPonds(`OBJECTID = ${OBJECTID}`, 10);
            console.log(group);

            this.mapProfile.layer
                .query()
                .layer(14)
                .where(`OBJECTID = ${OBJECTID}`)
                .run(this.showPondContent);

        },
        drawChart: function(){
            let collections = {
                pondNameList: [], 
                recognizedAreaPeriod1List: [], 
                recognizedAreaPeriod2List: [], 
                planedArea: [], 
                currentQty: [], 
                maxQty: [], 
                availabelQty: [], 
            }
            let fieldMappings = [
                {
                    dataField: '埤塘名稱', 
                    collectionField: 'pondNameList'
                }, 
                {
                    dataField: '判釋面積-1期作(公頃)', 
                    collectionField: 'recognizedAreaPeriod1List'
                }, 
                {
                    dataField: '判釋面積-2期作(公頃)', 
                    collectionField: 'recognizedAreaPeriod2List'
                }, 
                {
                    dataField: '灌溉面積(公頃)', 
                    collectionField: 'planedArea'
                }, 
                {
                    dataField: 'Dummy目前容量', 
                    collectionField: 'currentQty'
                }, 
                {
                    dataField: 'Dummy目前容量', 
                    collectionField: 'availabelQty', 
                    callback: (v) => {
                        return getRandomNumber(0, v);
                    }
                }, 
                {
                    dataField: '有效庫容(m3)', 
                    collectionField: 'maxQty'
                }, 
            ]
            console.log('drawChart', this.pondListData);
            this.pondListData.forEach(data => {
                fieldMappings.forEach(f => {
                    if(f.callback == null){

                        collections[f.collectionField].push(
                            data[f.dataField]
                        );
                    }else{

                        collections[f.collectionField].push(
                            f.callback(data[f.dataField])
                        );
                    }
                });
            });
            console.log('drawChart', collections);

            let xAxisData = null; 
            let yAxisData = null;
            let option = {
                title: {
                  text: ` ${this.mapProfile.search.workstation} ${this.pondListData.length}口埤塘 供水及灌溉面積關係圖`,
                },
                tooltip: {},
                legend: {
                  data: ["目前庫容量", "最大庫容量", "可供灌容量", "判釋面積"],
                },
                xAxis: {
                  //注意，切換座標軸的籤時，要也要切換type值
                  //type: ((this.xAxisData == null) ? 'value' : 'category'),  
                  data: collections.pondNameList
                  //this.xAxisData
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '容量',
                        position: 'left',
                        alignTicks: true,
                        axisLine: {
                          show: true,
                          lineStyle: {
                            color: 'blue'
                          }
                        },
                        axisLabel: {
                          formatter: '{value} 立方公尺'
                        }
                    }, 
                    {
                        type: 'value',
                        name: '面積',
                        position: 'right',
                        alignTicks: true,
                        axisLine: {
                          show: true,
                          lineStyle: {
                            color: 'red'
                          }
                        },
                        axisLabel: {
                          formatter: '{value} 公頃'
                        }
                    }
                ], 
                series: [
                    {
                        name: '目前庫容量',
                        type: 'line',
                        data: collections.currentQty
                    },
                    {
                        name: '最大庫容量',
                        type: 'line',
                        data: collections.maxQty
                    },
                    {
                        name: '可供灌容量',
                        type: 'line',
                        data: collections.availabelQty
                    },
                    {
                        name: '判釋面積',
                        type: 'scatter',
                        yAxisIndex: 1,
                        data: collections.recognizedAreaPeriod1List
                    },
                    // {
                    //     name: '判釋面積-2期作(公頃)',
                    //     type: 'scatter',
                    //     yAxisIndex: 1,
                    //     data: collections.recognizedAreaPeriod2List
                    // },
                ],
              };
        
        
              // Display the chart using the configuration items and data just specified.
              this.pondChart.setOption(option);

            this.rightOffCanvasChart.show();
        }, 
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="container">
            <div class="row my-2">

                <div class="col-md-6">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">管理處</label>
                        <input type="text" class="form-control" v-model="mapProfile.search.association" readonly>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">工作站</label>
                        <select class="form-select" v-model="mapProfile.search.workstation">
                            <option selected value="">不篩選</option>
                            <option v-for="(obj, idx) in workstationList" :value="obj">{{obj}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4" v-if="false">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">水利小組</label>
                        <select class="form-select" v-model="mapProfile.search.group">
                            <option selected value="">不篩選</option>
                            <option v-for="(obj, idx) in groupList" :value="obj">{{obj}}</option>
                        </select>
                        <button class="btn btn-outline-secondary" type="button" @click="searchMap">查詢</button>
                    </div>
                </div>
                
            </div>
        </div>

        <div id="map">
        </div>

        <div id="legend">
            <div @click="ifShowLegend = !ifShowLegend" class="w-100" style="cursor: pointer">
                <label class="w-50">圖例</label>
                <span class="d-inline-block w-50 text-end">
                    <i class="fa-solid" :class="{'fa-angle-up': !ifShowLegend, 'fa-angle-down': ifShowLegend}"></i>
                </span>
            </div>
            <div v-if="ifShowLegend">
                <b>水情：</b>
                <div v-for="(obj) in pondProfile.currentQtyLevelStyle">
                    <label>{{obj.definition}}</label><span v-html="obj.symbol"></span>
                </div>
                <br>
                <b>圖例：</b>
                <div v-for="(obj) in mapProfile.highlightLayer">
                    <label>{{obj.layerCaption}}</label><span class="d-inline-block mx-2" style="width: 15px; height: 15px;" :style="{'background-color': obj.legend}"></span>
                </div>
            </div>
        </div>
        <div id="summary-content-workstation-list" :style="{'background-color': mapProfile.highlightLayer['13'].style.fillColor}">
            <b>{{this.mapProfile.search.association}}</b> 
            共 <b>{{pickedWorkstationGroupListData.length}}</b> 個工作站 
            <b>{{pondProfile.pondInfoList.length}}</b> 口埤塘
            <div class="col-md-12 p-2" 
                v-for="(obj, idx) in pickedWorkstationGroupListData" 
                :key="obj['工作站']">
                <!--{{obj}}-->
                <label class="w-50 d-inline-block">灌區:</label> 
                <span class="w-50 d-inline-block text-end">{{obj["分類"]}}</span>
                
                <br>
                <label class="w-50 d-inline-block">工作站:</label> 
                <span class="w-50 d-inline-block text-end">
                    {{obj["工作站"]}} 
                    <!--<a href="#" @click="mapProfile.search.workstation = obj['工作站']"><i class="fa-solid fa-magnifying-glass-location"></i></a>-->
                </span>
                
                <br>
                <label class="w-50">埤塘數:</label> 
                <span class="w-50 d-inline-block text-end">{{obj["pondCount"]}}</span>

                <br>
                <label class="w-50">總有效貯水量:</label> 
                <span class="w-50 d-inline-block text-end">
                    <math xmlns="http://www.w3.org/1998/Math/MathML">
                        <mn>{{obj["totalQty"]}}</mn>
                        <mi>m</mi>
                        <msup>
                            <mn></mn>
                            <mn>3</mn>
                        </msup>
                    </math>
                </span>

                <br>
                <label class="w-50">總貯水量:</label> 
                <span class="w-50 d-inline-block text-end">
                    <math xmlns="http://www.w3.org/1998/Math/MathML">
                        <mn>{{obj["totalCurrentQty"]}}</mn>
                        <mi>m</mi>
                        <msup>
                            <mn></mn>
                            <mn>3</mn>
                        </msup>
                    </math>
                </span>
                
                <br>
                <label class="w-50">貯水率:</label> 
                <span class="w-50 d-inline-block text-end">
                    <math xmlns="http://www.w3.org/1998/Math/MathML">
                        <mn>{{obj["totalCurrentPercentage"]}}</mn>
                        <mi>%</mi>
                    </math>
                </span>

                <br>
                <label class="w-50">總水情:</label> 
                <span class="w-50 d-inline-block text-end" v-html="pondProfile.currentQtyLevelStyle[getLevelFlag(obj['totalCurrentPercentage'])].symbol">
                </span>

                <div v-if="this.mapProfile.search.workstation != ''">
                    <label class="w-50">統計圖:</label> 
                    <span class="w-50 d-inline-block text-end">
                        <a href="#" @click="drawChart()"><i class="fa-solid fa-chart-simple"></i></a>
                    </span>
                </div>
    
                <hr class="w-100" v-if="idx != workstationGroupListData.length">
            </div>
        </div>
        <div id="summary-content-pond-list" :style="{'background-color': mapProfile.highlightLayer['14'].style.fillColor}">
            <!--{{this.mapProfile.search.association}}-->
            <div class="col-md-12">
            <b>{{this.mapProfile.search.workstation}}</b> 共 <b>{{pondListData.length}}</b> 口埤塘
            </div>
            
            <a v-if="false" href="#" @click="topOffCanvasPondFilter.show();"><i class="fa-solid fa-sort"></i></a>

            <div class="col-md-12">
                <div class="input-group input-group-sm mb-3">
                    <label class="input-group-text" for="inputGroupSelect01">排序</label>
                    <select v-model="pondProfile.pondListDataSort.field">
                        <option v-for="(col, colIdx) in pondListDataColumnSortOptionListData" :value="col.field">{{col.caption}}</option>
                    </select>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2">
                        <i class="fa-solid" :class="[(pondProfile.pondListDataSort.desc) ? 'fa-arrow-down-z-a' : 'fa-arrow-down-a-z']" @click="pondProfile.pondListDataSort.desc = !pondProfile.pondListDataSort.desc"></i>
                    </button>
                </div>
            </div>

            <div class="col-md-12" v-for="(obj, idx) in pondListData" :key="obj.OBJECTID" 
                :class="{'border': (pickedPondInfo.gisData != null && pickedPondInfo.gisData['埤塘名稱'] == obj['埤塘名稱'] && pickedPondInfo.gisData['工作站名稱'] == obj['工作站'])}">
                <!--{{obj}}-->

                <div v-for="(col, colIdx) in pondProfile.pondListDataColumn" :key="col.field">
                    <label class="w-50">{{col.caption}}:</label> 
                    <span class="w-50 d-inline-block text-end" v-if="col.display == null">
                        {{obj[col.field]}} 
                        <a v-if="colIdx == 0" href="#" @click="pinPond(obj.OBJECTID, obj['水利小組名稱'])">
                            <i class="fa-solid fa-magnifying-glass-location"></i>
                        </a>
                    </span>
                    <span class="w-50 d-inline-block text-end" v-else v-html="col.display(obj, col.field, obj[col.field])">
                    </span>
                </div>

                <!--
                    <label class="w-50">埤塘名稱:</label> 
                    <span class="w-50 d-inline-block text-end">
                        {{obj["埤塘名稱"]}} 
                        <a href="#" @click="pinPond(obj.OBJECTID, obj['水利小組名稱'])">
                            <i class="fa-solid fa-magnifying-glass-location"></i>
                        </a>
                    </span>

                    <br>
                    <label class="w-50">工作站:</label> 
                    <span class="w-50 d-inline-block text-end">
                        {{obj["工作站"]}} 
                    </span>

                    <br>
                    <label class="w-50">有效貯水量:</label> 
                    <span class="w-50 d-inline-block text-end"> 
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["有效庫容(m3)"]}}</mn>
                            <mi>m</mi>
                            <msup>
                                <mn></mn>
                                <mn>3</mn>
                            </msup>
                        </math>
                    </span>
                    
                    <br>
                    <label class="w-50">目前貯水量:</label> 
                    <span class="w-50 d-inline-block text-end">
                        
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["Dummy目前容量"]}}</mn>
                            <mi>m</mi>
                            <msup>
                                <mn></mn>
                                <mn>3</mn>
                            </msup>
                        </math>
                    </span>

                    <br>
                    <label class="w-50">貯水率:</label> 
                    <span class="w-50 d-inline-block text-end">
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["Dummy目前容量比率"]}}</mn>
                            <mi>%</mi>
                        </math>
                    </span>

                    <br>
                    <label class="w-50">灌溉面積:</label> 
                    <span class="w-50 d-inline-block text-end">
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["灌溉面積(公頃)"]}}</mn>
                            <mi>公頃</mi>
                        </math>
                    </span>

                    <br>
                    <label class="w-50">判釋面積-1期作:</label> 
                    <span class="w-50 d-inline-block text-end">
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["判釋面積-1期作(公頃)"]}}</mn>
                            <mi>公頃</mi>
                        </math>
                    </span>
                    <br>
                    <label class="w-50">判釋面積-2期作:</label> 
                    <span class="w-50 d-inline-block text-end">
                        <math xmlns="http://www.w3.org/1998/Math/MathML">
                            <mn>{{obj["判釋面積-2期作(公頃)"]}}</mn>
                            <mi>公頃</mi>
                        </math>
                    </span>
                    
                    <br>
                    <label class="w-50">水情:</label> 
                    <span class="w-50 d-inline-block text-end" v-html="pondProfile.currentQtyLevelStyle[getLevelFlag(obj['Dummy目前容量比率'])].symbol">
                    </span>
                -->
                <hr class="w-100" v-if="idx != (pondListData.length - 1)">
            </div>

        </div>

        <div id="right-offcanvas" class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="staticBackdropLabel" v-if="pickedPondInfo.gisData != null">埤塘名稱: {{pickedPondInfo.gisData["埤塘名稱"]}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                
                <div class="row" v-if="pickedPondInfo.gisData != null">
                    <!--{{pickedPondInfo.gisData}}-->
                    <h5 class="my-2">現況摘要</h5>
                    <div class="col-md-3">

                            <span class="text-center w-100 d-inline-block" style="font-size: xx-large" v-html="pondProfile.currentQtyLevelStyle[getLevelFlag(pickedPondInfo.dep1Data['Dummy目前容量比率'])].symbol">
                            </span>
                    </div>
                    <div class="col-md-3">
                        <label class="fw-bold">目前貯水量:</label>
                        <span class="d-block">
                            
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>{{pickedPondInfo.dep1Data['Dummy目前容量']}}</mn>
                                <mi>m</mi>
                                <msup>
                                    <mn></mn>
                                    <mn>3</mn>
                                </msup>
                            </math>
                        </span>
                    </div>
                    <div class="col-md-3">
                        <label class="fw-bold">最大貯水量:</label>
                        <span class="d-block">
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>{{pickedPondInfo.dep1Data['有效庫容(m3)']}}</mn>
                                <mi>m</mi>
                                <msup>
                                    <mn></mn>
                                    <mn>3</mn>
                                </msup>
                            </math>
                        </span>
                    </div>
                    <div class="col-md-3">
                        <label class="fw-bold">貯水率:</label>
                        <span class="d-block">
                            <math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mn>{{pickedPondInfo.dep1Data['Dummy目前容量比率']}}</mn>
                                <mi>%</mi>
                            </math>
                        </span>
                    </div>
                </div>
                <hr class="w-100 my-2"/>
                <div class="row" v-if="pickedPondInfo.gisData != null">
                    <!--{{pickedPondInfo.gisData}}-->
                    <h5 class="my-2">管理資訊</h5>
                    <div class="col-md-6" v-for="(item, idx) in pickedPondInfo.gisDataDisplayFieldList">
                        <label class="fw-bold">{{(item.caption != null) ? item.caption : item.field}}:</label>
                        <span class="d-block">{{pickedPondInfo.gisData[item.field]}}</span>
                    </div>
                </div>
                <hr class="w-100 my-2"/>
                <div class="row" v-if="pickedPondInfo.dep1Data != null">
                    <!--{{pickedPondInfo.dep1Data}}-->
                    <h5 class="my-2">貯水資訊</h5>
                    <div class="col-md-6" v-for="(item, idx) in pickedPondInfo.dep1DataDisplayFieldWaterStorageList">
                        <label class="fw-bold">{{(item.caption != null) ? item.caption : item.field}}:</label>
                        <span class="d-block">{{pickedPondInfo.dep1Data[item.field]}}</span>
                    </div>
                </div>
                <hr class="w-100 my-2"/>
                <div class="row" v-if="pickedPondInfo.dep1Data != null">
                    <!--{{pickedPondInfo.dep1Data}}-->
                    <h5 class="my-2">其他資訊</h5>
                    <div class="col-md-6" v-for="(item, idx) in pickedPondInfo.dep1DataDisplayFieldOtherInfoList">
                        <label class="fw-bold">{{(item.caption != null) ? item.caption : item.field}}:</label>
                        <span class="d-block">{{pickedPondInfo.dep1Data[item.field]}}</span>
                    </div>
                </div>
                <hr class="w-100 my-2"/>
                <div class="row" v-if="pickedPondInfo.dep1Data != null">
                    <!--{{pickedPondInfo.hvCurveData}}-->
                    <h5 class="my-2">HV Curve</h5>
                     <DataTable :value="pickedPondInfo.hvCurveData" tableStyle="min-width: 50rem"
                        
                        sortField="WaterDepth"
                        :sortOrder="-1"

                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[10, 20, 50]"
                    
                        :loading="loading">

                        <template #empty> 查無資料 </template>
                        <template #loading> 載入資料中… </template>

                        
                        <Column sortable v-for="(obj) in pickedPondInfo.hvCurveDataDisplayFieldList" sortable :field="obj.field" :header="obj.caption"></Column>

                        
                    </DataTable>      
                </div>
            </div>
        </div>
        <div id="right-offcanvas-chart" class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="staticBackdropLabel" >
                    <b>{{this.mapProfile.search.workstation}}</b> 共 <b>{{pondListData.length}}</b> 口埤塘
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div id="pond-chart"  style="width: 90%;height:500px;"></div>
            </div>
        </div>

        <div id="top-offcanvas-pond-filter" class="offcanvas offcanvas-top" data-bs-backdrop="static" tabindex="-1" aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="staticBackdropLabel" >
                    <b>{{this.mapProfile.search.workstation}}</b> 共 <b>{{pondListData.length}}</b> 口埤塘排序設定
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="row">
                    <div class="col-md-12">
                        埤塘名稱 
                    </div>
                    <div class="col-md-12">
                        <button @click="" class="btn btn-primary">確定</button>
                    </div>

                </div>

            </div>
        </div>

    
    `
};

