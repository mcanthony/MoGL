var World = (function (makeUtil) {
    var getGL, glSetting, glContext, rectMatrix = Matrix();
    var canvas, context, makeVBO, makeVNBO, makeIBO, makeUVBO, makeProgram, makeTexture, makeFrameBuffer;
    var baseUpdate, baseShaderUpdate, cameraRenderAreaUpdate;
    glSetting = {
        alpha: true,
        depth: true,
        stencil: false,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
    },
    getGL = function (canvas) {
        var gl, keys, i;
        if (glContext) {
            gl = canvas.getContext(glContext, glSetting);
        } else {
            keys = 'experimental-webgl,webgl,webkit-3d,moz-webgl,3d'.split(','), i = keys.length;
            while (i--) {
                if (gl = canvas.getContext(keys[i], glSetting)) {
                    glContext = keys[i];
                    break;
                }
            }
        }
        return gl;
    };
    var renderList = {}, sceneList = [], cvsList = {}, autoSizer = {}, started = {}, gpu = {};
    // 씬에서 이사온놈들
    makeVBO = function makeVBO(gpu, geo, data, stride) {
        var gl, buffer;
        gl = gpu.gl,
        buffer = gpu.vbo[geo];
        if (buffer) return ;
        if (data instanceof Array) {
            data = new Float32Array(data)
        }
        buffer = gl.createBuffer(),
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW),
        buffer.name = geo,
        buffer.type = 'VBO',
        buffer.data = data,
        buffer.stride = stride,
        buffer.numItem = data.length / stride,
        gpu.vbo[geo] = buffer,
        console.log('VBO생성', gpu.vbo[geo]);
    },
    makeVNBO = function makeVNBO(gpu, geo, data, stride) {
        var gl, buffer;
        gl = gpu.gl,
        buffer = gpu.vnbo[geo];
        if (buffer) return ;
        if (data instanceof Array) {
            data = new Float32Array(data)
        }
        buffer = gl.createBuffer(),
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW),
        buffer.name = geo,
        buffer.type = 'VNBO',
        buffer.data = data,
        buffer.stride = stride,
        buffer.numItem = data.length / stride,
        gpu.vnbo[geo] = buffer,
        console.log('VNBO생성', gpu.vnbo[geo]);
    },
    makeIBO = function makeIBO(gpu, geo, data, stride) {
        var gl, buffer;
        gl = gpu.gl,
        buffer = gpu.ibo[geo];
        if (buffer) return ;
        if (data instanceof Array) {
            data = new Uint16Array(data)
        }
        buffer = gl.createBuffer(),
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer),
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW),
        buffer.name = geo,
        buffer.type = 'IBO',
        buffer.data = data,
        buffer.stride = stride,
        buffer.numItem = data.length / stride,
        gpu.ibo[geo] = buffer,
        console.log('IBO생성', gpu.ibo[geo]);
    },
    makeUVBO = function makeUVBO(gpu, geo, data, stride) {
        var gl, buffer;
        gl = gpu.gl,
        buffer = gpu.uvbo[geo];
        if (buffer) return buffer;
        if (data instanceof Array) {
            data = new Float32Array(data)
        }
        buffer = gl.createBuffer(),
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW),
        buffer.name = geo,
        buffer.type = 'UVBO',
        buffer.data = data,
        buffer.stride = stride,
        buffer.numItem = data.length / stride,
        gpu.uvbo[geo] = buffer,
        console.log('UVBO생성', gpu.uvbo[geo]);
    },
    makeProgram = function makeProgram(gpu, name, vSource, fSource) {
        var gl, vShader, fShader, program, i, len, tList;
        gl = gpu.gl,
        vShader = gl.createShader(gl.VERTEX_SHADER),
        fShader = gl.createShader(gl.FRAGMENT_SHADER),
        gl.shaderSource(vShader, vSource.shaderStr),
        gl.compileShader(vShader),
        gl.shaderSource(fShader, fSource.shaderStr),
        gl.compileShader(fShader),

        program = gl.createProgram(),
        gl.attachShader(program, vShader),
        gl.attachShader(program, fShader),
        gl.linkProgram(program),
        vShader.name = vSource.id,
        fShader.name = fSource.id,
        program.name = name;
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('프로그램 쉐이더 초기화 실패!' + this);
        }
        gl.useProgram(program),
        tList = vSource.attributes
        len = tList.length;
        for (i = 0; i < len; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gpu.vbo['null']),
            gl.enableVertexAttribArray(program[tList[i]] = gl.getAttribLocation(program, tList[i])),
            gl.vertexAttribPointer(program[tList[i]], gpu.vbo['null'].stride, gl.FLOAT, false, 0, 0);
        }
        tList = vSource.uniforms,
            i = tList.length;
        while (i--) {
            program[tList[i]] = gl.getUniformLocation(program, tList[i]);
        }
        tList = fSource.uniforms,
            i = tList.length;
        while (i--) {
            program[tList[i]] = gl.getUniformLocation(program, tList[i]);
        }
        gpu.programs[name] = program;
    },
    makeTexture = function makeTexture(gpu, texture) {
        //console.log('이걸재련해야됨', texture.img)
        var gl, glTexture;
        gl = gpu.gl

        //if (gpu.textures[texture]) return ;
        glTexture = gl.createTexture(),
        gl.bindTexture(gl.TEXTURE_2D, glTexture),
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
        gl.generateMipmap(gl.TEXTURE_2D),
        glTexture.textrue = texture,
        gpu.textures[texture] = glTexture,
            //console.log(gpu.textures)
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
    // TODO 일단은 카메라 프레임버퍼 전용
    makeFrameBuffer = function makeFrameBuffer(gpu, camera,cvs) {
        var gl, texture, fBuffer, rBuffer, tArea, cvsW, cvsH, pRatio;
        if (!cvs) return
        cvsW = cvs.width,
        cvsH = cvs.height,
        pRatio = window.devicePixelRatio
        if (camera.renderArea) {
            tArea = camera.renderArea
        } else {
            tArea = [0, 0, cvsW, cvsH]
        }
        gl = gpu.gl,
        fBuffer = gl.createFramebuffer(),
        fBuffer.x = tArea[0], fBuffer.y = tArea[1],
        fBuffer.width = tArea[2] * pRatio > cvsW ? cvsW : tArea[2] * pRatio,
        fBuffer.height = tArea[3] * pRatio > cvsH ? cvsH : tArea[3] * pRatio,
        gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer),

        texture = gl.createTexture(),
        gl.bindTexture(gl.TEXTURE_2D, texture),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fBuffer.width, fBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null),

        rBuffer = gl.createRenderbuffer(),
        gl.bindRenderbuffer(gl.RENDERBUFFER, rBuffer),
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fBuffer.width, fBuffer.height),
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0),
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rBuffer),
        gl.bindTexture(gl.TEXTURE_2D, null),
        gl.bindRenderbuffer(gl.RENDERBUFFER, null),
        gl.bindFramebuffer(gl.FRAMEBUFFER, null),
        gpu.framebuffers[camera] = {
            frameBuffer: fBuffer,
            texture: texture
        };
    },
    baseUpdate = function (gpu) {
        // TODO 기초 버퍼들도 씬이 월드에서 등록될떄 해야겠음..
        makeVBO(gpu, 'null', [0.0, 0.0, 0.0], 3);
        if (!gpu.vbo['_FRAMERECT_']) {
            makeVBO(gpu, '_FRAMERECT_', [
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0
            ], 3),
            makeUVBO(gpu, '_FRAMERECT_', [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ], 2),
            makeIBO(gpu, '_FRAMERECT_', [0, 1, 2, 1, 2, 3], 1);
        }

    },
    baseShaderUpdate = function (gpu, scene) {
        var vS, fS
        vS = scene.vertexShaders
        fS = scene.fragmentShaders
        //console.log('~~~~~~~~~',vS)
        //console.log('~~~~~~~~~',fS)
        makeProgram(gpu, 'color', vS.colorVertexShader, fS.colorFragmentShader);
        makeProgram(gpu, 'wireFrame', vS.wireFrameVertexShader, fS.wireFrameFragmentShader);
        makeProgram(gpu, 'bitmap', vS.bitmapVertexShader, fS.bitmapFragmentShader);
        makeProgram(gpu, 'bitmapGouraud', vS.bitmapVertexShaderGouraud, fS.bitmapFragmentShaderGouraud);
        makeProgram(gpu, 'colorGouraud', vS.colorVertexShaderGouraud, fS.colorFragmentShaderGouraud);
        makeProgram(gpu, 'colorPhong', vS.colorVertexShaderPhong, fS.colorFragmentShaderPhong);
        makeProgram(gpu, 'toonPhong', vS.toonVertexShaderPhong, fS.toonFragmentShaderPhong);
        makeProgram(gpu, 'bitmapPhong', vS.bitmapVertexShaderPhong, fS.bitmapFragmentShaderPhong);
        makeProgram(gpu, 'bitmapBlinn', vS.bitmapVertexShaderBlinn, fS.bitmapFragmentShaderBlinn);
        makeProgram(gpu, 'postBase', vS.postBaseVertexShader, fS.postBaseFragmentShader);
    },
    cameraRenderAreaUpdate = function (self) {
        var p, p2, k, k2;
        p = sceneList[self]
        for (k in p) {
            p2 = p[k].cameras
            for (k2 in p2) {
                var camera, tRenderArea, cvs;
                camera = p2[k2],
                cvs = cvsList[self]
                tRenderArea = camera.renderArea;
                if (tRenderArea) {
                    var tw,th
                    tw = cvs.width,
                    th = cvs.height,
                        camera.renderArea = [
                        typeof tRenderArea[0] == 'string' ? tw * tRenderArea[0].replace('%', '') * 0.01 : tRenderArea[0],
                        typeof tRenderArea[1] == 'string' ? th * tRenderArea[1].replace('%', '') * 0.01 : tRenderArea[1],
                        typeof tRenderArea[2] == 'string' ? tw * tRenderArea[2].replace('%', '') * 0.01 : tRenderArea[2],
                        typeof tRenderArea[3] == 'string' ? th * tRenderArea[3].replace('%', '') * 0.01 : tRenderArea[3],
                    ];
                    camera.renderArea = tRenderArea
                    var wRatio = tRenderArea[2] / cvs.width;
                    var hRatio = tRenderArea[3] / cvs.height;
                    camera.renderArea = [tRenderArea[0], tRenderArea[1], cvs.width * wRatio, cvs.height * hRatio]
                }else{
                    camera.renderArea = [0,0,cvs.width,cvs.height]
                }
                camera.resetProjectionMatrix()
                //TODO 렌더러 반영하겠금 고쳐야겠고..
                // 헉!! 프레임 버퍼가 카메라에 종속되있어!!!!!!
                makeFrameBuffer(gpu[self], camera, cvs);
            }

        }
    };
    return MoGL.extend('World', {
        description:"World는 MoGL의 기본 시작객체로 내부에 다수의 Scene을 소유할 수 있으며, 실제 렌더링되는 대상임.",
        param:[
            "1. id:string - canvasID"
        ],
        sample:[
            "var world = new World('canvasID1);",
            "",
            "// 애니메이션 루프에 인스턴스를 넣는다.",
            "requestAnimationFrame( world.getRenderer(true) );",
            "",
            "// 팩토리함수로도 사용가능",
            "var world2 = World('canvasID2');"
        ],
        exception:[
            "* 'World.constructor:0' - 캔버스 아이디가 없을 때",
            "* 'World.constructor:1' - 존재하지 않는 DOM id일 때",
            "* 'World.constructor:2' - WebGLRenderingContext 생성 실패"
        ],
        value:function World(id) {
            if (!id) this.error(0);
            cvsList[this] = document.getElementById(id);
            // for GPU
            gpu[this] = {
                gl: null,
                vbo: {},
                vnbo: {},
                uvbo: {},
                ibo: {},
                programs: {},
                textures: {},
                framebuffers: {}
            };
            if (!cvsList[this]) this.error(1);
            if (gpu[this].gl = getGL(cvsList[this])) {
                renderList[this] = {},
                sceneList[this] = [],
                autoSizer[this] = null;
            } else {
                this.error(2);
            }
        }
    })
    .method('setAutoSize', {
        description:[
            "world에 지정된 canvas요소에 대해 viewport에 대한 자동 크기 조정을 해주는지 여부.",
            "생성시 기본값은 false"
        ],
        param:[
            "1. isAutoSize:boolean - 자동으로 캔버스의 크기를 조정하는지에 대한 여부."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        sample:[
            "var world = new World('canvasID');",
            "world.isAutoSize(true);"
        ],
        value:function setAutoSize(isAutoSize) {
            var canvas, scenes, self;
            if (isAutoSize) {
                if (!this._autoSizer) {
                    self = this,
                    canvas = cvsList[this],
                    scenes = sceneList[this],
                    autoSizer[this] = function() {
                        //this._pixelRatio = parseFloat(width)/parseFloat(height) > 1 ? window.devicePixelRatio : 1
                        var width, height, pixelRatio, k;
                        width = window.innerWidth,
                        height = window.innerHeight,
                        pixelRatio = window.devicePixelRatio,
                        canvas.width = width * pixelRatio,
                        canvas.height = height * pixelRatio,
                        canvas.style.width = width + 'px',
                        canvas.style.height = height + 'px',
                        canvas._autoSize = isAutoSize,
                        cameraRenderAreaUpdate(self);
                    };
                }
                window.addEventListener('resize', autoSizer[this]),
                window.addEventListener('orientationchange', autoSizer[this]);
                autoSizer[this]();
            } else if (autoSizer[this]) {
                window.removeEventListener('resize', autoSizer[this]),
                window.removeEventListener('orientationchange', autoSizer[this]);
            }
            return this;
        }
    })
    .method('addScene', {
        description:[
            "[Scene](Scene.md)객체를 world에 추가함."
        ],
        param:[
            "1. scene:[Scene](Scene.md) - [Scene](Scene.md)의 인스턴스"
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        exception:[
            "* 'World.addScene:0' - 이미 등록된 Scene.",
            "* 'World.addScene:1' - [Scene](Scene.md)이 아닌 객체를 지정한 경우."
        ],
        sample:[
            "var world = new World('canvasID');",
            "world.addScene( Scene().setId('lobby') );",
            "world.addScene( Scene().setId('room') );"
        ],
        value:function addScene(scene) {
            var tSceneList, i;
            tSceneList = sceneList[this], i = tSceneList.length;
            if (!(scene instanceof Scene )) this.error(1);
            console.log(tSceneList);
            while (i--) {
                if (tSceneList[i] == scene) this.error(0);
            }
            tSceneList.push(scene);
            var p = gpu[this];
            baseUpdate(p),
            baseShaderUpdate(p, scene),
            cameraRenderAreaUpdate(this);
            //scene등록시 현재 갖고 있는 모든 카메라 중 visible이 카메라 전부 등록
            //이후부터는 scene에 카메라의 변화가 생기면 자신의 world에게 알려야함
            return this;
        }
    })
    .method('getScene', {
        description:[
            "sceneId에 해당되는 [Scene](Scene.md)을 얻음."
        ],
        param:[
            "1. sceneId:string - 등록시 scene의 id. 없으면 null을 반환함."
        ],
        ret:"[Scene](Scene.md) - sceneId에 해당되는 [Scene](Scene.md) 인스턴스.",
        sample:[
            "var world = new World('canvasID');",
            "world.addScene( new Scene().setId('lobby') );",
            "var lobby = world.getScene( 'lobby' );"
        ],
        value:function getScene(sceneID) {
            var i, tSceneList;
            tSceneList = sceneList[this],
            i = tSceneList.length;
            if (typeof sceneID === 'undefined') return null;
            while (i--) {
                if (tSceneList[i].id == sceneID) {
                    return tSceneList[i];
                }
            }
            return null;
        }
    })
    .method('getRenderer', {
        description:[
            "setInterval이나 requestAnimationFrame에서 사용될 렌더링 함수를 얻음.",
            "실제로는 본인과 바인딩된 render함수를 반환하고 한 번 반환한 이후는 캐쉬로 잡아둠."
        ],
        param:[
            "1. isRequestAnimationFrame:boolean - 애니메이션프레임용으로 반환하는 경우는 내부에서 다시 requestAnimationFrame을 호출하는 기능이 추가됨."
        ],
        ret:"function - this.render.bind(this) 형태로 본인과 바인딩된 함수를 반환함.",
        sample:[
            "var world = new World('canvasID');",
            "world.addScene( Scene().setId('lobby') );",
            "//인터벌용",
            "setInterval( world.getRenderer() );",
            "//raf용",
            "requestAnimationFrame( world.getRenderer(true) );"
        ],
        value:function getRenderer(isRequestAnimationFrame) {
            var p, self;
            p = renderList[this];
            if (!p) {
                // 없으니까 생성
                p = {}
            }
            self = this;
            if (isRequestAnimationFrame) {
                if (p[1]) return p[1];
                else {
                    return p[1] = function requestAni(currentTime) {
                            self.render(currentTime);
                            started[self.uuid] = requestAnimationFrame(p[1]);
                    }
                }
            } else {
                if (p[0]) return p[0];
                else {
                    p[0] = function intervalAni(currentTime) {
                        self.render(currentTime);
                    }
                    return p[0];
                }
            }
        }
    })
    .method('start', {
        description:[
            "requestAnimationFrame을 이용해 자동으로 render를 호출함."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        sample:[
            "var world = new World('canvasID');",
            "world.start();"
        ],
        value:function start() {
            var renderFunc = this.getRenderer(1)
            started[this.uuid] = requestAnimationFrame(renderFunc);
            return this;
        }
    })
    .method('stop', {
        description:[
            "start시킨 자동 render를 정지함."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        sample:[
            "var world = new World('canvasID');",
            "world.start();",
            "world.stop();"
        ],
        value:function stop() {
            cancelAnimationFrame(started[this.uuid]);
            return this;
        }
    })
    .method('removeScene', {
        description:[
            "[Scene](Scene.md)객체를 world에서 제거함.",
            "[Scene](Scene.md)을 제거하면 관련된 카메라가 지정된 render도 자동으로 제거됨."
        ],
        param:[
            "1. sceneId:string - [Scene](Scene.md)객체에 정의된 id."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        exception:[
            "* 'World.removeScene:0' - id에 해당되는 [Scene](Scene.md)이 존재하지 않음."
        ],
        sample:[
            "// Scene과 Camara생성 및 등록",
            "var lobby = new Scene();",
            "lobby.addChild( Camera() );",
            "",
            "// Scene 등록",
            "var world = new World('canvasID');",
            "world.addScene( lobby.setId('lobby') );",
            "",
            "// Scene 제거",
            "world.removeScene( 'lobby' );"
        ],
        value:function removeScene(sceneID) {
            var i, tSceneList;
            tSceneList = sceneList[this],
            i = tSceneList.length;
            if (typeof sceneID === 'undefined') return null;
            while (i--) {
                if (tSceneList[i].id == sceneID) {
                    tSceneList.splice(i, 1),
                    console.log(sceneList);
                    return this;
                }
            }
            this.error('0');
        }
    })
    .method('render', {
        description:[
            "현재 화면을 그림."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        sample:[
            "// Scene과 Camara생성 및 등록",
            "var lobby = new Scene();",
            "lobby.addChild( Camera() );",
            "",
            "// Scene 등록",
            "var world = new World('canvasID');",
            "world.addScene( lobby.setId('lobby') );",
            "",
            "// 실제 출력",
            "world.render();"
        ],
        value:(function render(){
            var i,i2, j, k, len = 0;
            var f3 = new Float32Array(3), f4 = new Float32Array(4);
            var tScene, tSceneList, tCameraList, tCamera, tGPU, tGL, tChildren,tChildrenArray;
            var tCvs, tCvsW, tCvsH;
            var tItem, tMaterial;
            var tProgram, tCulling, tVBO, tVNBO, tUVBO, tIBO, tDiffuseID, tFrameBuffer, tShading;
            var pProgram, pCulling, pVBO, pVNBO, pUVBO, pIBO, pDiffuseID;
            var tMatUUID;

            var privateChildren;
            var privateChildrenArray;
            var priGeo;
            var priMat;
            var priCull;

            var priMatColor;
            var priMatWireFrame;
            var priMatWireFrameColor;
            var priMatShading;
            var priMatLambert;
            var priMatDiffuse;

            var tGeo;
            var tItemUUID;
            var dLite, useNormalBuffer, useTexture;
            var tColor;

            privateChildren = $getPrivate('Scene', 'children'),
            privateChildrenArray = $getPrivate('Scene', 'childrenArray'),
            priGeo = $getPrivate('Mesh', 'geometry'),
            priMat = $getPrivate('Mesh', 'material'),
            priCull = $getPrivate('Mesh', 'culling'),
            priMatColor = $getPrivate('Material', 'color'),
            priMatWireFrame = $getPrivate('Material', 'wireFrame'),
            priMatWireFrameColor = $getPrivate('Material', 'wireFrameColor'),
            priMatShading = $getPrivate('Material', 'shading'),
            priMatLambert = $getPrivate('Material', 'lambert'),
            priMatDiffuse = $getPrivate('Material', 'diffuse');

            return function(currentTime) {
                len = 0,
                pProgram = null,
                pCulling = null,
                pVBO = null,
                pVNBO = null,
                pUVBO = null,
                pIBO = null,
                pDiffuseID = null,
                tCvs = cvsList[this.uuid],
                tSceneList = sceneList[this.uuid],
                tGPU = gpu[this.uuid],
                tGL = tGPU.gl,
                tCvsW = tCvs.width,
                tCvsH = tCvs.height,
                i = tSceneList.length;

                this.dispatch(World.renderBefore, currentTime);
                
                while (i--) {
                    tScene = tSceneList[i]
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
                    //Scene 업데이트 사항 반영
                    j = tScene.updateList.mesh.length;
                    while (j--) {
                        // 버퍼 업데이트
                        var updateItem, geo;
                        updateItem = tScene.updateList.mesh[j],
                        geo = updateItem.geometry;
                        if (geo) {
                            if (!tGPU.vbo[geo]) {
                                makeVBO(tGPU, geo, geo.position, 3),
                                makeVNBO(tGPU, geo, geo.normal, 3),
                                makeUVBO(tGPU, geo, geo.uv, 2),
                                makeIBO(tGPU, geo, geo.index, 1);
                            }
                        }
                    }
                    j = tScene.updateList.material.length;
                    while (j--) {
                        makeTexture(tGPU, tScene.updateList.material[j]);
                    }
                    if (tScene.updateList.camera.length) cameraRenderAreaUpdate(this);
                    tScene.updateList.mesh.length = 0,
                    tScene.updateList.material.length = 0,
                    tScene.updateList.camera.length = 0,
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
                    tCameraList = tScene.cameras;
                    for (k in tCameraList) len++;
                    for (k in tCameraList) {
                        tCamera = tCameraList[k];
                        if (tCamera.visible) {
                            if (len > 1) {
                                tFrameBuffer = tGPU.framebuffers[tCamera.uuid].frameBuffer;
                                tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer);
                                tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height);
                            } else {
                                tGL.viewport(0, 0, tCvsW, tCvsH);
                            }
                            tChildren = privateChildren[tScene.uuid];
                            tChildrenArray = privateChildrenArray[tScene.uuid];

                            tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LESS),
                            // TODO 이놈도 상황에 따라 캐쉬해야겠군
                            tGL.enable(tGL.BLEND),
                            tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA),

                            //tGL.enable(tGL.SCISSOR_TEST);
                            //tGL.scissor(0, 0,  tCvsW, tCvsH);

                            // 라이팅 세팅
                            dLite = [0, -1, -1],
                            tColor = tCamera.backgroundColor,
                            tGL.clearColor(tColor[0], tColor[1], tColor[2], tColor[3]),
                            tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                            var tProjectionMtx = tCamera.projectionMatrix.raw;
                            var tCameraMtx = tCamera.matrix.raw;
                            for (k in tGPU.programs) {
                                tProgram = tGPU.programs[k],
                                tGL.useProgram(tProgram),
                                //tCamera.cvs = tCvs
                                tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, tProjectionMtx),
                                tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, tCameraMtx);
                                if(tProgram['uDLite']) {
                                    tGL.uniform3fv(tProgram.uDLite, dLite);
                                }
                            }
                            tItem = tMaterial = tProgram = tVBO = tIBO = null;

                            // 대상 씬의 차일드 루프
                            i2 = tChildrenArray.length;
                            while(i2--){
                                tItem = tChildrenArray[i2],
                                tItemUUID = tItem.uuid,
                                tGeo = priGeo[tItemUUID].uuid,
                                tVBO = tGPU.vbo[tGeo],
                                tVNBO = tGPU.vnbo[tGeo],
                                tUVBO = tGPU.uvbo[tGeo],
                                tIBO = tGPU.ibo[tGeo],
                                tMaterial = priMat[tItemUUID],
                                tCulling = priCull[tItemUUID];

                                if (tCulling != pCulling) {
                                    if (tCulling == Mesh.cullingNone) tGL.disable(tGL.CULL_FACE);
                                    else if (tCulling == Mesh.cullingBack) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CCW);
                                    else if (tCulling == Mesh.cullingFront) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CW);
                                }

                                useNormalBuffer = 0,
                                useTexture = 0;

                                // 쉐이딩 결정
                                tMatUUID = tMaterial.uuid,
                                tShading = priMatShading[tMatUUID];
                                if(priMatDiffuse[tMatUUID]){
                                    useTexture = 1;
                                }
                                switch (tShading) {
                                    case  Shading.none:
                                        if(useTexture){
                                            tProgram = tGPU.programs['bitmap'];
                                        }else{
                                            tProgram = tGPU.programs['color'];
                                        }
                                        break;
                                    case  Shading.gouraud:
                                        if(useTexture){
                                            tProgram = tGPU.programs['bitmapGouraud'];
                                        }else{
                                            tProgram = tGPU.programs['colorGouraud'];
                                        }
                                        useNormalBuffer = 1;
                                        break;
                                    case  Shading.toon:
                                        tProgram = tGPU.programs['toonPhong'];
                                        useNormalBuffer = 1;
                                        break;
                                    case  Shading.phong :
                                        if (useTexture) {
                                            tProgram = tGPU.programs['bitmapPhong'];
                                        } else {
                                            tProgram = tGPU.programs['colorPhong'];
                                        }
                                        useNormalBuffer = 1;
                                        break;
                                    case  Shading.blinn :
                                        tProgram = tGPU.programs['bitmapBlinn'],
                                        //console.log('들어왔다!')
                                        useNormalBuffer = 1;
                                        break;
                                }
                                // 쉐이딩 변경시 캐쉬 삭제
                                if (pProgram != tProgram) {
                                    pProgram = null , pVBO = null, pVNBO = null, pUVBO = null, pIBO = null,
                                    tGL.useProgram(tProgram);
                                }

                                // 정보 밀어넣기
                                if (tVBO != pVBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                    tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                                }
                                tColor = priMatColor[tMatUUID],
                                tGL.uniform4fv(tProgram.uColor, tColor);
                                if (useNormalBuffer) {
                                    if (tVNBO != pVNBO) {
                                        tGL.bindBuffer(tGL.ARRAY_BUFFER, tVNBO),
                                        tGL.vertexAttribPointer(tProgram.aVertexNormal, tVNBO.stride, tGL.FLOAT, false, 0, 0);
                                    }
                                    tGL.uniform1f(tProgram.uLambert, priMatLambert[tMatUUID]);
                                }
                                // 텍스쳐 세팅
                                if (useTexture) {
                                    if (tUVBO != pUVBO) {
                                        tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                                        tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0);
                                    }
                                    var imsi = priMatDiffuse[tMatUUID];
                                    if (imsi.length) {
                                        //tGL.activeTexture(tGL.TEXTURE0);
                                        tDiffuseID = tGPU.textures[imsi[imsi.length - 1].tex.uuid];
                                        if (tDiffuseID != pDiffuseID) {
                                            tGL.bindTexture(tGL.TEXTURE_2D, tDiffuseID);
                                        }
                                        tGL.uniform1i(tProgram.uSampler, 0);
                                    }
                                }

                                f3[0] = tItem.rotateX, f3[1] = tItem.rotateY, f3[2] = tItem.rotateZ,
                                tGL.uniform3fv(tProgram.uRotate, f3),
                                f3[0] = tItem.x, f3[1] = tItem.y, f3[2] = tItem.z,
                                tGL.uniform3fv(tProgram.uPosition, f3),
                                f3[0] = tItem.scaleX, f3[1] = tItem.scaleY, f3[2] = tItem.scaleZ,
                                tGL.uniform3fv(tProgram.uScale, f3),
                                tIBO != pIBO ? tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO) : 0,
                                tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);

                                //와이어프레임 그리기
                                if (priMatWireFrame[tMatUUID]) {
                                    tGL.enable(tGL.DEPTH_TEST),
                                    tGL.depthFunc(tGL.LEQUAL),
                                    tProgram = tGPU.programs['wireFrame'],
                                    tGL.useProgram(tProgram),
                                    tVBO != pVBO ? tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO) : 0,
                                    tVBO != pVBO ? tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0) : 0,
                                    f3[0] = tItem.rotateX, f3[1] = tItem.rotateY, f3[2] = tItem.rotateZ,
                                    tGL.uniform3fv(tProgram.uRotate, f3),
                                    f3[0] = tItem.x, f3[1] = tItem.y, f3[2] = tItem.z,
                                    tGL.uniform3fv(tProgram.uPosition, f3),
                                    f3[0] = tItem.scaleX, f3[1] = tItem.scaleY, f3[2] = tItem.scaleZ,
                                    tGL.uniform3fv(tProgram.uScale, f3),
                                    tColor = priMatWireFrameColor[tMatUUID],
                                    tGL.uniform4fv(tProgram.uColor, tColor),
                                    tGL.drawElements(tGL.LINES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0),
                                    tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LESS);
                                }

                                pProgram = tProgram , pCulling = tCulling,
                                pVBO = tVBO, pVNBO = tVNBO, pUVBO = tUVBO, pIBO = tIBO, pDiffuseID = tDiffuseID;
                            }
                            //gl.bindTexture(gl.TEXTURE_2D, scene._glFREAMBUFFERs[camera.uuid].texture);
                            //gl.bindTexture(gl.TEXTURE_2D, null);
                            if (len > 1) {
                                tGL.bindFramebuffer(tGL.FRAMEBUFFER, null);
                                pProgram = null , pVBO = null, pVNBO = null, pUVBO = null, pIBO = null;
                            }

                        }
                    }
                }
                // TODO 아래는 아직 다 못옮겨씀
                // 프레임버퍼를 모아서 찍어!!!
                if (len > 1) {
                    tGL.viewport(0, 0, tCvs.width, tCvs.height);
                    tGL.clearColor(0, 0, 0, 1);
                    tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LEQUAL);
                    //tGL.disable(tGL.DEPTH_TEST);
                    tGL.enable(tGL.BLEND);
                    tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA);
                    tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                    tVBO = tGPU.vbo['_FRAMERECT_'],
                    tUVBO = tGPU.uvbo['_FRAMERECT_'],
                    tIBO = tGPU.ibo['_FRAMERECT_'],
                    tProgram = tGPU.programs['postBase'];
                    if (!tVBO) return;
                    tGL.useProgram(tProgram);
                    tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, [
                        2 / tCvs.clientWidth, 0, 0, 0,
                        0, -2 / tCvs.clientHeight, 0, 0,
                        0, 0, 0, 0,
                        -1, 1, 0, 1
                    ]);
                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                    tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0),
                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                    tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0),
                    tGL.uniform3fv(tProgram.uRotate, [0, 0, 0]),
                    tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, rectMatrix.raw);

                    for (k in tCameraList) {
                        tCamera = tCameraList[k];
                        if (tCamera.visible) {
                            tFrameBuffer = tGPU.framebuffers[tCamera.uuid].frameBuffer;
                            tGL.uniform1i(tProgram.uFXAA, tCamera.antialias);
                            if (tCamera.antialias) {
                                if (tCamera.renderArea) tGL.uniform2fv(tProgram.uTexelSize, [1 / tFrameBuffer.width, 1 / tFrameBuffer.height]);
                                else tGL.uniform2fv(tProgram.uTexelSize, [1 / tCvs.width, 1 / tCvs.height]);
                            }
                            f3[0] = tFrameBuffer.x + tFrameBuffer.width / 2 / window.devicePixelRatio, f3[1] = tFrameBuffer.y + tFrameBuffer.height / 2 / window.devicePixelRatio , f3[2] = 0;
                            tGL.uniform3fv(tProgram.uPosition, f3),
                            f3[0] = tFrameBuffer.width / 2 / window.devicePixelRatio, f3[1] = tFrameBuffer.height / 2 / window.devicePixelRatio, f3[2] = 1,
                            tGL.uniform3fv(tProgram.uScale, f3),
                            //tGL.activeTexture(tGL.TEXTURE0),
                            tGL.bindTexture(tGL.TEXTURE_2D, tGPU.framebuffers[tCamera.uuid].texture),
                            tGL.uniform1i(tProgram.uSampler, 0),
                            tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO),
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);
                        }
                    }

                }
                this.dispatch(World.renderAfter, currentTime);
                //tGL.flush();
                //tGL.finish()
            }
        })()
    })
    .constant('renderBefore', 'WORLD_RENDER_BEFORE')
    .constant('renderAfter', 'WORLD_RENDER_AFTER')
    .build();
})(makeUtil);
