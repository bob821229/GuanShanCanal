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
                }
            },
            pondProfile: {
                hierarchyList: null,
                pondInfoList: null,
                workstationGroupList: null, 
            },
            dataAccess: null
        }
    },
    watch: {
        associationList: function (n, o) {
            if (n != null) {
                this.mapProfile.search.association = n[0];
            }
        }
    },
    computed: {
        workstationGroupListData(){

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
                .select(g => g.key()).toArray();
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
                    path: '/bigboss-water-irrigation-providing'
                },
                (returnList) => {
                    this.pondProfile.pondInfoList = returnList;
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

            let where = `管理處名稱 = '${this.mapProfile.search.association}'`;
            console.log(where);
            this.mapProfile.layer = L.esri
                .dynamicMapLayer({
                    url: url,
                    opacity: 0.7,
                    layers: [10, 11, 13, 14, 15], //[3, 59]//[65, 64, 63]
                    layerDefs: {
                        //10: where, 
                        11: where, 
                        13: where, 
                        14: where, 
                        15: where, 
                        
                    }
                    // layerDefs: { 
                    //   3: "IA_CNS='雲林'", 
                    //   6: "COUNTYNAME='雲林縣'" }, 
                    // //and Mng_cns = '西螺分處'
                })
                .addTo(this.mapProfile.map);

            this.mapProfile.layer
                .query()
                .layer(14)
                .where(where)
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

            this.mapProfile.layer.bindPopup(function (err, featureCollection, response) {
                console.log('dynamicMapLayer.bindPopup');
                featureCollection.features.forEach(f => {
                    //console.log(f);
                });
                var count = featureCollection.features.length;
                return (count) ? count + ' features' : false;
            });
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
                    </div>
                </div>
                
            </div>
        </div>

        <div id="map">
        </div>
    
    `
};

