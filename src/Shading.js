var Shading = MoGL.extend('Shading', {
    description:'Shading',
    value:function Shading() {}
})
.constant('none', {
    description:'none constant',
    value:'none'
})
.constant('gouraud', {
    description:'gouraud constant',
    value:'gouraud'
})
.constant('phong', {
    description:'phong constant',
    value:'phong'
})
.constant('blinn', {
    description:'blinn constant',
    value:'blinn'
})
.constant('flat', {
    description:'flat constant',
    value:'flat'
})
.constant('toon', {
    description:'toon',
    value:'toon'
})
.build();
