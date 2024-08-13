import { firebaseDataAccess } from '../firebaseDataAccess.js'
import Enumerable from '../../plugins/linq.js'
export default {
    components: {

    },
    //inject: ['currentComponent'],
    data() {
        return {
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
                        symbol: '<i class="fa-regular fa-face-frown" style="color: red;"></i>', 
                    }, 
                    'normal': {
                        definition: '41% ~ 60%', 
                        symbol: '<i class="fa-regular fa-face-smile" style="color: #FF943D;"></i>'
                    }, 
                    'good': {
                        definition: '> 61%', 
                        symbol: '<i class="fa-regular fa-face-laugh-beam" style="color: green;"></i>'
                    , }
                }
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
                dep1DataDisplayFieldList: [
                    {field: "埤池面積(m2)", caption: "埤池面積(平方公尺)"}, 
                    {field: "有效庫容(m3)", caption: "有效庫容(立方公尺)"}, 

                    {field: "給水塔底標高(m)", caption: "給水塔底標高(公尺)"}, 
                    {field: "滿水位標高(m)", caption: "滿水位標高(公尺)"}, 
                    {field: "滿水位", caption: "滿水位"}, 

                    {field: "水源別", },
                    
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
                    {field: "SurfaceArea", caption: "表面積(m)"}, 
                    {field: "WaterStorage", caption: "蓄水量(m)"}, 
                    {field: "PercentageOfStorage", caption: "蓄水量(佔滿庫比率)"},
                ], 
            }, 
            rightOffCanvas: null,
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
                w.totalCurrentPercentage = Math.round10(w.totalCurrentQty / w.totalQty * 100, -2);
            });
            let sorted = Enumerable.from(filteredList).orderBy(f=>f.totalCurrentPercentage);
            return sorted;
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
                })
                .orderBy(
                    item =>  item["Dummy目前容量比率"]
                );
            
            return arr.toArray();
        }
    },
    methods: {
        init: function () {
            this.loadData();
            
            let offcanvasEl = document.getElementById('right-offcanvas')
            this.rightOffCanvas = new bootstrap.Offcanvas(offcanvasEl);

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
                        try {
                            dummyCurrent = getRandomNumber(0, Number(obj["有效庫容(m3)"]));
                            dummyCurrentPercentage = Math.round10((dummyCurrent / Number(obj["有效庫容(m3)"])) * 100, -2);
                        } catch (ex) {
                            console.log('random error: ', ex);
                        }
                        obj["Dummy目前容量"] = dummyCurrent;
                        obj["Dummy目前容量比率"] = dummyCurrentPercentage;
                    });
                }
            );
            this.dataAccess.getData(
                {
                    path: '/bigboss-workstation-group'
                },
                (returnList) => {
                    this.pondProfile.workstationGroupList = returnList;
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
        // testMap: function () {
        //     let url = 'https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds2/MapServer';
        //     this.mapProfile.map = L.map("map").setView(
        //         [23.80745279701942, 120.29574021937988],
        //         //[23.973993,120.9772426],
        //         16
        //     );

        //     if (this.mapProfile.layer != null) {

        //         this.mapProfile.map.removeLayer(this.mapProfile.layer);

        //     }

        //     let where = "工作站名稱 = '新屋工作站'";
        //     this.mapProfile.layer = L.esri
        //         .dynamicMapLayer({
        //             url: url,
        //             opacity: 0.7,
        //             // layers: [3, 6], //[3, 59]//[65, 64, 63]
        //             layerDefs: {
        //                 10: where//"工作站名稱 = '新屋工作站'"
        //             }
        //             // layerDefs: { 
        //             //   3: "IA_CNS='雲林'", 
        //             //   6: "COUNTYNAME='雲林縣'" }, 
        //             // //and Mng_cns = '西螺分處'
        //         })
        //         .addTo(this.mapProfile.map);

        //     this.mapProfile.layer
        //         .query()
        //         .layer(10)
        //         .where(where)
        //         .bounds((error, latlngbounds) => {
        //             if (error) {
        //                 console.error("Error querying feature layer bounds:", error);
        //                 alert('查無資料');
        //                 return;
        //             }

        //             if (latlngbounds._northEast == null) {
        //                 alert('查無資料');
        //                 return;
        //             }
        //             //this.ifFeatureLayerQuery = true;
        //             // Fit the map to the bounds of the features
        //             this.mapProfile.map.fitBounds(latlngbounds);
        //         });

        //     this.mapProfile.layer.bindPopup(function (err, featureCollection, response) {
        //         console.log('dynamicMapLayer.bindPopup');
        //         featureCollection.features.forEach(f => {
        //             console.log(f);
        //         });
        //         var count = featureCollection.features.length;
        //         return (count) ? count + ' features' : false;
        //     });
        // },
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
        <!--
        <div id="pane-content">
        </div>
        -->
        <div id="legend">
            水情：
            <div v-for="(obj) in pondProfile.currentQtyLevelStyle">
                <label>{{obj.definition}}</label><span v-html="obj.symbol"></span>
            </div>
            <br>
            圖例：
            <div v-for="(obj) in mapProfile.highlightLayer">
                <label>{{obj.layerCaption}}</label><span class="d-inline-block mx-2" style="width: 15px; height: 15px;" :style="{'background-color': obj.legend}"></span>
            </div>
            
        </div>
        <div id="summary-content-workstation-list" :style="{'background-color': mapProfile.highlightLayer['13'].style.fillColor}">
            <b>{{this.mapProfile.search.association}}</b> 共 <b>{{workstationGroupListData.length}}</b> 個工作站； <b>{{pondProfile.pondInfoList.length}}</b> 口埤塘
            <div class="col-md-12 p-2" :class="{'border': mapProfile.search.workstation == obj['工作站'], 'border-danger': mapProfile.search.workstation == obj['工作站']}" v-for="(obj, idx) in workstationGroupListData" :key="obj['工作站']">
                <!--{{obj}}-->
                <label class="w-50 d-inline-block">灌區:</label> 
                <span class="w-50 d-inline-block text-end">{{obj["分類"]}}</span>
                
                <br>
                <label class="w-50 d-inline-block">工作站:</label> 
                <span class="w-50 d-inline-block text-end">{{obj["工作站"]}} 
                    <a href="#" @click="mapProfile.search.workstation = obj['工作站']"><i class="fa-solid fa-magnifying-glass-location"></i></a>
                </span>
                
                <br>
                <label class="w-50">埤塘數:</label> 
                <span class="w-50 d-inline-block text-end">{{obj["pondCount"]}}</span>

                <br>
                <label class="w-50">總有效庫容:</label> 
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
                <label class="w-50">總目前庫容:</label> 
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
                <label class="w-50">總目前庫容佔比:</label> 
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
    
                <hr class="w-100" v-if="idx != workstationGroupListData.length">
            </div>
        </div>
        <div id="summary-content-pond-list" :style="{'background-color': mapProfile.highlightLayer['14'].style.fillColor}">
            <!--{{this.mapProfile.search.association}}-->
            <b>{{this.mapProfile.search.workstation}}</b> 共 <b>{{pondListData.length}}<b> 口埤塘
            <div class="col-md-12" v-for="(obj, idx) in pondListData" :key="obj.OBJECTID" 
                :class="{'border': (pickedPondInfo.gisData != null && pickedPondInfo.gisData['埤塘名稱'] == obj['埤塘名稱'] && pickedPondInfo.gisData['工作站名稱'] == obj['工作站'])}">
                <!--{{obj}}-->
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
                <label class="w-50">有效庫容:</label> 
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
                <label class="w-50">目前庫容:</label> 
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
                <label class="w-50">目前庫容佔比:</label> 
                <span class="w-50 d-inline-block text-end">
                    <math xmlns="http://www.w3.org/1998/Math/MathML">
                        <mn>{{obj["Dummy目前容量比率"]}}</mn>
                        <mi>%</mi>
                    </math>
                </span>

                <br>
                <label class="w-50">水情:</label> 
                <span class="w-50 d-inline-block text-end" v-html="pondProfile.currentQtyLevelStyle[getLevelFlag(obj['Dummy目前容量比率'])].symbol">
                </span>
                
                <hr class="w-100" v-if="idx != (pondListData.length - 1)">
            </div>

        </div>

        <div id="right-offcanvas" class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="staticBackdropLabel" v-if="pickedPondInfo.gisData != null">{{pickedPondInfo.gisData["埤塘名稱"]}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="row" v-if="pickedPondInfo.gisData != null">
                    <!--{{pickedPondInfo.gisData}}-->
                    <div class="col-md-6" v-for="(item, idx) in pickedPondInfo.gisDataDisplayFieldList">
                        <label class="fw-bold">{{(item.caption != null) ? item.caption : item.field}}:</label>
                        <span class="d-block">{{pickedPondInfo.gisData[item.field]}}</span>
                    </div>
                </div>
                <div class="row" v-if="pickedPondInfo.dep1Data != null">
                    <!--{{pickedPondInfo.dep1Data}}-->
                    <div class="col-md-6" v-for="(item, idx) in pickedPondInfo.dep1DataDisplayFieldList">
                        <label class="fw-bold">{{(item.caption != null) ? item.caption : item.field}}:</label>
                        <span class="d-block">{{pickedPondInfo.dep1Data[item.field]}}</span>
                    </div>
                </div>
                <div class="row" v-if="pickedPondInfo.dep1Data != null">
                    <!--{{pickedPondInfo.hvCurveData}}-->
                     <DataTable :value="pickedPondInfo.hvCurveData" tableStyle="min-width: 50rem"
                        
                        sortField="WaterDepth"
                        :sortOrder="-1"

                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[10, 20, 50]"
                    
                        :loading="loading"
>

                        <template #empty> 查無資料 </template>
                        <template #loading> 載入資料中… </template>

                        
                        <Column sortable v-for="(obj) in pickedPondInfo.hvCurveDataDisplayFieldList" sortable :field="obj.field" :header="obj.caption"></Column>

                        
                    </DataTable>      
                </div>
            </div>
        </div>

    
    `
};

