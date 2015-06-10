var Group = Matrix.extend(function Group(){
  this._Children = {};
})
.method('addChild', function addChild(id, mesh) { 
    var k, checks;
    if (this._children[id]) this.error(0);
    if (!(mesh instanceof Mesh )) this.error(1);
    mesh._scene = this,
    mesh.setGeometry(mesh._geometry),
    mesh.setMaterial(mesh._material),
    checks = mesh._geometry._vertexShaders;
    for (k in checks)
        if (typeof checks[k] == 'string')
            if (!this._scene._vertexShaders[checks[k]]) this.error(2);
    checks = mesh._material._fragmentShaders;
    for (k in checks)
        if (typeof checks[k] == 'string')
            if (!this._scene._fragmentShaders[checks[k]]) this.error(3);
    checks = mesh._material._textures;
    for (k in checks)
        if (typeof checks[k] == 'string')
            if (!this._scene._textures[checks[k]]) this.error(4);
    this._children[id] = mesh;
    return this;
})
.method('getChild', function getChild(id) { 
    var t = this._children[id];
    return t ? t : null;
})
.method('removeChild', function removeChild(id) { 
    return this._children[id] ? (delete this._children[id], true) : false;
})
.build();