var World = (function (makeUtil) {
    'use strict';
    var getGL, glSetting, glContext, rectMatrix = Matrix();
    var makeVBO, makeVNBO, makeIBO, makeUVBO, makeProgram, makeTexture, makeFrameBuffer;
    var baseUpdate, baseShaderUpdate, cameraRenderAreaUpdate;

    var tProjectionMtx
    var tCameraMtx
    glSetting = {
        alpha: true,
        depth: true,
        stencil: false,
        antialias: window.devicePixelRatio == 1 ? true : false,
        premultipliedAlpha: false,
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
        if(gl) gl.getExtension("OES_element_index_uint");
        return gl;
    };
    var renderList = {}, sceneList = [], cvsList = {}, autoSizer = {}, mouse = {}, started = {}, gpu = {};
    // 씬에서 이사온놈들
    makeVBO = makeUtil.makeVBO,
    makeVNBO = makeUtil.makeVNBO,
    makeIBO = makeUtil.makeIBO,
    makeUVBO = makeUtil.makeUVBO,
    makeProgram = makeUtil.makeProgram,
    makeTexture = makeUtil.makeTexture,
    // TODO 일단은 카메라 프레임버퍼 전용
    makeFrameBuffer = makeUtil.makeFrameBuffer,
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
        makeProgram(gpu, 'mouse', vS.mouseVertexShader, fS.colorFragmentShader);
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
                var camera, tRenderArea, cvs,pixelRatio;
                camera = p2[k2],
                cvs = cvsList[self]
                tRenderArea = camera.renderArea;
                pixelRatio = pRatio
                if (tRenderArea && !camera.renderArea.byAutoArea) {
                    var tw,th
                    tw = cvs.width,
                    th = cvs.height
                    var wRatio = tRenderArea[2] / tw;
                    var hRatio = tRenderArea[3] / th;
                    /*
                    tRenderArea = [
                        typeof tRenderArea[0] == 'string' ? tw * tRenderArea[0].replace('%', '') * 0.01 : tRenderArea[0],
                        typeof tRenderArea[1] == 'string' ? th * tRenderArea[1].replace('%', '') * 0.01 : tRenderArea[1],
                        typeof tRenderArea[2] == 'string' ? tw * tRenderArea[2].replace('%', '') * 0.01 : tRenderArea[2],
                        typeof tRenderArea[3] == 'string' ? th * tRenderArea[3].replace('%', '') * 0.01 : tRenderArea[3]
                    ];
                    camera.renderArea = [tRenderArea[0], tRenderArea[1], tw * wRatio, th * hRatio]
                    */
                    tRenderArea[0] = typeof tRenderArea[0] == 'string' ? tw * tRenderArea[0].replace('%', '') * 0.01 : tRenderArea[0],
                    tRenderArea[1] = typeof tRenderArea[1] == 'string' ? th * tRenderArea[1].replace('%', '') * 0.01 : tRenderArea[1],
                    tRenderArea[2] = tw * wRatio,
                    tRenderArea[3] = th * hRatio,
                    camera.renderArea.byAutoArea=false
                }else{
                    //camera.renderArea = [0,0,cvs.width,cvs.height]
                    if (tRenderArea) {
                        tRenderArea[0] = tRenderArea[1] = 0,
                        tRenderArea[2] = cvs.width, tRenderArea[3] = cvs.height;
                    } else {
                        camera.renderArea = [0,0,cvs.width,cvs.height];
                    }
                    camera.renderArea.byAutoArea = true
                }
                camera.resetProjectionMatrix()
                tProjectionMtx = camera.projectionMatrix.raw;
                tCameraMtx = camera.matrix.raw;
                //TODO 렌더러 반영하겠금 고쳐야겠고..
                // 헉!! 프레임 버퍼가 카메라에 종속되있어!!!!!!
                makeFrameBuffer(gpu[self], camera, cvs);
            }

        }
    };
    var pRatio =  window.devicePixelRatio
    return MoGL.extend('World', {
        description:"World는 MoGL의 기본 시작객체로 내부에 다수의 Scene을 소유할 수 있으며, 실제 렌더링되는 대상임.",
        param:[
            "id:string - canvasID"
        ],
        sample:[
            "var world = new World('canvasID1);",
            "",
            "// 애니메이션 루프에 인스턴스를 넣는다.",
            "requestAnimationFrame(world.getRenderer(true));",
            "",
            "// 팩토리함수로도 사용가능",
            "var world2 = World('canvasID2');"
        ],
        exception:[
            "* 'World.constructor:0' - 캔버스 아이디가 없을 때",
            "* 'World.constructor:1' - 존재하지 않는 DOM id일 때",
            "* 'World.constructor:2' - WebGLRenderingContext 생성 실패"
        ],
        value:(function(){
            var i, i2, i3, j, k, k2, len = 0;
            var f3 = new Float32Array(3);
            var tScene, tSceneList, tCameraList, tCamera, tGPU, tGL, tChildren, tChildrenArray;
            var tCvs, tCvsW, tCvsH;
            var tUUID,tItem, tMaterial, tItemUUID, tMatUUID;
            var tProgram, tCulling, tVBO, tVNBO, tUVBO, tIBO, tDiffuse, tNormal, tSpecular, tFrameBuffer, tShading;
            var pProgram, pCulling, pVBO, pVNBO, pUVBO, pIBO, pDiffuse, pNormal, pSpecular;

            var privateChildren, privateChildrenArray,priCameraLength;
            var priGeo, priMat;
            var priCull;
            // 재질관련 private property
            var priMatColor;
            var priMatWireFrame, priMatWireFrameColor;
            var priMatShading, priMatLambert, priMatSpecularPower, priTexSpecularMapPower, priMatSpecularColor, priTexNormalMapPower;
            var priMatDiffuseMaps;
            var priMatNormalMaps;
            var priMatSpecularMaps;
            var priMatSheetMode
            var priGeoVertexCount
            var priPickingColors;
            var priPickingMeshs
            var priBillBoard

            var tGeo;
            var tDiffuseMaps, tNormalMaps, tSpecularMaps;
            var tColor;
            var baseLightRotate;
            var useNormalBuffer, useTexture;

            privateChildren = $getPrivate('Scene', 'children'),
            privateChildrenArray = $getPrivate('Scene', 'childrenArray'),
            priCameraLength = $getPrivate('Scene', 'cameraLength'),
            priGeo = $getPrivate('Mesh', 'geometry'),
            priMat = $getPrivate('Mesh', 'material'),
            priPickingColors = $getPrivate('Mesh', 'pickingColors'),
            priPickingMeshs = $getPrivate('Mesh', 'pickingMeshs'),
            priCull = $getPrivate('Mesh', 'culling'),
            priMatColor = $getPrivate('Material', 'color'),
            priMatWireFrame = $getPrivate('Material', 'wireFrame'),
            priMatWireFrameColor = $getPrivate('Material', 'wireFrameColor'),
            priMatShading = $getPrivate('Material', 'shading'),
            priMatLambert = $getPrivate('Material', 'lambert'),
            priMatSpecularPower = $getPrivate('Material', 'specularPower'),
            priMatSpecularColor = $getPrivate('Material', 'specularColor'),
            priMatDiffuseMaps = $getPrivate('Material', 'diffuse'),
            priMatNormalMaps = $getPrivate('Material', 'normal'),
            priMatSpecularMaps = $getPrivate('Material', 'specular'),
            priMatSheetMode = $getPrivate('Material', 'sheetMode'),
            priTexSpecularMapPower = $getPrivate('Texture', 'specularMapPower'),
            priTexNormalMapPower = $getPrivate('Texture', 'normalMapPower'),
            priGeoVertexCount = $getPrivate('Geometry', 'vertexCount')
            priBillBoard = $getPrivate('Mesh', 'billBoard')

            var priListener = $getPrivate('MoGL', 'listener')

            var currentMouse = new Uint8Array(4)
            currentMouse[3] = 1
            var currentMouseItem, oldMouseItem, checkMouse = true
            var totalVertex = 0
            var mouseObj = {}
            var updateTex
            var sheetOffset = [], pM=[], rM = [0, 0, 0], uTS = []
            var pickLength;
            var tMouse
            var mouseColor
            var render = function render(currentTime) {

                tUUID = this.uuid,
                pProgram = pCulling = null,
                pVBO = pVNBO = pUVBO = pIBO = pDiffuse = null,
                tCvs = cvsList[tUUID], tSceneList = sceneList[tUUID],
                tGPU = gpu[tUUID], tGL = tGPU.gl,
                tCvsW = tCvs.width, tCvsH = tCvs.height,
                tDiffuseMaps = tNormalMaps = null,
                totalVertex = 0;
                
                var i = tSceneList.length, j, k, k2, i2, list, curr;
                var pShading, sheetInfo;
                
                tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LEQUAL), 
                tGL.enable(tGL.BLEND), tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA);

                //this.dispatch(World.renderBefore, currentTime,totalVertex),
                if(priListener[tUUID] && priListener[tUUID]['WORLD_RENDER_BEFORE']) priListener[tUUID]['WORLD_RENDER_BEFORE'][0].f(currentTime)
                while (i--) {
                    tScene = tSceneList[i];
                    len = priCameraLength[tScene.uuid]
                    //버퍼 업데이트
                    list = tScene.updateList.geometry;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[j];
                            if (!tGPU.vbo[tGeo]) {
                                makeVBO(tGPU, curr, curr.position, 3),
                                makeVNBO(tGPU, curr, curr.normal, 3),
                                makeUVBO(tGPU, curr, curr.uv, 2),
                                makeIBO(tGPU, curr, curr.index, 1);
                            }
                        }
                        list.length = 0;
                    }
                    list = tScene.updateList.texture;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[j].tex
                            //if(!updateTex && tGPU.textures[updateTex.uuid] != updateTex.img) makeTexture(tGPU, updateTex.uuid,updateTex.img);
                            makeTexture(tGPU, curr.uuid, curr.img)
                        }
                        list.length = 0;
                    }
                    if (tScene.updateList.camera.length) cameraRenderAreaUpdate(tUUID);
                    tScene.updateList.camera.length = 0,
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
                    tCameraList = tScene.cameras,
                    baseLightRotate = tScene.baseLightRotate;
                    for (k in tCameraList) {
                        tCamera = tCameraList[k];
                        if (!tCamera.visible) continue;
                        tFrameBuffer = tGPU.framebuffers[tCamera.uuid].frameBuffer,
                        tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer),
                        tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height)

                        for (k2 in tGPU.programs) {
                            tGL.useProgram(tProgram = tGPU.programs[k2]),
                            tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, tProjectionMtx),
                            tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, tCameraMtx);
                            if (tProgram['uDLite']) tGL.uniform3fv(tProgram.uDLite, baseLightRotate);
                        }

                        tProgram = tGPU.programs['mouse'],
                        tGL.useProgram(tProgram),
                        useNormalBuffer = useTexture = pickLength = 0;

                        if(checkMouse = !checkMouse){
                            for (k2 in priPickingMeshs) {
                                pickLength++,
                                tItem = priPickingMeshs[k2].mesh,
                                tItemUUID = tItem.uuid,
                                tGeo = priGeo[tItemUUID].uuid,
                                tVBO = tGPU.vbo[tGeo],
                                tIBO = tGPU.ibo[tGeo],
                                tCulling = priCull[tItemUUID];
                                if (tVBO != pVBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                    tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                                }
                                tGL.uniform4fv(tProgram.uColor, priPickingColors[tItemUUID]),
                                f3[0] = tItem.rotateX, f3[1] = tItem.rotateY, f3[2] = tItem.rotateZ,
                                tGL.uniform3fv(tProgram.uRotate, f3),
                                f3[0] = tItem.x, f3[1] = tItem.y, f3[2] = tItem.z,
                                tGL.uniform3fv(tProgram.uPosition, f3),
                                f3[0] = tItem.scaleX, f3[1] = tItem.scaleY, f3[2] = tItem.scaleZ,
                                tGL.uniform3fv(tProgram.uScale, f3),
                                tIBO != pIBO ? tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO) : 0,
                                tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0),
                                pVBO = tVBO, pIBO = tIBO;
                            }
                            if (pickLength && (tMouse = mouse[tUUID]) && tMouse.x) {
                                tGL.readPixels(tMouse.x, tMouse.y, 1, 1, tGL.RGBA , tGL.UNSIGNED_BYTE, currentMouse),
                                currentMouseItem = priPickingMeshs[''+currentMouse[0]+currentMouse[1]+currentMouse[2]+'255'],
                                mouseObj.x = tMouse.x,
                                mouseObj.y = tMouse.y,
                                mouseObj.z = 0;

                                if (currentMouseItem) mouseObj.target = currentMouseItem.mesh;
                                if (tMouse.down && currentMouseItem ) {
                                    currentMouseItem.mesh.dispatch(Mesh.down, mouseObj);
                                } else if (tMouse.up && currentMouseItem) {
                                    currentMouseItem.mesh.dispatch(Mesh.up, mouseObj),
                                    tMouse.x = null;
                                } else  if (currentMouseItem != oldMouseItem) {
                                    if (oldMouseItem) oldMouseItem.mesh.dispatch(Mesh.out, mouseObj);
                                    if (currentMouseItem) currentMouseItem.mesh.dispatch(Mesh.over, mouseObj);
                                    oldMouseItem = currentMouseItem;
                                } else if (oldMouseItem && tMouse.move) {
                                    oldMouseItem.mesh.dispatch(Mesh.move, mouseObj);
                                }

                                if (tMouse.down) tMouse.down = false;
                                if (tMouse.move) tMouse.move = false;
                                if (tMouse.up) tMouse.up = false;

                                tGL.clearColor(0,0,0,0),
                                tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                            }
                        }

                        tGL.bindFramebuffer(tGL.FRAMEBUFFER, null);

                        tColor = tCamera.backgroundColor,
                        tGL.clearColor(tColor[0], tColor[1], tColor[2], tColor[3]),
                        tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);

                        //카메라설정
                        if (len > 1) {
                            tFrameBuffer = tGPU.framebuffers[tCamera.uuid].frameBuffer;
                            tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer);
                            tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height);
                        } else {

                        }

                        // 대상 씬의 차일드 루프
                        tChildren = privateChildren[tScene.uuid],
                        tChildrenArray = privateChildrenArray[tScene.uuid],
                        i2 = tChildrenArray.length;
                        while(i2--){
                            tItem = tChildrenArray[i2],
                            tItemUUID = tItem.uuid,
                            //컬링결정
                            tCulling = priCull[tItemUUID];
                            if (tCulling != pCulling) {
                                if (tCulling == Mesh.cullingNone) tGL.disable(tGL.CULL_FACE);
                                else if (tCulling == Mesh.cullingBack) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CCW);
                                else if (tCulling == Mesh.cullingFront) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CW);
                            }
                            // 쉐이딩 결정
                            tMaterial = priMat[tItemUUID],
                            tShading = priMatShading[tMatUUID = tMaterial.uuid],
                            tDiffuseMaps = priMatDiffuseMaps[tMatUUID];
                            if (pShading != tShading) {
                                useTexture = tDiffuseMaps ? 1 : 0,
                                useNormalBuffer = 1,
                                pShading = tShading,
                                tProgram = 
                                    pShading == Shading.phong ? tGPU.programs[useTexture ? 'bitmapPhong' : 'colorPhong'] :
                                    pShading == Shading.gouraud ? tGPU.programs[useTexture ? 'bitmapGouraud' : 'colorGouraud'] :
                                    pShading == Shading.toon ? tGPU.programs['toonPhong'] :
                                    pShading == Shading.blinn ? tGPU.programs['bitmapBlinn'] :
                                    (useNormalBuffer = 0, tGPU.programs[useTexture ? 'bitmap' : 'color']),
                                pVBO = pVNBO = pUVBO = pIBO = pDiffuse = pNormal = pSpecular =  null,
                                tGL.useProgram(tProgram);
                            }
                            //총정점수계산
                            totalVertex += priGeoVertexCount[tGeo = priGeo[tItemUUID].uuid],
                            //정점버퍼
                            tVBO = tGPU.vbo[tGeo];
                            if (tVBO != pVBO) {
                                tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                            }
                            if (useNormalBuffer) {
                                tVNBO = tGPU.vnbo[tGeo];
                                if (tVNBO != pVNBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVNBO),
                                    tGL.vertexAttribPointer(tProgram.aVertexNormal, tVNBO.stride, tGL.FLOAT, false, 0, 0);
                                }
                                tGL.uniform1f(tProgram.uLambert, priMatLambert[tMatUUID]);
                            }
                            //색상
                            tColor = priMatColor[tMatUUID],
                            tGL.uniform4fv(tProgram.uColor, tColor);
                            //텍스쳐
                            if (useTexture) {
                                //스프라이트
                                sheetInfo = priMatSheetMode[tMatUUID];
                                if (sheetInfo.enable) {
                                    sheetInfo.currentGap += 16;
                                    if (sheetInfo.currentGap > sheetInfo.cycle) sheetInfo.frame++, sheetInfo.currentGap = 0;
                                    if (sheetInfo.frame == sheetInfo.wNum * sheetInfo.hNum) sheetInfo.frame = 0;
                                    sheetOffset[0] = 1 / sheetInfo.wNum,
                                    sheetOffset[1] = 1 / sheetInfo.hNum,
                                    sheetOffset[2] = sheetInfo.frame % sheetInfo.wNum,
                                    sheetOffset[3] = Math.floor(sheetInfo.frame / sheetInfo.wNum),
                                    tGL.uniform4fv(tProgram.uSheetOffset, sheetOffset),
                                    tGL.uniform1i(tProgram.uSheetMode, 1);
                                }else{
                                    tGL.uniform1i(tProgram.uSheetMode, 0);
                                }
                                //UV설정
                                tUVBO = tGPU.uvbo[tGeo];
                                if (tUVBO != pUVBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                                    tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0);
                                }
                                //디퓨즈
                                tGL.activeTexture(tGL.TEXTURE0);
                                tDiffuse = tGPU.textures[tDiffuseMaps[tDiffuseMaps.length - 1].tex.uuid];
                                if (tDiffuse != pDiffuse) tGL.bindTexture(tGL.TEXTURE_2D, tDiffuse);
                                tGL.uniform1i(tProgram.uSampler, 0),
                                tGL.uniform1f(tProgram.uSpecularPower, priMatSpecularPower[tMatUUID]),
                                tGL.uniform4fv(tProgram.uSpecularColor, priMatSpecularColor[tMatUUID]);
                            }
                            
                            //노말
                            if (tNormalMaps = priMatNormalMaps[tMatUUID] ) {
                                tGL.activeTexture(tGL.TEXTURE1),
                                tNormal = tGPU.textures[tNormalMaps[tNormalMaps.length - 1].tex.uuid]
                                tNormal != pNormal ? tGL.bindTexture(tGL.TEXTURE_2D, tNormal) : 0,
                                tGL.uniform1i(tProgram.uNormalSampler, 1),
                                tGL.uniform1i(tProgram.useNormalMap, true),
                                //tGL.uniform1f(tProgram.uNormalPower,priTexNormalMapPower[tNormalMaps[tNormalMaps.length - 1].tex.uuid])
                                tGL.uniform1f(tProgram.uNormalPower,1.0)
                            }else{
                                tGL.uniform1i(tProgram.useNormalMap, false);
                            }
                            //스페큘러
                            if(tSpecularMaps = priMatSpecularMaps[tMatUUID]){
                                tGL.activeTexture(tGL.TEXTURE2),
                                tSpecular = tGPU.textures[tSpecularMaps[tSpecularMaps.length - 1].tex.uuid]
                                tSpecular != pSpecular ? tGL.bindTexture(tGL.TEXTURE_2D, tSpecular) : 0,
                                tGL.uniform1i(tProgram.uSpecularSampler, 2),
                                tGL.uniform1i(tProgram.useSpecularMap, true),
                                //tGL.uniform1f(tProgram.uSpecularMapPower, priTexSpecularMapPower[tSpecularMaps[tSpecularMaps.length - 1].tex.uuid]);
                                tGL.uniform1f(tProgram.uSpecularMapPower, 1.5);
                            }else{
                                tGL.uniform1i(tProgram.useSpecularMap, false);
                            }
                            tGL.uniform3fv(tProgram.uRotate, (f3[0] = tItem.rotateX, f3[1] = tItem.rotateY, f3[2] = tItem.rotateZ, f3)),
                            tGL.uniform3fv(tProgram.uPosition, (f3[0] = tItem.x, f3[1] = tItem.y, f3[2] = tItem.z, f3)),
                            tGL.uniform3fv(tProgram.uScale, (f3[0] = tItem.scaleX, f3[1] = tItem.scaleY, f3[2] = tItem.scaleZ, f3)),
                            tIBO = tGPU.ibo[tGeo],
                            tIBO != pIBO ? tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO) : 0,
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0);

                            //와이어프레임 그리기
                            if (priMatWireFrame[tMatUUID]) {
                                tGL.enable(tGL.DEPTH_TEST),
                                tGL.depthFunc(tGL.LEQUAL),
                                tProgram = tGPU.programs['wireFrame'],
                                tGL.useProgram(tProgram)
                                tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                                f3[0] = tItem.rotateX, f3[1] = tItem.rotateY, f3[2] = tItem.rotateZ,
                                tGL.uniform3fv(tProgram.uRotate, f3),
                                f3[0] = tItem.x, f3[1] = tItem.y, f3[2] = tItem.z,
                                tGL.uniform3fv(tProgram.uPosition, f3),
                                f3[0] = tItem.scaleX, f3[1] = tItem.scaleY, f3[2] = tItem.scaleZ,
                                tGL.uniform3fv(tProgram.uScale, f3),
                                tColor = priMatWireFrameColor[tMatUUID],
                                tGL.uniform4fv(tProgram.uColor, tColor),
                                tGL.drawElements(tGL.LINES, tIBO.numItem, tGL.UNSIGNED_INT, 0)

                            }
                            pCulling = tCulling, pVBO = tVBO, pVNBO = tVNBO, pUVBO = tUVBO, pIBO = tIBO,
                            pDiffuse = tDiffuse,
                            pNormal = tNormal,
                            pShading = 'wireFrame'
                        }
                        if (len > 1) tGL.bindFramebuffer(tGL.FRAMEBUFFER, pProgram = pVBO = pVNBO = pUVBO = pIBO = null);
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
                    /*tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, [
                     2 / tCvs.clientWidth, 0, 0, 0,
                     0, -2 / tCvs.clientHeight, 0, 0,
                     0, 0, 0, 0,
                     -1, 1, 0, 1
                     ]);
                     */
                    pM[0] = 2 / tCvs.clientWidth, pM[1] = pM[2] = pM[3] = 0,
                    pM[4] = 0, pM[5] = -2 / tCvs.clientHeight, pM[6] = pM[7] = 0,
                    pM[8] = pM[9] = pM[10] = pM[11] = 0,
                    pM[12] = -1, pM[13] = 1, pM[14] = 0, pM[15] = 1,
                    tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, pM),
                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                    tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0),
                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                    tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0),

                        //tGL.uniform3fv(tProgram.uRotate, [0, 0, 0]),
                    tGL.uniform3fv(tProgram.uRotate, rM),
                    tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, rectMatrix.raw);

                    for (k in tCameraList) {
                        tCamera = tCameraList[k];
                        if (tCamera.visible) {
                            tFrameBuffer = tGPU.framebuffers[tCamera.uuid].frameBuffer;
                            tGL.uniform1i(tProgram.uFXAA, tCamera.antialias);
                            if (tCamera.antialias) {
                                /*
                                 if (tCamera.renderArea) tGL.uniform2fv(tProgram.uTexelSize, [1 / tFrameBuffer.width, 1 / tFrameBuffer.height]);
                                 else tGL.uniform2fv(tProgram.uTexelSize, [1 / tCvs.width, 1 / tCvs.height]);
                                 */
                                if (tCamera.renderArea) uTS[0] = 1 / tFrameBuffer.width, uTS[1] = 1 / tFrameBuffer.height;
                                else uTS[0] = 1 / tCvs.width, uTS[1] = 1 / tCvs.height;
                                tGL.uniform2fv(tProgram.uTexelSize, uTS);
                            }
                            f3[0] = tFrameBuffer.x + tFrameBuffer.width / 2 / pRatio, f3[1] = tFrameBuffer.y + tFrameBuffer.height / 2 / pRatio , f3[2] = 0;
                            tGL.uniform3fv(tProgram.uPosition, f3),
                            f3[0] = tFrameBuffer.width / 2 / pRatio, f3[1] = tFrameBuffer.height / 2 / pRatio, f3[2] = 1,
                            tGL.uniform3fv(tProgram.uScale, f3),
                            //tGL.activeTexture(tGL.TEXTURE0),
                            tGL.bindTexture(tGL.TEXTURE_2D, tGPU.framebuffers[tCamera.uuid].texture),
                            tGL.uniform1i(tProgram.uSampler, 0),
                            tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO),
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0);
                        }
                    }

                }
                
                //this.dispatch(World.renderAfter, currentTime, totalVertex);
                if(priListener[tUUID] && priListener[tUUID]['WORLD_RENDER_AFTER']) priListener[tUUID]['WORLD_RENDER_AFTER'][0].f(currentTime)
                
                //tGL.flush();
                //tGL.finish()
            };
            var mouseEvent = ['mousemove','mousedown','mouseup'];
            var mouseListener = function(e){
                var ev = this.ev;
                e.stopPropagation(),
                e.preventDefault(),
                ev.x = e.clientX,
                ev.y = this.height - e.clientY,
                ev.move = true;
                e.type =='mousedown' ? (ev.down = true) : e.type =='mouseup' ? (ev.up = true) : 0
            };
            var touchEvent = ['touchmove', 'touchstart', 'touchend'];
            var touchListener = function(e){
                var ev = this.ev, t = e.type == 'touchend' ? 'changedTouches' : 'touches';
                e.stopPropagation(),
                e.preventDefault(),
                ev.x = e[t][0].clientX * pRatio,
                ev.y = this.height - e[t][0].pageY * pRatio,
                ev.move = true;
                e.type =='touchstart' ? (ev.down = true) : e.type =='touchend' ? (ev.up = true) : 0
            };
            return function World(id) {
                var c, i;
                if (!id) this.error(0);
                if (!(cvsList[this] = c = document.getElementById(id))) this.error(1);
                gpu[this] = {
                    gl:null, vbo:{}, vnbo:{}, uvbo:{}, ibo:{},
                    programs:{}, textures:{}, framebuffers:{}
                };
                if (gpu[this].gl = getGL(cvsList[this])) {
                    renderList[this] = {},
                    sceneList[this] = [],
                    autoSizer[this] = null;
                } else {
                    this.error(2);
                }
                mouse[this] = c.ev = {x:0,y:0},
                i = mouseEvent.length;
                while (i--) {
                    c.addEventListener(mouseEvent[i], mouseListener, true);
                    c.addEventListener(touchEvent[i], touchListener, true);
                }
                this.render = render;
            };
        })()
    })
    .method('setAutoSize', {
        description:[
            "world에 지정된 canvas요소에 대해 viewport에 대한 자동 크기 조정을 해주는지 여부.",
            "생성시 기본값은 false"
        ],
        param:[
            "isAutoSize:boolean - 자동으로 캔버스의 크기를 조정하는지에 대한 여부."
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
                        //this._pixelRatio = parseFloat(width)/parseFloat(height) > 1 ? pRatio : 1
                        var width, height, pixelRatio, k;
                        width = window.innerWidth,
                        height = window.innerHeight,
                        pixelRatio = pRatio,
                        canvas.width = width * pixelRatio,
                        canvas.height = height * pixelRatio,
                        canvas.style.width = width + 'px',
                        canvas.style.height = height + 'px',
                        canvas._autoSize = isAutoSize,
                        cameraRenderAreaUpdate(self);
                        gpu[self].gl.viewport(0, 0, canvas.width, canvas.height);
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
            "scene:[Scene](Scene.md) - [Scene](Scene.md)의 인스턴스"
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        exception:[
            "* 'World.addScene:0' - 이미 등록된 Scene.",
            "* 'World.addScene:1' - [Scene](Scene.md)이 아닌 객체를 지정한 경우."
        ],
        sample:[
            "var world = new World('canvasID');",
            "world.addScene(Scene().setId('lobby'));",
            "world.addScene(Scene().setId('room'));"
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
            "sceneId:string - 등록시 scene의 id. 없으면 null을 반환함."
        ],
        ret:"[Scene](Scene.md) - sceneId에 해당되는 [Scene](Scene.md) 인스턴스.",
        sample:[
            "var world = new World('canvasID');",
            "world.addScene(new Scene().setId('lobby'));",
            "var lobby = world.getScene('lobby');"
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
    //.method('getRenderer', {
    //    description:[
    //        "setInterval이나 requestAnimationFrame에서 사용될 렌더링 함수를 얻음.",
    //        "실제로는 본인과 바인딩된 render함수를 반환하고 한 번 반환한 이후는 캐쉬로 잡아둠."
    //    ],
    //    param:[
    //        "isRequestAnimationFrame:boolean - 애니메이션프레임용으로 반환하는 경우는 내부에서 다시 requestAnimationFrame을 호출하는 기능이 추가됨."
    //    ],
    //    ret:"function - this.render.bind(this) 형태로 본인과 바인딩된 함수를 반환함.",
    //    sample:[
    //        "var world = new World('canvasID');",
    //        "world.addScene(Scene().setId('lobby'));",
    //        "//인터벌용",
    //        "setInterval(world.getRenderer());",
    //        "//raf용",
    //        "requestAnimationFrame(world.getRenderer(true));"
    //    ],
    //    value:function getRenderer(isRequestAnimationFrame) {
    //        var p, self;
    //        p = renderList[this];
    //        if (!p) {
    //            // 없으니까 생성
    //            p = {}
    //        }
    //        self = this;
    //        /*
    //        if (isRequestAnimationFrame) {
    //            if (p[1]) return p[1];
    //            else {
    //                return p[1] = function requestAni(currentTime) {
    //                        self.render(currentTime);
    //                        started[self.uuid] = requestAnimationFrame(p[1]);
    //                }
    //            }
    //        } else {
    //            */
    //            if (p[0]) return p[0];
    //            else {
    //                p[0] = function intervalAni(currentTime) {
    //                    self.render(currentTime);
    //                }
    //                return p[0];
    //            }
    //        //}
    //    }
    //})
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
            //var renderFunc = this.getRenderer(1)
            var self = this
            var renderFunc =function () {
                self.render(Date.now());
                //requestAnimationFrame(renderFunc);
            }
            //started[this.uuid] = requestAnimationFrame(renderFunc);
            started[this.uuid] = setInterval(renderFunc,16.666);
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
            //cancelAnimationFrame(started[this.uuid]);
            clearInterval(started[this.uuid])
            return this;
        }
    })
    .method('removeScene', {
        description:[
            "[Scene](Scene.md)객체를 world에서 제거함.",
            "[Scene](Scene.md)을 제거하면 관련된 카메라가 지정된 render도 자동으로 제거됨."
        ],
        param:[
            "sceneId:string - [Scene](Scene.md)객체에 정의된 id."
        ],
        ret:"this - 메서드체이닝을 위해 자신을 반환함.",
        exception:[
            "* 'World.removeScene:0' - id에 해당되는 [Scene](Scene.md)이 존재하지 않음."
        ],
        sample:[
            "// Scene과 Camara생성 및 등록",
            "var lobby = new Scene();",
            "lobby.addChild(Camera());",
            "",
            "// Scene 등록",
            "var world = new World('canvasID');",
            "world.addScene(lobby.setId('lobby'));",
            "",
            "// Scene 제거",
            "world.removeScene('lobby');"
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
    //.method('render', {
    //    description:[
    //        "현재 화면을 그림."
    //    ],
    //    param:[
    //        "?currentTime:number - 현재시간 milliseconds."
    //    ],
    //    ret:"this - 메서드체이닝을 위해 자신을 반환함.",
    //    sample:[
    //        "// Scene과 Camara생성 및 등록",
    //        "var lobby = new Scene();",
    //        "lobby.addChild(Camera());",
    //        "",
    //        "// Scene 등록",
    //        "var world = new World('canvasID');",
    //        "world.addScene(lobby.setId('lobby'));",
    //        "",
    //        "// 실제 출력",
    //        "world.render();"
    //    ],
    //    value:
    //})
    .constant('renderBefore', {
        description:'renderBefore constant',
        sample:[
            "world.addEventListener(World.renderBefore, function() {",
            "   //job",
            "});"
        ],
        value:'WORLD_RENDER_BEFORE'
    })
    .constant('renderAfter', {
        description:'renderAfter constant',
        sample:[
            "world.addEventListener(World.renderAfter, function () {",
            "   //job",
            "});"
        ],
        value:'WORLD_RENDER_AFTER'
    })
    .build();
})(makeUtil);