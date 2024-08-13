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
                    workstation: '',
                    group: '',
                }, 
                highlightLayer: {
                    //BB_4水利小組範圍_桃管_石管
                    '10': {
                        cache: [], 
                        style: {
                            fillColor: 'lime', 
                            color: 'black'
                        }
                    }, 
                    //BB_5圳路渠道_桃管_石管_幹支線
                    '11': {
                        cache: [], 
                        style: {
                            fillColor: 'blue', 
                            color: 'black'
                        }
                    }, 
                    //BB_3工作站範圍_桃管_石管
                    '13': {
                        cache: [], 
                        style: {
                            fillColor: 'yellow', 
                            color: 'black'
                        }
                    }, 
                    //BB_6埤塘_1120512_桃管_石管
                    '14': {
                        cache: [], 
                        style: {
                            fillColor: 'aqua', 
                            color: 'black'
                        }
                    },  
                    //BB_1管理處範圍_桃管_石管
                    '15': {
                        cache: [], 
                        style: {
                            // fillColor: 'lime', 
                            color: 'black'
                        }
                    },  
                }
            },
            pondProfile: {
                hierarchyList: null,
                pondInfoList: [],
                workstationGroupList: [],
            },
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
            return filteredList;
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
            
            return arr.toArray();
        }
    },
    methods: {
        init: function () {
            this.loadData();
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
            let url = 'https://gisportal.triwra.org.tw/server/rest/services/BigBossTaoyuanPonds2/MapServer';
            if (this.mapProfile.layer != null) {

                this.mapProfile.map.removeLayer(this.mapProfile.layer);

            }

            let where = this.mapBaseQuery;//`管理處名稱 = '${this.mapProfile.search.association}'`;
            console.log(where);
            this.mapProfile.layer = L.esri
                .dynamicMapLayer({
                    url: url,
                    opacity: 0.7,
                    // layers: [
                    //     10, //BB_4水利小組範圍_桃管_石管
                    //     //11, //BB_5圳路渠道_桃管_石管_幹支線
                    //     13, //BB_3工作站範圍_桃管_石管
                    //     14, //BB_6埤塘_1120512_桃管_石管
                    //     15//, //BB_1管理處範圍_桃管_石管
                    //     //12, //BB_5圳路渠道_桃管_石管_所有渠道
                    // ],
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
            //             workstation = f.properties['工作站名稱'];
            //             pondName = f.properties['埤塘名稱'];
            //         }
            //     });
            //     //var count = featureCollection.features.length;
            //     // return (count) ? count + ' features' : false;
            //     //return `<div style="background-color: blue;">${count} f</div>`;
            //     cont += this.getDep1DataContent(pondName, workstation);
            //     //console.log(cont);
            //     return `<div class="row waiting-content">${cont}</div>`;
            //     //return `${cont}`;
            // });
            //let identifiedFeature;
            //let pane = document.getElementById("pane-content");
            this.mapProfile.map.on("click", (e) => {
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
                
                if (featureCollection.features.length > 0) {
                    //identifiedFeature = 
                    featureCollection.features.forEach(_f => {
                        let fLayer = L.geoJSON(_f).addTo(this.mapProfile.map);
                        fLayer.setStyle(
                            // {
                            //     color: 'white',
                            //     fillColor: 'blue'
                            // }
                            this.mapProfile.highlightLayer[`${_layerId}`].style
                        );
                        this.mapProfile.highlightLayer[`${_layerId}`].cache.push(fLayer);
                    })

                }
                // if (featureCollection.features.length > 0) {
                //     var feature = featureCollection.features[0];
                //     var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);

                //     // Create a popup and attach it to the map
                //     L.popup()
                //         .setLatLng(latlng)
                //         .setContent("This is the feature you selected.")
                //         .openOn(map);

                //     // Optionally zoom to the feature
                //     map.setView(latlng, 14);
                // } else {
                //     console.log("No features found.");
                // }
            });
        },
        showPondContent: function(error, featureCollection){
            let layerId = 14;
            let pane = document.getElementById("pane-content");
            if (error) {
                return;
            }

            this.removeHighlightLayer(layerId);
            pane.innerHTML = "No features identified.";

            // make sure at least one feature was identified.
            if (featureCollection.features.length > 0) {
                console.log(featureCollection);
                
                let identifiedFeature = L.geoJSON(featureCollection.features[0]).addTo(this.mapProfile.map);

                this.mapProfile.highlightLayer[`${layerId}`].cache.push(identifiedFeature);

                let gisProp = featureCollection.features[0].properties;
                let cont = this.getPondContent(gisProp);

                cont += this.getDep1DataContent(gisProp["埤塘名稱"], gisProp["工作站名稱"]);
                cont = `<div class="row">${cont}</div>`;

                //   var soilDescription = "ABC";
                //     //featureCollection.features[0].properties.NAME + " County, " + featureCollection.features[0].properties.STATE_NAME;
                pane.innerHTML = cont;//soilDescription;

            } else {
                pane.innerHTML = "No features identified.";
            }
        }, 
        getPondContent: function (gisProperties) {
            let cont = '';
            Object.keys(gisProperties).forEach(key => {
                //console.log(`Key: ${key}, Value: ${obj[key]}`);
                let value = gisProperties[key];
                cont += `<div class="col-md-6">
                    <label>${key}: </label>
                    <span>${value}</span>
                </div>`
            });

            // if(cont != ''){
            //     cont = `<div class="row">${cont}</div>`;
            // }
            cont += '<hr class="col-md-12">'
            return cont;
        },
        getDep1DataContent: function (pondName, workstation) {
            let cont = '';
            if (pondName != null) {
                let found = Enumerable.from(this.pondProfile.pondInfoList)
                    .where(item => { return item['埤塘名稱'] == pondName && item['工作站'] == workstation; })
                    .toArray();
                console.log('found ponds: ', found);
                if (found.length > 0) {
                    // cont += `<hr class="col-md-12">`;

                    let dataObject = found[0];
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
        pinPond: function(OBJECTID, group){
            console.log(OBJECTID);
            this.highlightPonds(`OBJECTID = ${OBJECTID}`, 14);
            // this.highlightPonds(`OBJECTID = ${OBJECTID}`, 10);
            console.log(group);

            this.mapProfile.layer
                .query()
                .layer(14)
                .where(`OBJECTID = ${OBJECTID}`)
                .run(this.showPondContent);

            //水利小組
            this.highlightPonds(`水利小組名稱 = '${group}'`, 10);
        },
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="container">
            <div class="row my-2">

                <div class="col-md-4">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">工作站</label>
                        <input type="text" class="form-control" v-model="mapProfile.search.association" readonly>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">工作站</label>
                        <select class="form-select" v-model="mapProfile.search.workstation">
                            <option selected value="">不篩選</option>
                            <option v-for="(obj, idx) in workstationList" :value="obj">{{obj}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
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
        <div id="pane-content">
        </div>
        <div id="summary-content-workstation-list" class="row">
            {{this.mapProfile.search.association}} 共{{pondListData.length}} 口埤塘
            <div class="col-md-12 my-2" :class="{'border': mapProfile.search.workstation == obj['工作站'], 'border-danger': mapProfile.search.workstation == obj['工作站']}" v-for="(obj, idx) in workstationGroupListData" :key="obj['工作站']">
                <!--{{obj}}-->
                <label>灌區:</label> 
                <span>{{obj["分類"]}}</span>
                
                <br>
                <label>工作站:</label> 
                <span>{{obj["工作站"]}} <a href="#" @click="mapProfile.search.workstation = obj['工作站']">go</a><span>

                <br>
                <label>埤塘數:</label> 
                <span>{{obj["pondCount"]}}<span>

                <br>
                <label>總有效庫容(立方公尺):</label> 
                <span>{{obj["totalQty"]}}<span>

                <br>
                <label>總目前庫容(立方公尺):</label> 
                <span>{{obj["totalCurrentQty"]}}<span>
                
                <br>
                <label>總目前庫容(%):</label> 
                <span>{{obj["totalCurrentPercentage"]}}<span>
            </div>

        </div>
        <div id="summary-content-pond-list">
            {{this.mapProfile.search.association}} {{this.mapProfile.search.workstation}} {{pondListData.length}} 口埤塘
            <div class="col-md-12" v-for="(obj, idx) in pondListData">
                <!--{{obj}}-->
                <label>埤塘名稱:</label> 
                <span>{{obj["埤塘名稱"]}} <a href="#" @click="pinPond(obj.OBJECTID, obj['水利小組名稱'])">go</a></span>

                <br>
                <label>有效庫容(立方公尺):</label> 
                <span>{{obj["有效庫容(m3)"]}}</span>
                
                <br>
                <label>目前水量(立方公尺):</label> 
                <span>{{obj["Dummy目前容量"]}}</span>

                <br>
                <label>目前庫容(%):</label> 
                <span>{{obj["Dummy目前容量比率"]}}</span>

                <hr class="w-100" v-if="idx != (pondListData.length - 1)">
            </div>

             <!--<div class="col-md-12" v-for="(obj, idx) in workstationList">
                 {{obj}}
             </div>
             -->
        </div>

    
    `
};

