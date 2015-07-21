var Shader = (function () {
    'use strict';
    var code;
    //private
    code = {};
    $setPrivate('Shader', {});
    return MoGL.extend('Shader', {
            description: "쉐이더 클래스. 버텍스쉐이더와 프레그먼트 쉐이더를 생성.",
            param: [
                "1. v:Object - 오브젝트 형태로 쉐이더 정보를 입력",
                "2. 버텍스쉐이더 - { id:'', attributes:[], uniforms:[], varyings[], function:[], main[]",
                "3. 프레그먼트쉐이더 - { id:'', uniforms:[], varyings[], function:[], main[]"
            ],
            sample: [
                "var shader = new Shader();"
            ],
            value: function Shader(v) {
                code[this] = v;
            }
        }
    )
        .field('code', {
            description: '쉐이더 구성정보 코드(JS)를 반환',
            get: $getter(code),
            sample: [
                "var shader = new Shader();",
                "console.log(shader.code);"
            ]
        }
    )

        .constant('colorMergeVShader', {
            description: "컬러 버텍스 쉐이더",
            sample: [
                "console.log(Shader.colorMergeVShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'colorMergeVShader',
                            //attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal', 'vec3 aScale', 'vec4 aColor','vec3 aUV','float aIDX'],
                            //uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix','vec3 uRotate[150]','vec3 uPosition[150]'],
                            attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal', 'vec3 aScale', 'vec4 aColor', 'vec3 aUV', 'vec3 aRotate', 'vec3 aPosition'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix'],
                            varyings: ['vec4 vColor', 'vec2 vUV', 'float vIDX', 'vec3 vNormal', 'vec3 vPosition'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'vIDX = aUV.x;\n' +
                                'vUV = aUV.yz;\n' +
                                'vColor = aColor;\n' +
                                ' mat4 mv = uCameraMatrix*positionMTX(aPosition)*quaternionZYX(aRotate)*scaleMTX(aScale);\n' +
                                ' vec4 position = mv * vec4(aVertexPosition, 1.0);\n' +
                                ' gl_Position = uPixelMatrix*position;\n' +
                                ' vPosition = position.xyz;\n' +
                                ' vNormal = (mv * vec4(-aVertexNormal, 0.0)).xyz;\n'


                            ]
                        }))
                }
            })()
        })
        .constant('colorMergeFShader', {
            description: "컬러 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorMergeFShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'colorMergeFShader',
                            precision: 'mediump float',
                            uniforms: [
                                'sampler2D uSampler0', 'sampler2D uSampler1', 'sampler2D uSampler2', 'sampler2D uSampler3', 'sampler2D uSampler4', 'sampler2D uSampler5', 'sampler2D uSampler6', 'sampler2D uSampler7', 'sampler2D uSampler8',
                                'vec3 uDLite'],
                            varyings: ['vec4 vColor', 'vec2 vUV', 'float vIDX', 'vec3 vNormal', 'vec3 vPosition'],
                            function: [],
                            main: [
                                '   vec4 diffuse;\n' +
                                ' if(vIDX <= 2.0){\n' +
                                '   diffuse =  vColor;\n' +
                                ' } else {\n' +
                                '   if(vIDX <=3.0){\n' +
                                '      diffuse = texture2D( uSampler0, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=4.0){\n' +
                                '     diffuse = texture2D( uSampler1, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=5.0){\n' +
                                '     diffuse = texture2D( uSampler2, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=6.0){\n' +
                                '     diffuse = texture2D( uSampler3, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=7.0){\n' +
                                '     diffuse = texture2D( uSampler4, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=8.0){\n' +
                                '     diffuse = texture2D( uSampler5, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=9.0){\n' +
                                '     diffuse = texture2D( uSampler6, vUV);\n' + // 디퓨즈를 계산함
                                '   } else if(vIDX <=10.0){\n' +
                                '     diffuse = texture2D( uSampler7, vUV);\n' + // 디퓨즈를 계산함
                                '   } else {\n' +
                                '     diffuse = texture2D( uSampler8, vUV);\n' + // 디퓨즈를 계산함
                                '   }\n' +
                                '}\n' +
                                '   vec4 uSpecularColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                                '   float uSpecularPower = 5.0;\n' +

                                '   vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                                '   vec4 specColor = uSpecularColor;\n' +

                                '   float alpha = diffuse[3];\n' + // 디퓨즈를 계산함
                                '   vec3 position = normalize(vPosition);\n' +
                                '   vec3 normal = normalize(vNormal);\n' +
                                '   vec3 lightDir = normalize(uDLite);\n' +
                                '   vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                '   float light = max( 0.05, dot(normal,lightDir) );\n' + // 라이트강도 구하고

                                '   float specular\n;' +
                                    //'   if( useNormalMap ){\n' +
                                    //'      vec4 bump = texture2D( uNormalSampler, vec2(vUV.s, vUV.t) );\n' +
                                    //'      bump.rgb= bump.rgb*2.0-1.0 ;\n' + // 범프값을 -1~1로 교정
                                    //'      float normalSpecular = max( dot(reflectDir, position-bump.g), 0.5 );\n' + // 맵에서 얻어낸 노말 스페큘라
                                    //'      specular = pow(normalSpecular,uSpecularPower)*specColor[3];\n' + // 스페큘라
                                    //'      gl_FragColor = ( diffuse *light * ambientColor * ambientColor[3] + specular * specColor ) + normalSpecular * bump.g * uNormalPower  ;\n' +
                                    //'   }else{' +
                                    //'      specular = max( dot(reflectDir, position), 0.5 );\n' +
                                    //'      specular = pow(specular,uSpecularPower)*specColor[3];\n' +
                                    //'      gl_FragColor = diffuse *light * ambientColor * ambientColor[3] + specular * specColor ;\n' +
                                    //'   }\n' +
                                    //

                                '      specular = max( dot(reflectDir, position), 0.5 );\n' +
                                '      specular = pow(specular,uSpecularPower)*specColor[3];\n' +
                                '      gl_FragColor = diffuse * light * ambientColor * ambientColor[3] + specular * specColor ;\n' +
                                '      gl_FragColor.a = alpha;\n'

                            ]
                        }))
                }
            })()
        })


        .constant('mouseVertexShader', {
            description: "마우스 버텍스 쉐이더",
            sample: [
                "console.log(Shader.mouseVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'mouseVertexShader',
                            attributes: ['vec3 aVertexPosition'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'gl_Position = uPixelMatrix * uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) * vec4(aVertexPosition, 1.0);\n' +
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
                    return cache || (cache = new Shader({
                            id: 'mouseFragmentShader',
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
        .constant('colorVertexShader', {
            description: "컬러 버텍스 쉐이더",
            sample: [
                "console.log(Shader.colorVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'colorVertexShader',
                            attributes: ['vec3 aVertexPosition'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'gl_Position = uPixelMatrix * uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) * vec4(aVertexPosition, 1.0);\n' +
                                'vColor = uColor;'
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
                    return cache || (cache = new Shader({
                            id: 'colorFragmentShader',
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
        .constant('wireFrameVertexShader', {
            description: "와이어프레임 버텍스 쉐이더",
            sample: [
                "console.log(Shader.wireFrameVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'wireFrameVertexShader',
                            attributes: ['vec3 aVertexPosition'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'gl_Position = uPixelMatrix * uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) * vec4(aVertexPosition, 1.0);\n' +
                                'vColor = uColor ;'
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
            sample: [
                "console.log(Shader.bitmapVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'bitmapVertexShader',
                            attributes: ['vec3 aVertexPosition', 'vec2 aUV'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]'],
                            varyings: ['vec2 vUV'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'gl_Position = uPixelMatrix * uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) * vec4(aVertexPosition, 1.0);\n' +
                                'vUV = aUV;'
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
                    return cache || (cache = new Shader({
                            id: 'bitmapFragmentShader',
                            precision: 'mediump float',
                            uniforms: ['sampler2D uSampler'],
                            varyings: ['vec2 vUV'],
                            function: [],
                            main: [
                                'gl_FragColor =  texture2D(uSampler, vec2(vUV.s, vUV.t));\n'
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
                    return cache || (cache = new Shader({
                            id: 'colorVertexShaderGouraud',
                            attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                ' mat4 mv = uCameraMatrix* positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]);\n' +
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
        .constant('colorFragmentShaderGouraud', {
            description: "컬러 고라우드 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorFragmentShaderGouraud);"
            ],
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
            sample: [
                "console.log(Shader.bitmapVertexShaderGouraud);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'bitmapVertexShaderGouraud',
                            attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uDLite', 'float uLambert', 'vec3 uAffine[3]'],
                            varyings: ['vec2 vUV', 'vec4 vLight'],
                            function: [VertexShader.baseFunction],
                            main: [
                                ' mat4 mv = uCameraMatrix* positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) ;\n' +
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
        .constant('bitmapFragmentShaderGouraud', {
            description: "비트맵 고라우드 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.bitmapFragmentShaderGouraud);"
            ],
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
                                'vec4 diffuse = texture2D(uSampler, vec2(vUV.s, vUV.t));\n' +
                                'gl_FragColor = diffuse * vLight;\n' +
                                'gl_FragColor.a = diffuse[3];'
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
                    return cache || (cache = new Shader({
                            id: 'colorVertexShaderPhong',
                            attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: ['' +
                            'mat4 mv = uCameraMatrix* positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) ;\n' +
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
        .constant('colorFragmentShaderPhong', {
            description: "컬러 퐁 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.colorFragmentShaderPhong);"
            ],
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

                                'vec3 position = normalize(vPosition);\n' +
                                'vec3 normal = normalize(vNormal);\n' +
                                'vec3 lightDir = normalize(uDLite);\n' +
                                'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                'float specular = max( dot(reflectDir, position), 0.0 );\n' +
                                'specular = pow(specular,20.0);\n' +

                                'float light = max( 0.05, dot(normal,lightDir) * uLambert);\n' +
                                'gl_FragColor = vColor*light*vec4( ambientColor+ diffuseColor + specular*specColor , 1.0);\n' +
                                'gl_FragColor.a = vColor[3];'
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
                    return cache || (cache = new Shader({
                            id: 'toonVertexShaderPhong',
                            attributes: ['vec3 aVertexPosition', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'vec4 uColor'],
                            varyings: ['vec3 vNormal', 'vec3 vPosition', 'vec4 vColor'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv = uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]);\n' +
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
        .constant('toonFragmentShaderPhong', {
            description: "툰 퐁 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.toonFragmentShaderPhong);"
            ],
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
                    return cache || (cache = new Shader({
                            id: 'bitmapVertexShaderPhong',
                            attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]', 'bool uSheetMode', 'vec4 uSheetOffset'],
                            varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
                            function: [VertexShader.baseFunction],
                            main: [
                                'mat4 mv = uCameraMatrix * positionMTX(uAffine[0])*quaternionZYX(uAffine[1])*scaleMTX(uAffine[2]);\n' +
                                'vec4 position = mv * vec4(aVertexPosition, 1.0);\n' +
                                'gl_Position = uPixelMatrix*position;\n' +
                                'vPosition = position.xyz;\n' +
                                'vNormal = (mv * vec4(-aVertexNormal, 0.0)).xyz;\n' +
                                'if( uSheetMode ) {' +
                                '   vUV = vec2(aUV.x*uSheetOffset[0]+uSheetOffset[0]*uSheetOffset[2], aUV.y*uSheetOffset[1]+uSheetOffset[1]*uSheetOffset[3]);' +
                                '}else{' +
                                '   vUV = aUV;' +
                                '}'
                            ]
                        }))
                }
            })()
        })
        .constant('bitmapFragmentShaderPhong', {
            description: "비트맵 퐁 프레그먼트 쉐이더",
            sample: [
                "console.log(Shader.bitmapFragmentShaderPhong);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'bitmapFragmentShaderPhong',
                            precision: 'mediump float',
                            uniforms: [
                                'sampler2D uSampler',
                                'sampler2D uNormalSampler', 'bool useNormalMap', 'float uNormalPower',
                                'sampler2D uSpecularSampler', 'bool useSpecularMap', 'float uSpecularMapPower',
                                'float uLambert', 'float uSpecularPower', 'vec4 uSpecularColor',
                                'vec3 uDLite'
                            ],
                            varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
                            function: [],
                            main: [
                                'vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                                'vec4 specColor = uSpecularColor;\n' +

                                'vec3 position = normalize(vPosition);\n' +
                                'vec3 normal = normalize(vNormal);\n' +
                                'vec3 lightDir = normalize(uDLite);\n' +
                                'vec3 reflectDir = reflect(-lightDir, normal);\n' +
                                'float light = max( 0.05, dot(normal,lightDir) * uLambert);\n' + // 라이트강도 구하고
                                'vec4 diffuse = texture2D( uSampler, vUV );\n' + // 디퓨즈를 계산함
                                'float alpha = diffuse[3];\n' + // 디퓨즈를 계산함

                                'float specular\n;' +
                                'if( useNormalMap ){\n' +
                                '   vec4 bump = texture2D( uNormalSampler, vUV );\n' +
                                '   bump.rgb= bump.rgb*2.0-1.0 ;\n' + // 범프값을 -1~1로 교정
                                '   float normalSpecular = max( dot(reflectDir, position-bump.g), 0.5 );\n' + // 맵에서 얻어낸 노말 스페큘라
                                '   specular = pow(normalSpecular,uSpecularPower)*specColor[3];\n' + // 스페큘라
                                '   gl_FragColor = ( diffuse *light * ambientColor * ambientColor[3] + specular * specColor ) + normalSpecular * bump.g * uNormalPower  ;\n' +
                                '}else{' +
                                '   specular = max( dot(reflectDir, position), 0.5 );\n' +
                                '   specular = pow(specular,uSpecularPower)*specColor[3];\n' +
                                '   gl_FragColor = diffuse *light * ambientColor * ambientColor[3] + specular * specColor ;\n' +
                                '}\n' +
                                'if( useSpecularMap ){\n' +
                                '   specular = max( dot(reflectDir, position), 0.5 );\n' +
                                '   specular = pow(specular,texture2D( uSpecularSampler, vUV ).a);\n' +
                                '   gl_FragColor = gl_FragColor + gl_FragColor * specColor * specular * texture2D( uSpecularSampler, vUV ) *uSpecularMapPower;\n' +
                                '}\n' +
                                'gl_FragColor.a = alpha;'
                            ]
                        }))
                }
            })()
        })
        .constant('bitmapVertexShaderBlinn', {
            description: "비트맵 블린 버텍스 쉐이더",
            sample: [
                "console.log(Shader.bitmapVertexShaderBlinn);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'bitmapVertexShaderBlinn',
                            attributes: ['vec3 aVertexPosition', 'vec2 aUV', 'vec3 aVertexNormal'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]'],
                            varyings: ['vec2 vUV', 'vec3 vNormal', 'vec3 vPosition'],
                            function: [VertexShader.baseFunction],
                            main: ['' +
                            'mat4 mv = uCameraMatrix * positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]);\n' +
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
            sample: [
                "console.log(Shader.bitmapFragmentShaderBlinn);"
            ],
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
                            '   vec3 halfDir = normalize(lightDir + viewDir);\n' +
                            '   float specAngle = max(dot(halfDir, normal), 0.0);\n' +
                            '   specular = pow(specAngle, 16.0);\n' +
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
            sample: [
                "console.log(Shader.postBaseVertexShader);"
            ],
            get: (function () {
                var cache;
                return function () {
                    return cache || (cache = new Shader({
                            id: 'postBaseVertexShader',
                            attributes: ['vec3 aVertexPosition', 'vec2 aUV'],
                            uniforms: ['mat4 uPixelMatrix', 'mat4 uCameraMatrix', 'vec3 uAffine[3]'],
                            varyings: ['vec2 vUV'],
                            function: [VertexShader.baseFunction],
                            main: ['' +
                            'gl_Position = uPixelMatrix*uCameraMatrix* positionMTX(uAffine[0])*quaternionXYZ(uAffine[1])*scaleMTX(uAffine[2]) *vec4(aVertexPosition, 1.0);\n' +
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