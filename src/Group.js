var Group = Matrix.extend(function Group(){

})
.method('addChild', function addChild(mesh) {
    return this;
})
.method('getChild', function getChild(id) { 
    return null
})
.method('removeChild', function removeChild(id) { 
    return this
})
.build();
