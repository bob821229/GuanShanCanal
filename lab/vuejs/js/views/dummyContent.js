
export default {
    components: {
        
    },
    inject: ['currentComponent'],
    data() {
        return {
            sampleList: [
                {
                    name: 'Product', 
                    category: 'BTW', 
                    completeness: 50, 
                    url: `/vuejs/product.html`, 
                    componentName: 'product', 
                },
                {
                    name: '農田水利財團法人專區',
                    category: 'Triwra',
                    completeness: 50, 
                    url: `/vuejs/triwra-org-docs.html`, 
                },
                {
                    name: 'Login', 
                    category: 'General', 
                    completeness: 50, 
                    url: `/vuejs/login.html`, 
                    //componentName: 'product', 
                }, 
            ]
        }
    },
    methods: {
        switchComponent: function(d){
            alert(d);
            this.currentComponent = d;
        }
    }, 
    template: `
        <div class="container">
            <h1 class="mt-5">Sticky footer with fixed navbar</h1>
            <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
            <p>Back to <a href="/docs/5.3/examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>

            <div class="row">
                <div class="col-sm-12 col-md-4">
                    <Card>
                        <template #title>Product</template>
                        <template #content>
                            <p class="m-0">
                                Products
                            </p>
                        </template>
                    </Card>
                </div>
            </div>   
            <div class="row">
                <div class="col-md-12">
                    <DataTable :value="sampleList" tableStyle="min-width: 50rem">
                        <Column field="name" header="名稱"></Column>
                        <Column field="category" header="分類"></Column>
                        <Column header="完成度" class="text-center" header-class="text-center">
                            <template #body="slotProps">
                                {{slotProps.data.completeness}}%
                            </template>
                        </Column>
                        <Column header="Entrance">
                            <template #body="slotProps">
                                <a :href="slotProps.data.url"><i class="fa-solid fa-link"></i></a>
                                <a v-if="slotProps.data.componentName != null" @click="switchComponent(slotProps.data.componentName)"><i class="fa-solid fa-link text-danger"></i></a>
                            </template>
                        </Column>
                    </DataTable>        
                </div>
            </div>  
        </div>
    
    `
};

