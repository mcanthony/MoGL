var Texture = (function() {
    var imgType, canvas, context, empty, resizer,
        resize, imgs, loaded, isLoaded;
    //private
    resize = {},
    imgs = {},
    isLoaded = {},
    //shared private
    $setPrivate('Texture', {
        imgs : imgs
    }),
    //lib
    imgType = {'.jpg':1, '.png':1, '.gif':1},
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    canvas.width = canvas.height = 2,
    context.clearRect(0, 0, 2, 2),
    empty = document.createElement('img'),
    empty.src = canvas.toDataURL(),
    resizer = function(resizeType, v){
        var tw, th, dw, dh;
        //texture size
        tw = th = 1;
        while (v.width > tw) tw *= 2;
        while (v.height > th) th *= 2;
        //fit size
        if (v.width == tw && v.height == th) {}

        if (resizeType == Texture.zoomOut) {
            if (v.width < tw) tw /= 2;
            if (v.height < th) th /= 2;
        }
        canvas.width = dw = tw,
        canvas.height = dh = th,
        context.clearRect(0, 0, tw, th);
        switch(resizeType){
            case Texture.crop:
                if (v.width < tw) dw = tw / 2;
                if (v.height < th) dh = th / 2;
                context.drawImage(v, 0, 0, tw, th, 0, 0, dw, dh);
                break;
            case Texture.addSpace:
                context.drawImage(v, 0, 0, tw, th, 0, 0, tw, th);
                break;
            default:
                context.drawImage(v, 0, 0, dw, dh);
        }
        v.src = canvas.toDataURL();
        //console.log('리사이저처리결과', v.src,dw,dh)
        return v;
    },
    loaded = function(e){
        var texture = Texture.getInstance(this.dataset.texture);
        isLoaded[texture] = true,
        imgs[texture] = resizer(texture.resizeType, this),
        this.removeEventListener('load', loaded);
        texture.dispatch('load');
    };
    return MoGL.extend(function Texture(){})
    .field('resizeType', {
        description:'resize type get/set field.',
        type:'string',
        defaultValue:'null',
        sample: [""],
        get:$getter(resize, false, 'zoomOut'),
        set:function resizeTypeSet(v){
            if (Texture[v]) {
                resize[this] = v;
            } else {
                this.error(0);
            }
        }
    })
    .field('isLoaded', {
        description:'Load check field.',
        type:'string',
        defaultValue:'null',
        sample: [""],
        get:$getter(isLoaded, false, false)
    })
    .field('img', {
        description:'Image get/set field.',
        type:'string',
        defaultValue:'null',
        sample: [""],
        get:$getter(imgs, false, empty),
        set:function imgSet(v){
            var complete, img, w, h;
            complete= false,
            img = v;
            if (v instanceof HTMLImageElement){
                if (v.complete) {
                    complete = true;
                }
            } else if (v instanceof ImageData){
                complete = true,
                canvas.width = w = v.width,
                canvas.height = h = v.height,
                context.clearRect(0, 0, w, h),
                context.putImageData(v, 0, 0),
                img = document.createElement('img'),
                img.src = context.toDataURL();
            } else if (typeof v == 'string') {
                if (v.substring(0, 10) == 'data:image' && v.indexOf('base64') > -1){
                    complete = true;
                } else if (!imgType[v.substring(-4)]) {
                    this.error(1);
                }
                img = document.createElement('img'),
                img.src = v;
            } else {
                this.error(0);
            }
            if (complete){
                isLoaded[this] = true,
                //console.log('이미지등록시 로딩완료',img)
                img.dataset.cls = Texture
                img.dataset.texture = this.uuid;
                imgs[this] = resizer(this.resizeType, img),
                this.dispatch('load');
            } else {
                //console.log('이미지등록시 로딩안됨',img)
                img.dataset.cls = Texture
                img.dataset.texture = this.uuid;
                img.addEventListener('load', loaded);
            }
        }
    })
    .event('load', {
        description: 'load event',
        value: 'load'
    })
    .constant('zoomOut', {
        description : 'zoom out constant',
        value : 'zoomOut'
    })
    .constant('zoomIn', {
        description : 'zoom in constant',
        value : 'zoomIn'
    })
    .constant('crop', {
        description : 'crop constant',
        value : 'crop'
    })
    .constant('addSpace',{
        description : 'addSpace constant',
        value : 'addSpace'
    })
    .constant('diffuse', {
        description : 'diffuse constant',
        value : 'diffuse'
    })
    .constant('specular', {
        description : 'specular constant',
        value : 'specular'
    })
    .constant('diffuseWrap', {
        description : 'diffuseWrap constant',
        value : 'diffuseWrap'
    })
    .constant('normal', {
        description : 'normal constant',
        value : 'normal'
    })
    .constant('specularNormal', {
        description : 'specularNormal constant',
        value : 'specularNormal'
    })
    .build();
})();
