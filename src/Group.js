var Group = Matrix.extend('Group', {
    description:[
        "개발중"
    ],
    value:function Group() {}
})
.method('addChild', {
    description:"개발중..",
    value:function addChild(mesh) {
        return this;
    }
})
.method('getChild', {
    description:"개발중..",
    value:function getChild(id) {
        return null;
    }
})
.method('removeChild', {
    description:"개발중..",
    value:function removeChild(id) {
        return this;
    }
})
.build();