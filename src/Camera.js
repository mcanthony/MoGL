var Camera = (function () {
    'use strict';
	var PERPIR, prop;
	//lib
	PERPIR = D2R * .5,
	//private
	prop = {},
	//shared private
	$setPrivate('Camera', {});
	return Matrix.extend('Camera',{
		description: "씬을 실제로 렌더링할 카메라 객체를 생성함",
		sample: [
			"var camera = new Camera();"
		],
		value : function Camera() {
			Object.seal(prop[this] = {
				r: 0, g: 0, b: 0, a: 1,
				fov: 55, near: 0.1, far: 10000,
				fog: false, fogColor: null, fogNear: 0, fogFar: 0,
				visible: true,
				antialias: false,
				mode: Camera.perspective,
				//filters:{},
				renderArea: null,
				projectionMatrix: Matrix()
			}),
			this.z = 10,
			this.lookAt(0, 0, 0);
		}
	})
	.field('clipPlaneNear', {
		description: "현재 절두체의 최소z값",
		sample: [
			'var camera = new Camera();',
			'camera.clipPlaneNear = 10;'
		],
		defaultValue:"0.1",
		get: $getter(prop, 'near'),
		set: $setter(prop, 'near')
	})
	.field('clipPlaneFar', {
		description: "현재 절두체의 최대z값",
		sample: [
			'var camera = new Camera();',
			'camera.clipPlaneFar = 1000;'
		],
		defaultValue:"10000",
		get: $getter(prop, 'far'),
		set: $setter(prop, 'far')
	})
	.field('visible', {
		get: $getter(prop, 'visible'),
        sample:[
            "var camera = Camera();",
            "camera.visible = false;"
        ],
		set: function visibleSet(v) {
			if (typeof v == 'number') {
				v = v ? true : false
			}
			prop[this].visible = v
		}
	})
	.field('antialias', {
		description: "쉐이더 레벨의 안티알리어싱 적용여부",
		sample: [
			'var camera = new Camera();',
			'camera.antialias = true;'
		],
		defaultValue:"false",
		get: $getter(prop, 'antialias'),
		set: function antialiasSet(v) {
			if (typeof v == 'number') {
				v = v ? true : false
			}
			prop[this].antialias = v
		}
	})
	.field('fogColor', {
		description: "안개 효과 컬러 지정",
		sample: [
			'var camera = new Camera();',
			'camera.fogColor = [Math.random(),Math.random(),Math.random(),1];'
		],
		defaultValue:'null',
		get: $getter(prop, 'fogColor'),
		set: function fogColorSet(v) {
			var p = prop[this];
			p.fogColor = $color(v).slice(0),
				p.fog = true;
		}
	})
	.field('fogNear', {
		description: "안개효과가 시작되는 z축 거리",
		sample: [
			'var camera = new Camera();',
			'camera.fogNear = 10;'
		],
		defaultValue:'0',
		get: $getter(prop, 'fogNear'),
		set: function fogNearSet(v) {
			var p = prop[this];
			p.fogNear = v,
				p.fog = true;
		}
	})
	.field('fogFar', {
		description: "안개효과만 남고 아무것도 보이지 않는  z축 거리",
		sample: [
			'var camera = new Camera();',
			'camera.fogFar = 1000;'
		],
		defaultValue:'0',
		get: $getter(prop, 'fogFar'),
		set: function fogFarSet(v) {
			var p = prop[this];
			p.fogFar = v,
				p.fog = true;
		}
	})
	.field('fov', {
		description: "FOV(Field of view) 시야각을 정의.",
		sample: [
			'var camera = new Camera();',
			"// number형으로 입력",
			'camera.fov = 45;', // 시야각입력을 통한 fov계산
			"// [width,height,angle] - 화면사이즈와 각도의 직접적 입력을 통한 fov 지정도 가능" ,
			'camera.fov = [width,height,angle];' // 화면사이즈와 각도의 직접적 입력을 통한 fov 지정
		],
		defaultValue:'55',
		get: $getter(prop, 'fov'),
		set: function fovSet(v) {
			var p = prop[this];
			if (typeof v == 'number') {
				p.fov = v;
			} else if ('0' in v && '1' in v) {
				p.fov = CEIL(2 * ATAN(TAN(v[2] * PERPIR) * (v[1] / v[0])) * R2D);
			}
		}
	})
	.field('backgroundColor', {
		description: "렌더링 배경화면 색상을 지정",
		sample: [
			'var camera = new Camera();',
			"// [r,g,b,a] number형으로 입력",
			'camera.backgroundColor = [Math.random(),Math.random(),Math.random(),1];'
		],
		defaultValue:'{r: 0, g: 0, b: 0, a: 1}}',
		get: (function () {
			var a = [];
			return function backgroundColorGet() {
				var p = prop[this];
				a[0] = p.r, a[1] = p.g, a[2] = p.b, a[3] = p.a
				return a;
			};
		})(),
		set: function backgroundColorSet(v) {
			var p = prop[this];
			v = $color(v);
			p.r = v[0], p.g = v[1], p.b = v[2], p.a = v[3];
		}
	})
	.field('fog', {
		description: "안개효과 지정여부" ,
		sample: [
			'var camera = new Camera();',
			'// true or false - false로 지정시 안개효과 삭제' ,
			'camera.fog = true;'
		],
		defaultValue:'false',
		get: function fogGet() {
			return prop[this].fog ? true : false;
		}
	})
	.field('mode', {
		description:"카메라모드 지정",
		sample: [
			'var camera = new Camera();',
			"// Camera.perspective or Camera.othogonal",
			'camera.mode = Camera.perspective;',
			'camera.mode = Camera.othogonal;'
		],
		defaultValue:'Camera.perspective',
		get: $getter(prop, 'mode'),
		set: function modeSet(v) {
			if (Camera[v]) {
				prop[this].mode = v;
			} else {
				this.error(0);
			}
		}
	})
	.field('renderArea', {
		description: "카메라 렌더링 영역지정, 렌더링 영역을 지정하지 않을경우 캔버스 영역 전체로 자동 지정됨.",
		sample: [
			'var camera = new Camera();',
			"// [x,y, width, height] - number형으로 입력, %단위도 입력가능",
			'camera.renderArea = [10,100,200,300];',
			'camera.renderArea = ["10%","10%",200,300];',
		],
		defaultValue:'null',
		get: $getter(prop, 'renderArea'),
		set: function renderAreaSet(v) {
			prop[this].renderArea = v
		}
	})
	.field('projectionMatrix', {
		description: "현재 프로젝션 매트릭스를 반환",
		get: function projectionMatrixGet() {
			return prop[this].projectionMatrix
		}
	})
	.method('resetProjectionMatrix', {
			description: "현재 프로퍼티들을 기준으로 프로젝션 매트릭스를 갱신",
			value: function resetProjectionMatrix() {
				var tMatrix, tArea, p;
				p = prop[this]
				tMatrix = p.projectionMatrix,
					tArea = p.renderArea,
					tMatrix.matIdentity()
				if (this._mode == '2d') {
					tMatrix.raw[0] = 2 / tArea[2]
					tMatrix.raw[5] = -2 / tArea[3]
					tMatrix.raw[10] = 0
					tMatrix.raw[12] = -1
					tMatrix.raw[13] = 1
				} else {
					tMatrix.matPerspective(p.fov, tArea[2] / tArea[3], p.near, p.far);
				}
				return this;
			}
		}
	)
	.constant('resize', 'resize')
	.constant('othogonal', 'othogonal')
	.constant('perspective', 'perspective')
	.build();
	/*마일스톤0.5
	 fn.getFilters = function getFilters(){
	 var result = [],t = this._filters;
	 for(var k in t) result.push(k);
	 return result;
	 },
	 fn.setFilter = function setFilter(filter,needIe){
	 var result;
	 if(arguments[1]) result = arguments[1];
	 else {
	 switch (filter) {
	 case Filter.anaglyph :
	 result = {
	 offsetL: 0.008,
	 offsetR: 0.008,
	 gIntensity: 0.7,
	 bIntensity: 0.7
	 };
	 break;
	 case Filter.bevel :
	 result = {
	 distance: 4.0,
	 angle: 45,
	 highlightColor: '#FFF',
	 highlightAlpha: 1.0,
	 shadowColor: '#000',
	 shadowAlpha: 1.0,
	 blurX: 4.0,
	 blurY: 4.0,
	 strength: 1,
	 quality: 1,
	 type: "inner",
	 knockout: false
	 };
	 break;
	 case Filter.bloom :
	 result = {
	 threshold: 0.3,
	 sourceSaturation: 1.0,
	 bloomSaturation: 1.3,
	 sourceIntensity: 1.0,
	 bloomIntensity: 1.0
	 };
	 break;
	 case Filter.blur :
	 result = {
	 blurX: 4.0,
	 blurY: 4.0,
	 quality: 1
	 };
	 break;
	 case Filter.colorMatrix :
	 result = {};
	 break;
	 case Filter.convolution :
	 result = {
	 matrixX: 0,
	 matrixY: 0,
	 matrix: null,
	 divisor: 1.0,
	 bias: 0.0,
	 preserveAlpha: true,
	 clamp: true,
	 color: 0,
	 alpha: 0.0
	 };
	 break;
	 case Filter.displacementMap :
	 result = {
	 mapTextureID: null,
	 mapPoint: null,
	 componentX: 0,
	 componentY: 0,
	 scaleX: 0.0,
	 scaleY: 0.0,
	 mode: "wrap",
	 color: 0,
	 alpha: 0.0
	 };
	 break;
	 case Filter.fxaa :
	 result = {};
	 break;
	 case Filter.glow :
	 result = {
	 color: '#F00',
	 alpha: 1.0,
	 blurX: 6.0,
	 blurY: 6.0,
	 strength: 2,
	 quality: 1,
	 inner: false,
	 knockout: false
	 };
	 break;
	 case Filter.invert :
	 result = {};
	 break;
	 case Filter.mono :
	 result = {};
	 break;
	 case Filter.sepia :
	 result = {};
	 break;
	 case Filter.shadow :
	 result = {
	 distance: 4.0,
	 angle: 45,
	 color: 0,
	 alpha: 1.0,
	 blurX: 4.0,
	 blurY: 4.0,
	 strength: 1.0,
	 quality: 1,
	 inner: false,
	 knockout: false,
	 hideObject: false
	 };
	 break;
	 }
	 }
	 this._filters[filter] = result;
	 return this;
	 },
	 fn.removeFilter = function removeFilter(filter){
	 delete this._filters[filter];
	 return this;
	 },
	 */
})();

