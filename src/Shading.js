var Shading = MoGL.extend('Shading', {
    description:'Shading',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.phong;"
    ],
    value:function Shading() {}
})
.constant('none', {
    description:'none constant',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.none;"
    ],
    value:'none'
})
.constant('gouraud', {
    description:'gouraud constant',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.gouraud;"
    ],
    value:'gouraud'
})
.constant('phong', {
    description:'phong constant',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.phong;"
    ],
    value:'phong'
})
.constant('blinn', {
    description:'blinn constant',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.blinn;"
    ],
    value:'blinn'
})
.constant('flat', {
    description:'flat constant',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.flat;"
    ],
    value:'flat'
})
.constant('toon', {
    description:'toon',
    sample:[
        "var material = new Material('#fff');",
        "material.shading = Shading.toon;"
    ],
    value:'toon'
})
.build();
