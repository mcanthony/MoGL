var Texture = (function() {
    'use strict';
    var imgType, canvas, context, empty, resizer,
        resize, imgs, loaded, isLoaded;
    //private
    resize = {},
    imgs = {},
    isLoaded = {},
    //shared private
    $setPrivate('Texture', {
        isLoaded : isLoaded,
        imgs:imgs
    }),
    //lib
    imgType = {'.jpg':1, '.png':1, '.gif':1},
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    canvas.width = canvas.height = 2,
    context.clearRect(0, 0, 2, 2),
    empty = document.createElement('img'),
    empty.src = canvas.toDataURL(),
    resizer = function(resizeType, v) {
        var tw, th;
        tw = th = 1;
        while (v.width > tw) tw *= 2;
        while (v.height > th) th *= 2;
        if (resizeType == Texture.zoomOut) {
            if (v.width < tw) tw /= 2;
            if (v.height < th) th /= 2;
        }
        canvas.width = tw,
        canvas.height = th,
        context.clearRect(0, 0, tw, th);
        switch (resizeType) {
		case Texture.crop:
			var ratio = v.height / v.width
			if (v.height < th) {
				v.height = th
				v.width = v.height / ratio
			}
			context.drawImage(v, 0, 0, v.width, v.height);
			break;
		case Texture.addSpace:
			if (v.width < tw) tw = Math.round(v.width);
			if (v.height < th) th = Math.round(v.height);
			context.drawImage(v, 0, 0, tw, th);
			break;
		default:
			context.drawImage(v, 0, 0, tw, th);
        }
        v.src = canvas.toDataURL();
        return v;
    },
    loaded = function(e) {
        var texture = Texture.getInstance(this.dataset.texture);
        isLoaded[texture] = true,
        imgs[texture] = resizer(texture.resizeType, this),
        this.removeEventListener('load', loaded),
        texture.dispatch('load');
    };
    return MoGL.extend('Texture',{
        description: "텍스쳐 객체 클래스",
        sample: [
            "var texture0 = new Texture();",
			"var texture1 = new Texture(document.getElementById('txt1'));"
        ],
        exception:[
            "'Texture:0' - 이미지가 인자로 오지 않은 경우",
            "'Texture:1' - 적절한 이미지객체가 아닌 경우",
            "'Texture:2' - 이미지데이터형식이 잘못된 경우"
        ],
		param:[
		    "img:* - texture.img를 초기화할 수 있는 이미지",
			"resizeType:string - 이미지의 리사이즈타입"
		],
        value:function Texture(v, t) {
            var complete, img, w, h;
			if (!v) this.error(0);
            if (t) resize[this] = t;

            complete= false,
            img = document.createElement('img');
            if (v instanceof HTMLImageElement) {
                img.src = v.src
                if (img.complete) {
                    complete = true;
                }
            } else if (v instanceof ImageData) {
                complete = true,
                canvas.width = w = v.width,
                canvas.height = h = v.height,
                context.clearRect(0, 0, w, h),
                context.putImageData(v, 0, 0),
                img.src = context.toDataURL();
            } else if (typeof v == 'string') {
                if (v.substring(0, 10) == 'data:image' && v.indexOf('base64') > -1){
                    complete = true;
                } else if (!imgType[v.substring(-4)]) {
                    this.error(2);
                }
                img.src = v;
            } else {
                this.error(1);
            }
            if (complete) {
                isLoaded[this] = true,
                img.dataset.texture = this.uuid,
                imgs[this] = resizer(this.resizeType, img),
                this.dispatch('load');
            } else {
                img.dataset.texture = this.uuid,
                img.addEventListener('load', loaded);
            }
        }
    })
    .field('resizeType', {
        description:'resize type get/set field.',
        type:'string',
        defaultValue:'null',
        sample: [
            "var texture = new Texture(img, Texture.zoomIn);",
            "console.log(texture.resizeType);"
        ],
        get:$getter(resize, false, 'zoomOut')
    })
    .field('isLoaded', {
        description:'Load check field.',
        type:'string',
        defaultValue:'null',
        sample: [
            'var texture = new Texture(document.getElementById("imgElement"));',
            "console.log(texture.isLoaded);"
        ],
        get:$getter(isLoaded, false, false)
    })
    .field('img', {
        description:'Image get/set field.',
        type:'string',
        defaultValue:'null',
        sample: [
            'var texture = new Texture(document.getElementById("imgElement"));',
            'var img = texture.img;'
        ],
        get:$getter(imgs, false, empty)
    })
    .event('load', {
        description:[
            'Texture에 img지정된 이미지가 로딩완료시 발생함. 이미 로딩이 완료된 이미지인 경우는 img지정시 즉시 발생함.',
            '* 리스너에게는 아무런 인자도 전달되지 않음'
        ],
        sample:[
            'var tex = new Texture();',
            'tex.addEventListener(Texture.load, function(){',
            '    //로딩완료!',
            '});',
            'tex.img = document.getElementById("img1");'
        ],
        value:'load'
    })
    .constant('zoomOut', {
        description:'texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 수에 축소하여 맞춤',
        sample:[
            'var texture = new Texture(img, Texture.zoomOut);',
            '//2000 → 1024'
        ],
        value:'zoomOut'
    })
    .constant('zoomIn', {
        description:'texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 수에 확대하여 맞춤',
        sample:[
            'var texture = new Texture(img, Texture.zoomIn);',
            '//2000 → 2048'
        ],
        value:'zoomIn'
    })
    .constant('crop', {
        description:'texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 작은 수에 맞춰 자름',
        sample:[
            'var texture = new Texture(img, Texture.crop);',
            '//2000 → 1024로 좌상단기준으로 잘림'
        ],
        value:'crop'
    })
    .constant('addSpace', {
        description:'texture.img에 지정될 이미지가 2의 승수의 크기가 아닌 경우 근접한 큰 수에 맞춰 공백을 넣음',
        sample:[
            'var texture = new Texture(img, Texture.addSpace);',
            '//2000 → 2048로 우하단이 공백으로 늘어남'
        ],
        value:'addSpace'
    })
    .constant('diffuse', {
        description:[
            '일반적으로 표면에 입혀지는 텍스쳐를 의미함',
            'Material의 addTexture에서 diffuse타입으로 Texture를 등록할 때 사용'
        ],
        sample:[
            'var texture = new Texture();',
            'var material = new Material("#fff");',
            'material.addTexture(Texture.diffuse, texture);'
        ],
        value:'diffuse'
    })
    .constant('specular', {
        description:[
            '표면에서 빛에 직접적으로 반사되는 면을 표현하는 텍스쳐',
            'Material의 addTexture에서 specular타입으로 Texture를 등록할 때 사용'
        ],
        sample:[
            'var texture = new Texture();',
            'var material = new Material("#fff");',
            'material.addTexture(Texture.specular, texture);'
        ],
        value:'specular'
    })
    .constant('diffuseWrap', {
        description:[
            '빛에 의한 음영을 표현할 때 음영에 해당되는 색상을 직접 이미지에서 지정하는 텍스쳐',
            'Material의 addTexture에서 diffuseWrap타입으로 Texture를 등록할 때 사용'
        ],
        sample:[
            'var texture = new Texture();',
            'var material = new Material("#fff");',
            'material.addTexture(Texture.diffuseWrap, texture);'
        ],
        value:'diffuseWrap'
    })
    .constant('normal', {
        description:[
            '표면의 울퉁불퉁한 부분을 표현하기 위해 사용하는 텍스쳐',
            'Material의 addTexture에서 normal타입으로 Texture를 등록할 때 사용'
        ],
        sample:[
            'var texture = new Texture();',
            'var material = new Material("#fff");',
            'material.addTexture(Texture.normal, texture);'
        ],
        value:'normal'
    })
    .constant('specularNormal', {
        description:[
            'diffuse에 대해 normal이 있듯이 specular도 울퉁불퉁한 면을 표현하려는 경우 사용',
            'Material의 addTexture에서 specularNormal타입으로 Texture를 등록할 때 사용'
        ],
        sample:[
            'var texture = new Texture();',
            'var material = new Material("#fff");',
            'material.addTexture(Texture.specularNormal, texture);'
        ],
        value:'specularNormal'
    })
    .build();
})();