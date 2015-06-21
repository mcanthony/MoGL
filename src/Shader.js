var Shader = (function () {
    'use strict';
	var code;
	//private
	code = {},
	$setPrivate('Shader', {});
	return MoGL.extend('Shader', {
			description: "쉐이더 클래스. 버텍스쉐이더와 프레그먼트 쉐이더를 생성.",
			param : [
				"1. v:Object - 오브젝트 형태로 쉐이더 정보를 입력",
				"2. 버텍스쉐이더 - { id:'', attributes:[], uniforms:[], varyings[], function:[], main[]",
				"3. 프레그먼트쉐이더 - { id:'', uniforms:[], varyings[], function:[], main[]"
			],
			value: function Shader(v) {
				code[this] = v;
			}
		}
	)
	.field('code', {
			description : '쉐이더 구성정보 코드(JS)를 반환',
			get: $getter(code)
		}
	)
	.constant('colorVertexShader', {
		description: "컬러 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorVertexShader',
						attributes: ['vec3 aVertexPosition'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition', 'vec4 uColor'],
						varyings: ['vec4 vColor'],
						function: [VertexShader.baseFunction],
						main: [
							'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale)*vec4(aVertexPosition, 1.0);\n' +
							'vColor = uColor;'
						]
					}))
			}
		})()
	})
	.constant('colorFragmentShader', {
		description: "컬러 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorFragmentShader',
						precision: 'mediump float',
						uniforms: [],
						varyings: ['vec4 vColor'],
						function: [],
						main: [
							'gl_FragColor =  vColor'
						]
					}))
			}
		})()
	})
	.constant('wireFrameVertexShader', {
		description: "와이어프레임 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'wireFrameVertexShader',
						attributes: ['vec3 aVertexPosition'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition', 'vec4 uColor'],
						varyings: ['vec4 vColor'],
						function: [VertexShader.baseFunction],
						main: [
							'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale)*vec4(aVertexPosition, 1.0);\n' +
							'vColor = uColor ;'
						]
					}))
			}
		})()
	})
	.constant('wireFrameFragmentShader', {
		description: "와이어프레임 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'wireFrameFragmentShader',
						precision: 'mediump float',
						uniforms: [],
						varyings: ['vec4 vColor'],
						function: [],
						main: [
							'gl_FragColor =  vColor;'
						]
					}))
			}
		})()
	})
	.constant('bitmapVertexShader', {
		description: "비트맵 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapVertexShader',
						attributes: ['vec3 aVertexPosition', 'vec2 aUV'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition'],
						varyings: ['vec2 vUV'],
						function: [VertexShader.baseFunction],
						main: [
							'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale)*vec4(aVertexPosition, 1.0);\n' +
							'vUV = aUV;'
						]
					}))
			}
		})()
	})
	.constant('bitmapFragmentShader', {
		description: "비트맵 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapFragmentShader',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler'],
						varyings: ['vec2 vUV'],
						function: [],
						main: [
							'gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t))'
						]
					}))
			}
		})()
	})
	.constant('colorVertexShaderGouraud', {
		description: "컬러 고라우드 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorVertexShaderGouraud',
						attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition', 'vec4 uColor'],
						varyings: ['vec4 vColor'],
						function: [VertexShader.baseFunction],
						main: [
							' mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
							' gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
							' vec3 N = (mv * vec4(aVertexNormal, 0.0)).xyz;\n' +
							' vec3 LD = normalize(vec4(uDLite, 0.0)).xyz;\n' +
							' float df = max(0.1,dot(N,-LD)*uLambert);\n' +
							' vColor = uColor*df;' +
							' vColor[3] = uColor[3];'
						]
					}))
			}
		})()
	})
	.constant('colorFragmentShaderGouraud', {
		description: "컬러 고라우드 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorFragmentShaderGouraud',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler'],
						varyings: ['vec4 vColor'],
						function: [],
						main: [
							'gl_FragColor =  vColor;\n'
						]
					}))
			}
		})()
	})
	.constant('bitmapVertexShaderGouraud', {
		description: "비트맵 고라우드 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapVertexShaderGouraud',
						attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition'],
						varyings: ['vec2 vUV', 'vec4 vLight'],
						function: [VertexShader.baseFunction],
						main: [
							' mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
							' gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
							' vec3 N = (mv * vec4(aVertexNormal, 0.0)).xyz;\n' +
							' vec3 LD = normalize(vec4(uDLite, 0.0)).xyz;\n' +
							' float df = max(0.1,dot(N,-LD)*uLambert);\n' +
							' vLight = vec4(1.0,1.0,1.0,1.0)*df;\n' +
							' vLight[3] = 1.0;\n' +
							' vUV = aUV;'
						]
					}))
			}
		})()
	})
	.constant('bitmapFragmentShaderGouraud', {
		description: "비트맵 고라우드 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapFragmentShaderGouraud',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler'],
						varyings: ['vec2 vUV', 'vec4 vLight'],
						function: [],
						main: [
							'gl_FragColor =  (vLight*texture2D(uSampler, vec2(vUV.s, vUV.t)));\n' +
							'gl_FragColor.a = 1.0;'
						]
					}))
			}
		})()
	})
	.constant('colorVertexShaderPhong', {
		description: "컬러 퐁 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorVertexShaderPhong',
						attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition', 'vec4 uColor'],
						varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
						function: [VertexShader.baseFunction],
						main: ['' +
						'mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
						'gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
						'vPosition = vec3(mv * vec4(aVertexPosition, 1.0));\n' +
						'vNormal = vec3(mv * vec4(-aVertexNormal, 0.0));\n' +
						'vColor = uColor;'
						]
					}))
			}
		})()
	})
	.constant('colorFragmentShaderPhong', {
		description: "컬러 퐁 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'colorFragmentShaderPhong',
						precision: 'mediump float',
						uniforms: ['float uLambert', 'vec3 uDLite'],
						varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
						function: [],
						main: [
							'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
							'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
							'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +

							'vec3 normal = normalize(vNormal);\n' +
							'vec3 lightDir = uDLite;\n' +
							'vec3 reflectDir = reflect(lightDir, normal);\n' +
							'vec3 viewDir = normalize(-vPosition);\n' +

							'float lambertian = max(dot(lightDir,normal), 0.1)*uLambert;\n' +
							'float specular = 0.0;\n' +

							'if(lambertian > 0.0) {\n' +
							'float specAngle = max(dot(reflectDir, viewDir), 0.0);\n' +
							'   specular = pow(specAngle, 4.0);\n' +
							'}\n' +
							'gl_FragColor = vColor*vec4(ambientColor +lambertian*diffuseColor +specular*specColor, 1.0);\n' +
							'gl_FragColor.a = vColor[3];'
						]
					}))
			}
		})()
	})
	.constant('toonVertexShaderPhong', {
		description: "툰 퐁 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'toonVertexShaderPhong',
						attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition', 'vec4 uColor'],
						varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
						function: [VertexShader.baseFunction],
						main: [
							'mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
							'gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
							'vPosition = vec3(mv * vec4(aVertexPosition, 1.0));\n' +
							'vNormal = (vec3( mv * vec4(-aVertexNormal, 0.0)));\n' +

							'vColor = uColor;'
						]
					}))
			}
		})()
	})
	.constant('toonFragmentShaderPhong', {
		description: "툰 퐁 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'toonFragmentShaderPhong',
						precision: 'mediump float',
						uniforms: ['float uLambert', 'vec3 uDLite'],
						varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
						function: [],
						main: [
							'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
							'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
							'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +

							'vec3 normal = normalize(vNormal);\n' +
							'vec3 lightDir = uDLite;\n' +
							'vec3 reflectDir = reflect(lightDir, normal);\n' +
							'vec3 viewDir = normalize(-vPosition);\n' +

							'float lambertian = max(dot(lightDir,normal), 0.1)*uLambert;\n' +
							'float specular = 0.0;\n' +

							'vec3 src = vColor.rgb;\n' +

							'if(lambertian > 0.0) {\n' +
							'float specAngle = max(dot(reflectDir, viewDir), 0.0);\n' +
							'   specular = pow(specAngle, 4.0);\n' +
							'}\n' +
							'src = src*(ambientColor +lambertian*diffuseColor +specular*specColor);\n' +

							' if(lambertian>0.95-0.5) src.rgb*=0.95;\n' +
							' else if(lambertian>0.4-0.5) src.rgb*=0.5;\n' +
							' else if(lambertian>0.3-0.5) src.rgb*=0.3;\n' +
							' else src.rgb*=0.1;\n' +

							'gl_FragColor.rgb = src.rgb;\n' +
							'gl_FragColor.a = vColor[3];'
						]
					}))
			}
		})()
	})
	.constant('bitmapVertexShaderPhong', {
		description: "비트맵 퐁 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapVertexShaderPhong',
						attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition'],
						varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
						function: [VertexShader.baseFunction],
						main: [
							'mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
							'gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
							'vPosition = vec3(mv * vec4(aVertexPosition, 1.0));\n' +
							'vNormal = (vec3( mv * vec4(-aVertexNormal, 0.0)));\n' +
							'vUV = aUV;'
						]
					}))
			}
		})()
	})
	.constant('bitmapFragmentShaderPhong', {
		description: "비트맵 퐁 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapFragmentShaderPhong',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler', 'float uLambert', 'vec3 uDLite'],
						varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
						function: [],
						main: [
							'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
							'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
							'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +

							'vec3 normal = normalize(vNormal);\n' +
							'vec3 lightDir = uDLite;\n' +
							'vec3 reflectDir = reflect(lightDir, normal);\n' +
							'vec3 viewDir = normalize(-vPosition);\n' +

							'float lambertian = max(dot(lightDir,normal), 0.1)*uLambert;\n' +
							'float specular = 0.0;\n' +

							'if(lambertian > 0.0) {\n' +
							'float specAngle = max(dot(reflectDir, viewDir), 0.1);\n' +
							'   specular = pow(specAngle, 4.0)*uLambert;\n' +
							'}\n' +

							'gl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t))*vec4(ambientColor +lambertian*diffuseColor +specular*specColor, 1.0);\n' +
							'gl_FragColor.a = 1.0;'
						]
					}))
			}
		})()
	})
	.constant('bitmapVertexShaderBlinn', {
		description: "비트맵 블린 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapVertexShaderBlinn',
						attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition'],
						varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
						function: [VertexShader.baseFunction],
						main: ['' +
						'mat4 mv = uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale);\n' +
						'gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
						'vPosition = vec3(mv * vec4(aVertexPosition, 1.0));\n' +
						'vNormal = vec3( mv * vec4(-aVertexNormal, 0.0));\n' +
						'vUV = aUV;'
						]
					}))
			}
		})()
	})
	.constant('bitmapFragmentShaderBlinn', {
		description: "비트맵 블린 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'bitmapFragmentShaderBlinn',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler', 'float uLambert', 'vec3 uDLite'],
						varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
						function: [],
						main: ['' +
						'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
						'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
						'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +

						'vec3 normal = normalize(vNormal);\n' +
						'vec3 lightDir = uDLite;\n' +

						'float lambertian = max(dot(lightDir,normal), 0.1)*uLambert;\n' +
						'float specular = 0.0;\n' +

						'vec3 viewDir = normalize(vPosition);\n' +

						'if(lambertian > 0.0) {\n' +
						'	vec3 halfDir = normalize(lightDir + viewDir);\n' +
						'	float specAngle = max(dot(halfDir, normal), 0.0);\n' +
						'	specular = pow(specAngle, 16.0);\n' +
						'}\n' +
						'gl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t))*vec4(ambientColor +lambertian*diffuseColor +specular*specColor, 1.0);\n' +
						'gl_FragColor.a = 1.0;'
						]
					}))
			}
		})()
	})
	.constant('postBaseVertexShader', {
		description: "후처리 베이스 버텍스 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'postBaseVertexShader',
						attributes: ['vec3 aVertexPosition', 'vec2 aUV'],
						uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uRotate', 'vec3 uScale', 'vec3 uPosition'],
						varyings: ['vec2 vUV'],
						function: [VertexShader.baseFunction],
						main: ['' +
						'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uPosition)*rotationMTX(uRotate)*scaleMTX(uScale)*vec4(aVertexPosition, 1.0);\n' +
						'vUV = aUV;'
						]
					}))
			}
		})()
	})
	.constant('postBaseFragmentShader', {
		description: "후처리 베이스 프레그먼트 쉐이더",
		get: (function () {
			var cache;
			return function () {
				return cache || (cache = new Shader({
						id: 'postBaseFragmentShader',
						precision: 'mediump float',
						uniforms: ['sampler2D uSampler', 'vec2 uTexelSize', 'int uFXAA'],
						varyings: ['vec2 vUV'],
						function: [],
						main: ['' +
						'if(uFXAA==1){\n' +
						'float FXAA_REDUCE_MIN = (1.0/128.0);\n' +
						'float FXAA_REDUCE_MUL = (1.0/8.0);\n' +
						'float FXAA_SPAN_MAX = 8.0;\n' +

						'vec4 rgbNW = texture2D(uSampler, (vUV + vec2(-1.0, -1.0) * uTexelSize));\n' +
						'vec4 rgbNE = texture2D(uSampler, (vUV + vec2(1.0, -1.0) * uTexelSize));\n' +
						'vec4 rgbSW = texture2D(uSampler, (vUV + vec2(-1.0, 1.0) * uTexelSize));\n' +
						'vec4 rgbSE = texture2D(uSampler, (vUV + vec2(1.0, 1.0) * uTexelSize));\n' +
						'vec4 rgbM = texture2D(uSampler, vUV);\n' +
						'vec4 luma = vec4(0.299, 0.587, 0.114, 1.0);\n' +
						'float lumaNW = dot(rgbNW, luma);\n' +
						'float lumaNE = dot(rgbNE, luma);\n' +
						'float lumaSW = dot(rgbSW, luma);\n' +
						'float lumaSE = dot(rgbSE, luma);\n' +
						'float lumaM = dot(rgbM, luma);\n' +
						'float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n' +
						'float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n' +

						'vec2 dir = vec2(-((lumaNW + lumaNE) - (lumaSW + lumaSE)), ((lumaNW + lumaSW) - (lumaNE + lumaSE)));\n' +

						'float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),FXAA_REDUCE_MIN);\n' +
						'float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n' +
						'dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n' +
						'max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n' +
						'dir * rcpDirMin)) * uTexelSize;\n' +

						'vec4 rgbA = 0.5 * (' +
						'	texture2D(uSampler, vUV + dir * (1.0 / 3.0 - 0.5))+' +
						'	texture2D(uSampler, vUV + dir * (2.0 / 3.0 - 0.5))' +
						');\n' +

						'vec4 rgbB = rgbA * 0.5 + 0.25 * (texture2D(uSampler, vUV + dir *  -0.5)+texture2D(uSampler, vUV + dir * 0.5));\n' +
						'float lumaB = dot(rgbB, luma);\n' +
						'if ((lumaB < lumaMin) || (lumaB > lumaMax)) {\n' +
						'	gl_FragColor = rgbA;\n' +
						'}\n' +
						'else {\n' +
						'	gl_FragColor = rgbB;\n' +
						'}\n' +
						'}else{\n' +
						'	gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t));' +
						'}' +
						'']
					}))
			}
		})()
	})
	.build();
})();