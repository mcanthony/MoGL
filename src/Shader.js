var Shader = (function () {
    'use strict';
    var code;
    //private
    code = {};
    $setPrivate('Shader', {});
    return MoGL.extend('Shader', {
        description:"GLSL Shader를 보다 쉽게 작성하게 도와주는 헬퍼클래스",
        param:[
            "type:string - Shader.vertex 또는 Shader.fragment로 타입을 지정함",
            "description:Object - 오브젝트 형태로 shader의 내용을 기술함",
            "* vertex - {id:'', attribute:['타입 변수명',...], uniforms:['타입 변수명',...], varying:['타입 변수명',...], main:[코드]}",
            "* fragment - {id:'', uniform:['타입 변수명',...], varying:['타입 변수명',...], main:['코드'], precision}"
        ],
        exception:[
            "0 - type이 'vertex' 또는 'fragment'가 아님"
        ],
        sample:[
            "var shader = new Shader(Shader.vertex, {",
            "    id:'mouseVertexShader',",
            "    attribute:['vec3 aVertexPosition'],",
            "    uniform:['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],",
            "    varying:['vec4 vColor'],",
            "    main:[",
            "        'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2])*vec4(aVertexPosition, 1.0);',",
            "        'vColor = uColor;'",
            "    ]",
            "});"
        ],
        value:(function(){
            var vertexVar = 'attribute,uniform,varying'.split(','), 
                fragmentVar = 'uniform,varying'.split(',');
            return function Shader(type, v) {
                var vars, result, temp, info, str = '', f, i, j;
                if (type == 'vertex') {
                    vars = vertexVar, f = VertexShader.baseFunction;
                } else if (type == 'fragment') {
                    vars = fragmentVar, f = '',
                    str += 'precision ' + (v.precision || 'mediump float') + ';\n';
                } else {
                    this.error(0);
                }
                code[this] = result = {id:v.id}, i = vars.length;
                while (i--) {
                    result[vars[i]] = info = [];
                    if(temp = v[vars[i]]) j = temp.length;
                    else continue;
                    while (j--) {
                        str += vars[i] + ' ' + temp[j] + ';\n',
                        info[info.length] = temp[j];
                    }
                }
                result.program = str + f + 
                    'void main(void){\n' + 
                        v.main.join('\n') + 
                    '\n}';
            };
        })()
    })
    .field('code', {
        description:'쉐이더 구성정보 코드(JS)를 반환',
        sample:[
            "var shader = new Shader();",
            "console.log(shader.code);"
        ],
        get:$getter(code)
    })
    .constant('vertex', {
        description:"버텍스 쉐이더 타입",
        value:'vertex'
    })
    .constant('fragment', {
        description:"프레그먼트 쉐이더 타입",
        value:'fragment'
    })
    .constant('BaseVertexShader', {
        description:"기본 내장 버텍스 쉐이더",
        sample:"console.log(Shader.BaseVertexShaderPhong);",
        get: (function () {
            var cache;
            return function () {
                return cache || (cache = Shader(Shader.vertex, {
                    id:'BaseVertexShader',
                    attribute:[
                        'vec3 aPosition',
                        'vec4 aColor',
                        'vec2 aUV',
                        'vec3 aNormal'
                    ],
                    uniform:[
                        'mat4 uPixel',
                        'mat4 uCamera',
                        /*
                        16 : 행렬모드인 경우 1, 아핀모드인 경우 0
                        행렬모드 : 0~15 - 행렬값
                        아핀모드 : 0~2 위치, 3~5 회전, 6~8 스케일
                        17,18,19 : 드로우영역 x,y,z
                        20 : 스프라이트사용여부
                        21~24 : 스프라이트정보
                        25 : 프레그먼트모드
                            0.0 - 통컬러
                            1.0 - 버텍스당컬러
                            2.0 - 이벤트용
                        26~29 : 메쉬당 통컬러
                        30~33 : 이벤트용 컬러
                        */
                        'float uMesh[30]'
                    ],
                    varying:[
                        'vec2 vUV',
                        'vec3 vNormal',
                        'vec3 vPosition',
                        'vec4 vColor',
                        'float vMode',
                        'float vIsCancel',
                    ],
                    main:[
                        'mat4 mv = uCamera;',
                        'if (uVS[16] == 1.0) {',
                            'mv = mv*mat4(uMesh[0],uMesh[1],uMesh[2],uMesh[3],uMesh[4],uMesh[5],uMesh[6],uMesh[7],uMesh[8],uMesh[9],uMesh[10],uMesh[11],uMesh[12],uMesh[13],uMesh[14],uMesh[15]);',
                        '} else {',
                            'mv = mv*positionMTX(vec3(uMesh[0],uMesh[1],uMesh[2]))*quaternionXYZ(vec3(uMesh[3],uMesh[4],uMesh[5]))*scaleMTX(vec3(uMesh[6],uMesh[7],uMesh[8]));',
                        '}',
                        'vec4 position = mv*vec4(aPosition,1.0);',
                        //GL출력
                        'gl_Position = uPixel*position;',
                        'vPosition = position.xyz;',
                        'vUV = aUV;',
                        //베어링컬러처리
                        'vMode = vMesh[25];',
                        'if (vMode == 1.0) {', //점당처리
                            'vColor = aColor;',
                        '} else if (vMode == 2.0) {', //이벤트처리
                            'vColor = vec4(uMesh[30],uMesh[31],uMesh[32],uMesh[33]);',
                        '} else {', //기타
                            'vColor = vec4(uMesh[26],uMesh[27],uMesh[28],uMesh[29]);',
                        '}',
                        //프레그먼트를 처리여부 판정
                        'if (gl_Position.x < -uMesh[17]*1.0 || gl_Position.x > uMesh[17]*1.0 || ',
                            'vPosition.y < -uMesh[18]*1.0  || vPosition.y > uMesh[18]*1.0) {',
                            'vIsCancel = 0.0;',
                            'vNormal = (mv*vec4(-aNormal,0.0)).xyz;',
                            //스프라이트처리
                            'if (uVS[20] == 1.0) {',
                                'vUV = vec2(aUV.x*uMesh[21]+uMesh[21]*uMesh[23], aUV.y*uMesh[22]+uMesh[22]*uMesh[24]);',
                            '}',
                        '} else {', //안그리는 경우
                            'vIsCancel = 1.0;',
                            'vNormal = aNormal;',
                        '}'
                    ]
                }));
            };
        })()
    })
    .constant('BaseFragmentShader', {
        description:"기본 내장 프레그먼트 쉐이더",
        sample:"console.log(Shader.BaseFragmentShaderPhong);",
        get: (function () {
            var cache;
            return function () {
                return cache || (cache = new Shader(Shader.fragment, {
                    id:'BaseFragmentShader',
                    precision:'lowp float',
                    varying:[
                        'vec2 vUV',
                        'vec3 vNormal',
                        'vec3 vPosition',
                        'vec4 vColor',
                        'float vMode',
                        'float vIsCancel'
                    ],
                    uniform:[
                        'sampler2D uDiffuse',
                        'sampler2D uNormal',
                        'sampler2D uSpecular',
                        'sampler2D uDiffuseWrap',
                        'float uLights[]',
                        /*
                        0 - 메쉬 알파
                        1 - 디퓨즈 비트맵 적용여부
                        2 - 쉐이딩 모델
                            1.0 - flat
                            2.0 - toon
                            3.0 - gouraud
                            4.0 - phong
                        //fs[0~3] - 컬러 정보
                        //fs[4] - 와이어 사용여부 1.0 or 0.0
                        //fs[5~8] - 와이어 컬러
                        //fs[9] - 
                
                        //fs[10] = gMatLambert[tUID_mat] // 램버트 강도 설정
                        //fs[11] = gMatSpecularPower[tUID_mat], // 스페큘라 파워
                        //fs[12] =  tColor2[0], // 스페큘라 컬러 r
                        //fs[13] =  tColor2[1], // 스페큘라 컬러 g
                        //fs[14] =  tColor2[2], // 스페큘라 컬러 b
                        //fs[15] =  tColor2[3], // 스페큘라 컬러 a
                
                        //fs[16] = 1.0, // 노말맵 사용여부
                        //fs[17] = gMatNormalPower[tUID_mat] // 노말맵강도
                
                        //fs[18] = 1.0, // 스페큘러맵사용여부
                        //fs[19] = gMatSpecularMapPower[tUID_mat] // 스페큘러맵 강도
                
                        */
                        'float uMesh[22]'
                    ],
                    main: [

                        'if (uMesh[0] == 0.0 || vIsCancel == 1.0) {',
                            'vIsCancel;',
                        '}else{',
                            'vec4 diffuse;',
                            //비트맵사용여부에 따라 디퓨즈결정
                            'if (uMesh[1] == 0.0) {',
                                'diffuse = vColor;',
                            '} else {',
                                'diffuse = texture2D(uDiffuse, vUV);',
                            '}',
                            'if (diffuse[3] == 0.0){', //결정된 디퓨즈 알파가 0이면 종결
                                'vIsCancel;',
                            '} else {',
                                'float shading = uMesh[2];', //쉐이딩모드
                                
                                
                                
                                'if (shading == 1.0) {', //플랫쉐이딩
                                    'gl_FragColor = diffuse;',
                                '} else if (shading == 2.0) {', //툰쉐이딩
                                    //다중 라이팅모델 반영해야함
                                    /*
                                    'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
                                    'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
                                    'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +
    
                                    'vec3 position = normalize(vPosition);\n' +
                                    'vec3 normal = normalize(vNormal);\n' +
                                    'vec3 lightDir = normalize(uDLite);\n' +
                                    'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                    'float specular = max( dot(reflectDir, position), 0.0 );\n' +
                                    'specular = pow(specular,20.0);\n' +
    
                                    'float light = max( 0.05, dot(normal,lightDir) * uLambert);\n' +
                                    'gl_FragColor = vColor*light*vec4( ambientColor + diffuseColor + specular*specColor , 1.0);\n' +
    
                                    ' if(light>0.95-0.5) gl_FragColor.rgb*=0.95;\n' +
                                    ' else if(light>0.4-0.5) gl_FragColor.rgb*=0.5;\n' +
                                    ' else if(light>0.3-0.5) gl_FragColor.rgb*=0.3;\n' +
                                    ' else gl_FragColor.rgb*=0.1;\n' +
                                    'gl_FragColor.a = vColor[3];'
                                    */
                                    'gl_FragColor = diffuse;',
                                '} else if (shading == 3.0) {', //고라우드쉐이딩
                                    //다중 라이팅모델 반영해야함
                                    /*
                                    'gl_FragColor = diffuse * vLight;\n' +
                                    'gl_FragColor.a = diffuse[3];'
                                    */
                                    'gl_FragColor = diffuse;',
                                'if (shading == 4.0) {', //퐁쉐이딩
                                    /*
                                    'vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);',
                                    'vec4 specColor = vec4(uFS[12],uFS[13],uFS[14],uFS[15]);',
                                    'vec3 position = normalize(vPosition);',
                                    'vec3 normal = normalize(vNormal);',
                                    'vec3 lightDir = normalize(uDLite);',
                                    'vec3 reflectDir = reflect(-lightDir, normal);',
                                    // 라이트강도 구하고
                                    'float light = max( 0.05, dot(normal,lightDir) * uFS[10]);',
                                    'float specular\n;',
                                    'if (uFS[16] == 1.0) {',
                                        'vec4 bump = texture2D( uNormalSampler, vUV );',
                                        // 범프값을 -1~1로 교정
                                        'bump.rgb= bump.rgb*2.0-1.0;',
                                        // 맵에서 얻어낸 노말 스페큘라
                                        'float normalSpecular = max( dot(reflectDir, normalize(position-bump.rgb)), 0.3 );',
                                        // 스페큘라
                                        'specular = pow(normalSpecular,uFS[11])*specColor[3];',
                                        'gl_FragColor = ( diffuse *light * ambientColor * ambientColor[3] + specular * specColor ) + normalSpecular * bump.g * uFS[17];',
                                    '} else {',
                                        'specular = max( dot(reflectDir, position), 0.5 );',
                                        'specular = pow(specular,uFS[11])*specColor[3];',
                                        'gl_FragColor = diffuse *light * ambientColor * ambientColor[3] + specular * specColor;',
                                    '}',
                                    'if (uFS[18] == 1.0) {',
                                        'specular = max( dot(reflectDir, position), 0.5 );',
                                        'specular = pow(specular,texture2D( uSpecularSampler, vUV ).a);',
                                        'gl_FragColor = gl_FragColor + gl_FragColor * specColor * specular * texture2D( uSpecularSampler, vUV ) * uFS[19];',
                                    '}',
                                    'gl_FragColor.a = alpha*uFS[9];',
                                    */
                                    'gl_FragColor = diffuse;',
                                '}',
                        '}'
                    ]
                }));
            };
        })()
    })
    .constant('mouseVertexShader', {
        description:"마우스 버텍스 쉐이더",
        sample:"console.log(Shader.mouseVertexShader);",
        get:(function () {
            var cache;
            return function () {
                return cache || (cache = Shader(Shader.vertex, {
                    id:'mouseVertexShader',
                    attribute:['vec3 aVertexPosition'],
                    uniform:[
                        'mat4 uPixelMatrix',
                        'mat4 uCameraMatrix',
                        'vec3 uAffine[3]',
                        'vec4 uColor'
                    ],
                    varying:['vec4 vColor'],
                    main:[
                        'gl_Position = uPixelMatrix*uCameraMatrix*positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2])*vec4(aVertexPosition, 1.0);\n' +
                        'vColor = uColor;'
                    ]
                }))
            }
        })()
    })
    .constant('colorVertexShader', {
            description: "컬러 버텍스 쉐이더",
            sample: [
                "console.log(Shader.colorVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                        id: 'colorVertexShader',
                        attribute: ['vec3 aVertexPosition'],
                        uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'float uVS[30]', 'vec4 uColor'],
                        varying: ['vec4 vColor'],
                        function: [VertexShader.baseFunction],
                        main: [
                            'mat4 mv;\n' +
                            'if( uVS[16] == 1.0 ){\n'+
                                'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                            '} else {\n' +
                                'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                            '}\n'+
                            'gl_Position = uPixelMatrix * mv * vec4(aVertexPosition, 1.0);\n' +
                            'vColor = uColor;'
                        ]
                    }))
                }
            })()
        })
        
  .constant('wireFrameVertexShader', {
            description: "와이어프레임 버텍스 쉐이더",
            sample: [
                "console.log(Shader.wireFrameVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'wireFrameVertexShader',
                            attribute: ['vec3 aVertexPosition'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'float uVS[30]', 'vec4 uColor'],
                            varying: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                    'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                    'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                'gl_Position = uPixelMatrix * mv * vec4(aVertexPosition, 1.0);\n' +
                                'vColor = uColor ;'
                            ]
                        }))
                }
            })()
        })       
     .constant('bitmapVertexShader', {
            description: "비트맵 버텍스 쉐이더",
            sample: [
                "console.log(Shader.bitmapVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'bitmapVertexShader',
                            attribute: ['vec3 aVertexPosition', 'vec2 aUV'],
                            uniform: [
                                'mat4 uPixelMatrix', 'mat4 uCameraMatrix',
                                'float uVS[30]'
                            ],
                            varying: ['vec2 vUV'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                    'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                    'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                'gl_Position = uPixelMatrix * mv * vec4(aVertexPosition, 1.0);\n' +
                                'vUV = aUV;'
                            ]
                        }))
                }
            })()
        })         
        .constant('colorVertexShaderGouraud', {
            description: "컬러 고라우드 버텍스 쉐이더",
            sample: [
                "console.log(Shader.colorVertexShaderGouraud);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'colorVertexShaderGouraud',
                            attribute: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'float uVS[30]', 'vec4 uColor'],
                            varying: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                     'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                     'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                ' gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
                                ' vec3 normal = normalize(mv * vec4(-aVertexNormal, 0.0)).xyz;\n' +
                                ' float light = max( 0.05, dot(normal, normalize(uDLite)) * uLambert);\n' +
                                ' vColor = uColor*light;' +
                                ' vColor[3] = uColor[3];'
                            ]
                        }))
                }
            })()
        })        
        .constant('bitmapVertexShaderGouraud', {
            description: "비트맵 고라우드 버텍스 쉐이더",
            sample: [
                "console.log(Shader.bitmapVertexShaderGouraud);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'bitmapVertexShaderGouraud',
                            attribute: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'float uVS[30]'],
                            varying: ['vec2 vUV', 'vec4 vLight'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                ' gl_Position = uPixelMatrix*mv*vec4(aVertexPosition, 1.0);\n' +
                                ' vec3 normal = normalize(mv * vec4(-aVertexNormal, 0.0)).xyz;\n' +
                                ' float light = max( 0.05, dot(normal,normalize(uDLite)) * uLambert);\n' +
                                ' vLight = vec4(1.0,1.0,1.0,1.0)*light;\n' +
                                ' vLight[3] = 1.0;\n' +
                                ' vUV = aUV;'
                            ]
                        }))
                }
            })()
        })
        .constant('colorVertexShaderPhong', {
            description: "컬러 퐁 버텍스 쉐이더",
            sample: [
                "console.log(Shader.colorVertexShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'colorVertexShaderPhong',
                            attribute: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'float uVS[30]'],
                            varying: ['vec3 vNormal', 'vec3 vPosition'],
                            function: [VertexShader.baseFunction],
                            main: ['' +
                            'mat4 mv = uCameraMatrix* positionMTX( vec3(uVS[0], uVS[1], uVS[2]) ) * quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) ) * scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) ) ;\n' +
                            'vec4 position = mv * vec4(aVertexPosition, 1.0);\n' +
                            'gl_Position = uPixelMatrix*position;\n' +
                            'vPosition = position.xyz;\n' +
                            'vNormal =  (mv * vec4(-aVertexNormal, 0.0)).xyz;\n'
                            ]
                        }))
                }
            })()
        })       
        .constant('toonVertexShaderPhong', {
            description: "툰 퐁 버텍스 쉐이더",
            sample: [
                "console.log(Shader.toonVertexShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'toonVertexShaderPhong',
                            attribute: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'float uVS[30]', 'vec4 uColor'],
                            varying: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                'vec4 position = mv * vec4(aVertexPosition, 1.0);\n' +
                                'gl_Position = uPixelMatrix*position;\n' +
                                'vPosition = position.xyz;\n' +
                                'vNormal =  (mv * vec4(-aVertexNormal, 0.0)).xyz;\n' +
                                'vColor = uColor;'
                            ]
                        }))
                }
            })()
        })
        .constant('mouseFragmentShader', {
            description: "마우스 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.mouseFragmentShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'mouseFragmentShader',
                            precision: 'lowp float',
                            uniform: [],
                            varying: ['vec4 vColor'],
                            function: [],
                            main: [
                                'gl_FragColor =  vColor;'
                            ]
                        }))
                }
            })()
        })
        .constant('colorFragmentShader', {
            description: "컬러 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorFragmentShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'colorFragmentShader',
                            precision: 'lowp float',
                            uniform: [],
                            varying: ['vec4 vColor'],
                            function: [],
                            main: [
                                'gl_FragColor =  vColor;'
                            ]
                        }))
                }
            })()
        })
        .constant('wireFrameFragmentShader', {
            description: "와이어프레임 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.wireFrameFragmentShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'wireFrameFragmentShader',
                            precision: 'lowp float',
                            uniform: [],
                            varying: ['vec4 vColor'],
                            function: [],
                            main: [
                                'gl_FragColor =  vColor;'
                            ]
                        }))
                }
            })()
        })
        .constant('bitmapFragmentShader', {
            description: "비트맵 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.bitmapFragmentShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'bitmapFragmentShader',
                            precision: 'lowp float',
                            uniform: ['sampler2D uSampler'],
                            varying: ['vec2 vUV'],
                            function: [],
                            main: [
                                'gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t));\n'
                            ]
                        }))
                }
            })()
        })
        .constant('colorFragmentShaderGouraud', {
            description: "컬러 고라우드 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorFragmentShaderGouraud);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'colorFragmentShaderGouraud',
                            precision: 'lowp float',
                            uniform: ['sampler2D uSampler'],
                            varying: ['vec4 vColor'],
                            function: [],
                            main: [
                                'gl_FragColor =  vColor;\n'
                            ]
                        }))
                }
            })()
        })
        .constant('bitmapFragmentShaderGouraud', {
            description: "비트맵 고라우드 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.bitmapFragmentShaderGouraud);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'bitmapFragmentShaderGouraud',
                            precision: 'lowp float',
                            uniform: ['sampler2D uSampler'],
                            varying: ['vec2 vUV', 'vec4 vLight'],
                            function: [],
                            main: [
                                'vec4 diffuse = texture2D(uSampler, vec2(vUV.s, vUV.t));\n' +
                                'gl_FragColor = diffuse * vLight;\n' +
                                'gl_FragColor.a = diffuse[3];'
                            ]
                        }))
                }
            })()
        })
        .constant('colorFragmentShaderPhong', {
            description: "컬러 퐁 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorFragmentShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'colorFragmentShaderPhong',
                            precision: 'lowp float',
                            uniform: [
                                'vec3 uDLite',
                                'float uFS[22]'
                            ],
                            varying: ['vec3 vNormal', 'vec3 vPosition'],
                            function: [],
                            main: [
                                'if( uFS[4] == 1.0 ){\n' +
                                    'gl_FragColor = vec4(uFS[5],uFS[6],uFS[7],uFS[8])*uFS[9];\n' +
                                '}else{\n' +
                                    'vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                                    'vec4 specColor = vec4(uFS[12],uFS[13],uFS[14],uFS[15]);\n' +
                                    'vec4 diffuseColor = vec4(uFS[0],uFS[1],uFS[2],uFS[3]);\n' +

                                    'vec3 position = normalize(vPosition);\n' +
                                    'vec3 normal = normalize(vNormal);\n' +
                                    'vec3 lightDir = normalize(uDLite);\n' +
                                    'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                    'float specular = max( dot(reflectDir, position), 0.0 );\n' +

                                    'specular = pow(specular,uFS[11])*specColor[3];\n' +
                                    'float light = max( 0.05, dot(normal,lightDir) * uFS[10]);\n' +
                                    'gl_FragColor = diffuseColor *light * ambientColor * ambientColor[3] + specular * specColor ;\n' +
                                    'gl_FragColor.a = uFS[9];\n'+
                                '}\n'
                            ]
                        }))
                }
            })()
        })
        .constant('toonFragmentShaderPhong', {
            description: "툰 퐁 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.toonFragmentShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'toonFragmentShaderPhong',
                            precision: 'lowp float',
                            uniform: ['float uLambert', 'vec3 uDLite'],
                            varying: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
                            function: [],
                            main: [
                                'vec3 ambientColor = vec3(0.0, 0.0, 0.0);\n' +
                                'vec3 diffuseColor = vec3(1.0, 1.0, 1.0);\n' +
                                'vec3 specColor = vec3(1.0, 1.0, 1.0);\n' +

                                'vec3 position = normalize(vPosition);\n' +
                                'vec3 normal = normalize(vNormal);\n' +
                                'vec3 lightDir = normalize(uDLite);\n' +
                                'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                'float specular = max( dot(reflectDir, position), 0.0 );\n' +
                                'specular = pow(specular,20.0);\n' +

                                'float light = max( 0.05, dot(normal,lightDir) * uLambert);\n' +
                                'gl_FragColor = vColor*light*vec4( ambientColor + diffuseColor + specular*specColor , 1.0);\n' +

                                ' if(light>0.95-0.5) gl_FragColor.rgb*=0.95;\n' +
                                ' else if(light>0.4-0.5) gl_FragColor.rgb*=0.5;\n' +
                                ' else if(light>0.3-0.5) gl_FragColor.rgb*=0.3;\n' +
                                ' else gl_FragColor.rgb*=0.1;\n' +

                                'gl_FragColor.a = vColor[3];'
                            ]
                        }))
                }
            })()
        })
        .constant('bitmapVertexShaderPhong', {
            description: "비트맵 퐁 버텍스 쉐이더",
            sample: [
                "console.log(Shader.bitmapVertexShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'bitmapVertexShaderPhong',
                            attribute: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
                            uniform: [
                                'mat4 uPixelMatrix', 'mat4 uCameraMatrix',
                                'float uVS[30]'
                            ],
                            varying: [
                                'vec2 vUV', 'vec3 vNormal', 'vec3 vPosition','float isDiscard'

                            ],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv;\n' +
                                'if( uVS[16] == 1.0 ){\n'+
                                    'mv = uCameraMatrix * mat4(uVS[0],uVS[1],uVS[2],uVS[3],uVS[4],uVS[5],uVS[6],uVS[7],uVS[8],uVS[9],uVS[10],uVS[11],uVS[12],uVS[13],uVS[14],uVS[15]);\n'+
                                '} else {\n' +
                                    'mv = uCameraMatrix * positionMTX( vec3(uVS[0], uVS[1], uVS[2]) )*quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) )*scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) );\n'+
                                '}\n'+
                                'vec4 position = mv * vec4(aVertexPosition, 1.0);\n' +
                                'gl_Position = uPixelMatrix*position;\n' +
                                'vPosition = position.xyz;\n' +
                                'isDiscard = 0.0;\n' +
                                'if( gl_Position.x < -uVS[22] * 1.0 || gl_Position.x > uVS[22] * 1.0) {\n' +
                                        'isDiscard = 1.0;\n' +
                                '}\n' +
                                'else if( vPosition.y < -uVS[23] * 1.0  || vPosition.y > uVS[23] * 1.0) {\n' +
                                     'isDiscard = 1.0;\n' +
                                '};\n' +

                                'vNormal = (mv * vec4(-aVertexNormal, 0.0)).xyz;\n' +
                                'if( uVS[17] == 1.0 ) {' +
                                '   vUV = vec2(aUV.x*uVS[18]+uVS[18]*uVS[20], aUV.y*uVS[19]+uVS[19]*uVS[21]);' +
                                '}else{' +
                                '   vUV = aUV;' +
                                '}'
                            ]
                        }))
                }
            })()
        })

        ////////////////////

        //vs[0~2] = x,y,z
        //vs[3~5] = rx,ry,rz
        //vs[6~8] = sx,sy,sz
        //vs[9] - 시트 사용여부 1.0 or 0.0
        //vs[10~13] - 시트 정보
        //
        //fs[0~3] - 컬러 정보
        //fs[4] - 와이어 사용여부 1.0 or 0.0
        //fs[5~8] - 와이어 컬러
        //fs[9] - 메쉬 알파
        //
        //fs[10] = gMatLambert[tUID_mat] // 램버트 강도 설정
        //fs[11] = gMatSpecularPower[tUID_mat], // 스페큘라 파워
        //fs[12] =  tColor2[0], // 스페큘라 컬러 r
        //fs[13] =  tColor2[1], // 스페큘라 컬러 g
        //fs[14] =  tColor2[2], // 스페큘라 컬러 b
        //fs[15] =  tColor2[3], // 스페큘라 컬러 a
        //
        //fs[16] = 1.0, // 노말맵 사용여부
        //fs[17] = gMatNormalPower[tUID_mat] // 노말맵강도
        //
        //fs[18] = 1.0, // 스페큘러맵사용여부
        //fs[19] = gMatSpecularMapPower[tUID_mat] // 스페큘러맵 강도

        ////////////////
        .constant('bitmapFragmentShaderPhong', {
        description: "비트맵 퐁 프레그먼트 쉐이더",
        sample: [
            "console.log(Shader.bitmapFragmentShaderPhong);"
        ],
        get: (function () {
            var cache;
            return function () {
                return cache || (cache = new Shader(Shader.fragment, {
                        id: 'bitmapFragmentShaderPhong',
                        precision: 'lowp float',
                        uniform: [
                            'sampler2D uSampler',
                            'sampler2D uNormalSampler',
                            'sampler2D uSpecularSampler',
                            'vec3 uDLite',
                            'float uFS[22]'
                        ],
                        varying: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition' ,'float isDiscard'],
                        function: [],
                        main: [
                            'if( uFS[9] == 0.0 || isDiscard >0.0  ) discard;\n' +
                            //'if( uFS[9] == 0.0 || isDiscard >0.0  ) gl_FragColor = vec4(0.1,0.5,0.2,1.0);\n' +
                            //'else if( gl_Position.x < -uFS[20]*0.65 || vPosition.x > uFS[20]*0.65) {\n' +
                            //    'if( vPosition.y < -uFS[21]*0.65 || vPosition.y > uFS[21]*0.65) {\n' +
                            //        'discard;\n' +
                            //    '};\n' +
                            //'}\n' +
                            'else {\n'+
                                'if( uFS[4] == 1.0 ){\n' +
                                    'gl_FragColor = vec4(uFS[5],uFS[6],uFS[7],uFS[8])*uFS[9];\n' +
                                '}else{\n' +
                                    'vec4 diffuse = texture2D( uSampler, vUV );\n' + // 디퓨즈를 계산함
                                    'float alpha = diffuse[3];\n' + // 디퓨즈를 계산함
                                    'if(alpha==0.0) discard;\n'+
                                    'else {\n'+
                                        'vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                                        'vec4 specColor = vec4(uFS[12],uFS[13],uFS[14],uFS[15]);\n' +

                                        'vec3 position = normalize(vPosition);\n' +
                                        'vec3 normal = normalize(vNormal);\n' +
                                        'vec3 lightDir = normalize(uDLite);\n' +
                                        'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                        'float light = max( 0.05, dot(normal,lightDir) * uFS[10]);\n' + // 라이트강도 구하고

                                        'float specular\n;' +
                                        'if( uFS[16] == 1.0 ){\n' +
                                        '   vec4 bump = texture2D( uNormalSampler, vUV );\n' +
                                        '   bump.rgb= bump.rgb*2.0-1.0 ;\n' + // 범프값을 -1~1로 교정
                                        '   float normalSpecular = max( dot(reflectDir, normalize(position-bump.rgb)), 0.3 );\n' + // 맵에서 얻어낸 노말 스페큘라
                                        '   specular = pow(normalSpecular,uFS[11])*specColor[3];\n' + // 스페큘라
                                        '   gl_FragColor = ( diffuse *light * ambientColor * ambientColor[3] + specular * specColor ) + normalSpecular * bump.g * uFS[17]  ;\n' +
                                        '}else{' +
                                        '   specular = max( dot(reflectDir, position), 0.5 );\n' +
                                        '   specular = pow(specular,uFS[11])*specColor[3];\n' +
                                        '   gl_FragColor = diffuse *light * ambientColor * ambientColor[3] + specular * specColor ;\n' +
                                        '}\n' +
                                        'if( uFS[18] == 1.0 ){\n' +
                                        '   specular = max( dot(reflectDir, position), 0.5 );\n' +
                                        '   specular = pow(specular,texture2D( uSpecularSampler, vUV ).a);\n' +
                                        '   gl_FragColor = gl_FragColor + gl_FragColor * specColor * specular * texture2D( uSpecularSampler, vUV ) * uFS[19];\n' +
                                        '}\n' +
                                        'gl_FragColor.a = alpha*uFS[9];\n'+
                                    '}\n'+
                                '};\n'+
                            '};\n'

                        ]
                    }))
            }
        })()
        })
        .constant('postBaseVertexShader', {
            description: "후처리 베이스 버텍스 쉐이더",
            sample: [
                "console.log(Shader.postBaseVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.vertex, {
                            id: 'postBaseVertexShader',
                            attribute: ['vec3 aVertexPosition', 'vec2 aUV'],
                            uniform: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'float uVS[30]'],
                            varying: ['vec2 vUV'],
                            function: [VertexShader.baseFunction],
                            main: ['' +
                            'gl_Position = uPixelMatrix*uCameraMatrix* positionMTX( vec3(uVS[0], uVS[1], uVS[2]) ) * quaternionXYZ( vec3(uVS[3], uVS[4], uVS[5]) ) * scaleMTX( vec3(uVS[6], uVS[7], uVS[8]) ) *vec4(aVertexPosition, 1.0);\n' +
                            'vUV = aUV;'
                            ]
                        }))
                }
            })()
        })
        .constant('postBaseFragmentShader', {
            description: "후처리 베이스 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.postBaseFragmentShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader(Shader.fragment, {
                            id: 'postBaseFragmentShader',
                            precision: 'lowp float',
                            uniform: ['sampler2D uSampler', 'vec2 uTexelSize', 'int uFXAA'],
                            varying: ['vec2 vUV'],
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
                            '   texture2D(uSampler, vUV + dir * (1.0 / 3.0 - 0.5))+' +
                            '   texture2D(uSampler, vUV + dir * (2.0 / 3.0 - 0.5))' +
                            ');\n' +

                            'vec4 rgbB = rgbA * 0.5 + 0.25 * (texture2D(uSampler, vUV + dir *  -0.5)+texture2D(uSampler, vUV + dir * 0.5));\n' +
                            'float lumaB = dot(rgbB, luma);\n' +
                            'if ((lumaB < lumaMin) || (lumaB > lumaMax)) {\n' +
                            '   gl_FragColor = rgbA;\n' +
                            '}\n' +
                            'else {\n' +
                            '   gl_FragColor = rgbB;\n' +
                            '}\n' +
                            '}else{\n' +
                            '   gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t));' +
                            '}' +
                            '']
                        }))
                }
            })()
        })
        .build();
})();