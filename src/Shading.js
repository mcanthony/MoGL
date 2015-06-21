var Shading = (function(){
    'use strict';
    var Shading = {}, key = 'none,gouraud,phong,blinn,flat,toon'.split(','), i = key.length;
    while (i--) Shading[key[i]] = key[i];
    Object.freeze(Shading);
    return Shading;
})();
