var World = (function (makeUtil) {
    'use strict';
    var getGL, glSetting, glContext, rectMTX = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    var makeVBO, makeVNBO, makeIBO, makeUVBO, makeProgram, makeTexture, makeFrameBuffer,makeBOs;
    var baseShaderUpdate, cameraRenderAreaUpdate;

    var priRaw = $getPrivate('Matrix', 'raw')
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
    makeBOs = makeUtil.makeBOs,
    makeProgram = makeUtil.makeProgram,
    makeTexture = makeUtil.makeTexture,
    // TODO 일단은 카메라 프레임버퍼 전용
    makeFrameBuffer = makeUtil.makeFrameBuffer,
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
                    tRenderArea[0] = typeof tRenderArea[0] == 'string' ? tw * tRenderArea[0].replace('%', '') * 0.01 : tRenderArea[0],
                    tRenderArea[1] = typeof tRenderArea[1] == 'string' ? th * tRenderArea[1].replace('%', '') * 0.01 : tRenderArea[1],
                    tRenderArea[2] = tw * wRatio,
                    tRenderArea[3] = th * hRatio,
                    camera.renderArea.byAutoArea=false
                }else{
                    if (tRenderArea) {
                        tRenderArea[0] = tRenderArea[1] = 0,
                        tRenderArea[2] = cvs.width, tRenderArea[3] = cvs.height;
                    } else {
                        camera.renderArea = [0,0,cvs.width,cvs.height];
                    }
                    camera.renderArea.byAutoArea = true
                }
                camera.resetProjectionMatrix()
                tProjectionMtx = priRaw[camera.projectionMatrix.uuid];
                tCameraMtx = priRaw[camera.matrix.uuid];
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
            var cameraLength = 0;
            var prevWidth, prevHeight;
            var f9 = new Float32Array(9);
            var tGPU, tGL, tScene, tSceneList, tCameraList, tCamera, tChildren, tChildrenArray;

            var tCvs, tCvsW, tCvsH;
            var tItem, tMaterial;
            var tUUID, tUUID_camera, tUUID_Item, tUUID_mat, tUUID_Scene;
            var tGeo,tColor,tDiffuseMaps, tNormalMaps, tSpecularMaps;
            var tCull, tVBO, tVNBO, tUVBO, tIBO, tDiffuse, tNormal, tSpecular, tShading, tFrameBuffer, tProgram;
            var pCull, pVBO, pVNBO, pUVBO, pIBO, pDiffuse, pNormal, pSpecular, pShading;
            var tListener;

            var gChild, gChildArray, gCameraLen;
            var gGeo, gMat;
            var gCull;

            var gMatColor,gMatWire, priMatWireColor;
            var gMatShading, gMatLambert, gMatNormalPower, gMatSpecularPower, gMatSpecularColor;
            var gMatDiffuseMaps, gMatNormalMaps, gMatSpecularMaps;
            var gMatSprite;

            var gGeoVertexCount;

            var gPickColors;
            var gPickMeshs;
            var gCameraProperty;
            var gTextureIsLoaded;

            var baseLightRotate;
            var useNormalBuffer, useTexture,tUseTexture;

            var totalVertex = 0;

            var mouseCurrent = new Uint8Array(4);
            mouseCurrent[3] = 1;
            var mouseCurrentItem, mouseOldItem, mouseCheck = true;
            var mouseObj = {};
            var mousePickLength;
            var tMouse;


            var sheetOffset = [], pM=[], rM = [0, 0, 0], uTS = [];
            var priListener = $getPrivate('MoGL', 'listener');

            gCameraProperty = $getPrivate('Camera', 'property'),

            gChild = $getPrivate('Scene', 'children'),
            gChildArray = $getPrivate('Scene', 'childrenArray'),
            gCameraLen = $getPrivate('Scene', 'cameraLength'),

            gGeo = $getPrivate('Mesh', 'geometry'),
            gMat = $getPrivate('Mesh', 'material'),
            gPickColors = $getPrivate('Mesh', 'pickingColors'),
            gPickMeshs = $getPrivate('Mesh', 'pickingMeshs'),
            gCull = $getPrivate('Mesh', 'culling'),

            gMatColor = $getPrivate('Material', 'color'),
            gMatWire = $getPrivate('Material', 'wireFrame'),
            priMatWireColor = $getPrivate('Material', 'wireFrameColor'),
            gMatShading = $getPrivate('Material', 'shading'),
            gMatLambert = $getPrivate('Material', 'lambert'),
            gMatNormalPower = $getPrivate('Material', 'normalPower'),
            gMatSpecularPower = $getPrivate('Material', 'specularPower'),
            gMatSpecularColor = $getPrivate('Material', 'specularColor'),
            gMatDiffuseMaps = $getPrivate('Material', 'diffuse'),
            gMatNormalMaps = $getPrivate('Material', 'normal'),
            gMatSpecularMaps = $getPrivate('Material', 'specular'),
            gMatSprite = $getPrivate('Material', 'sprite'),

            gGeoVertexCount = $getPrivate('Geometry', 'vertexCount'),

            gTextureIsLoaded =$getPrivate('Texture', 'isLoaded');

            var render = function render(currentTime) {
                tUUID = this.uuid,
                pCull = null,
                pVBO = pVNBO = pUVBO = pIBO =  null,
                tCvs = cvsList[tUUID], tSceneList = sceneList[tUUID],
                tGPU = gpu[tUUID], tGL = tGPU.gl,
                tCvsW = tCvs.width, tCvsH = tCvs.height,
                tDiffuseMaps = tNormalMaps = pShading = null,
                totalVertex = 0;

                var i = tSceneList.length, j, k, k2, i2, list, curr;
                var sheetInfo;

                tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LEQUAL),
                tGL.enable(tGL.BLEND), tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA);

                tListener = priListener[tUUID]
                if(tListener && tListener['WORLD_RENDER_BEFORE']) tListener['WORLD_RENDER_BEFORE'][0].f(currentTime,totalVertex)
                while (i--) {
                    tScene = tSceneList[i];
                    tUUID_Scene = tScene.uuid
                    cameraLength = gCameraLen[tUUID_Scene]
                    //버퍼 업데이트
                    list = tScene.updateList.geometry;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[j];
                            if (!tGPU.vbo[curr]) makeBOs(tGPU,curr)
                        }
                        list.length = 0;
                    }
                    list = tScene.updateList.texture;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[0].tex
                            if(gTextureIsLoaded[curr.uuid]) makeTexture(tGPU, curr),list.shift();
                        }
                    }
                    if (tScene.updateList.camera.length) cameraRenderAreaUpdate(tUUID);
                    tScene.updateList.camera.length = 0,
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
                    tCameraList = tScene.cameras,
                    baseLightRotate = tScene.baseLightRotate
                    for (k in tCameraList) {
                        tCamera = tCameraList[k],
                        tCameraMtx = priRaw[tCamera.matrix.uuid];
                        tUUID_camera = tCamera.uuid
                        if (!tCamera.visible) continue;
                        //TODO 마우스용 프레임버퍼가 따로 필요하군 현재는 공용이자나!!!
                        tFrameBuffer = tGPU.framebuffers[tUUID_camera].frameBuffer,
                        tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer)
                        if(prevWidth != tFrameBuffer.width || prevHeight != tFrameBuffer.height) tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height)
                        prevWidth = tFrameBuffer.width , prevHeight = tFrameBuffer.height

                        for (k2 in tGPU.programs) {
                            tGL.useProgram(tProgram = tGPU.programs[k2]),
                            tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, tProjectionMtx),
                            tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, tCameraMtx);
                            if (tProgram['uDLite']) tGL.uniform3fv(tProgram.uDLite, baseLightRotate);
                        }

                        // mouse Start
                        tProgram = tGPU.programs['mouse'],
                        tGL.useProgram(tProgram),
                        useNormalBuffer = useTexture = tUseTexture = mousePickLength = 0;

                        //if(mouseCheck = !mouseCheck){
                        for (k2 in gPickMeshs) {
                            mousePickLength++,
                            tItem = gPickMeshs[k2].mesh,
                            tUUID_Item = tItem.uuid,
                            tGeo = gGeo[tUUID_Item].uuid,
                            tVBO = tGPU.vbo[tGeo],
                            tIBO = tGPU.ibo[tGeo],
                            tCull = gCull[tUUID_Item];
                            if (tVBO != pVBO) {
                                tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                            }
                            tGL.uniform4fv(tProgram.uColor, gPickColors[tUUID_Item]),
                            tGL.uniform3fv(tProgram.uAffine,
                                (
                                    f9[0] = tItem.x, f9[1] = tItem.y, f9[2] = tItem.z,
                                    f9[3] = tItem.rotateX, f9[4] = tItem.rotateY, f9[5] = tItem.rotateZ,
                                    f9[6] = tItem.scaleX, f9[7] = tItem.scaleY, f9[8] = tItem.scaleZ, f9
                                )
                            ),
                            tIBO != pIBO ? tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO) : 0,
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0),
                            pVBO = tVBO, pIBO = tIBO;
                        }
                        if (mousePickLength && (tMouse = mouse[tUUID]) && tMouse.x) {
                            tGL.readPixels(tMouse.x, tMouse.y, 1, 1, tGL.RGBA , tGL.UNSIGNED_BYTE, mouseCurrent),
                            mouseCurrentItem = gPickMeshs[''+mouseCurrent[0]+mouseCurrent[1]+mouseCurrent[2]+'255'],
                            mouseObj.x = tMouse.x,
                            mouseObj.y = tMouse.y,
                            mouseObj.z = 0;

                            if (mouseCurrentItem) mouseObj.target = mouseCurrentItem.mesh;
                            if (tMouse.down && mouseCurrentItem ) {
                                mouseCurrentItem.mesh.dispatch(Mesh.down, mouseObj);
                            } else if (tMouse.up && mouseCurrentItem) {
                                mouseCurrentItem.mesh.dispatch(Mesh.up, mouseObj),
                                tMouse.x = null;
                            } else  if (mouseCurrentItem != mouseOldItem) {
                                if (mouseOldItem) mouseOldItem.mesh.dispatch(Mesh.out, mouseObj);
                                if (mouseCurrentItem) mouseCurrentItem.mesh.dispatch(Mesh.over, mouseObj);
                                mouseOldItem = mouseCurrentItem;
                            } else if (mouseOldItem && tMouse.move) {
                                mouseOldItem.mesh.dispatch(Mesh.move, mouseObj);
                            }

                            tMouse.down ?  tMouse.down = false : 0;
                            tMouse.move ?  tMouse.move = false : 0;
                            tMouse.up ?  tMouse.up = false : 0;
                            tGL.clearColor(0,0,0,0)
                            tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                        }
                        tGL.bindFramebuffer(tGL.FRAMEBUFFER, null);
                        // draw Start
                        // 뷰포트설정
                        if (cameraLength > 1) {
                            tFrameBuffer = tGPU.framebuffers[tUUID_camera].frameBuffer;
                            tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer);
                            if(prevWidth != tFrameBuffer.width || prevHeight != tFrameBuffer.height) {
                                tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height)
                            }
                            prevWidth = tFrameBuffer.width , prevHeight = tFrameBuffer.height
                        }
                        tColor = gCameraProperty[tUUID_camera],
                        tGL.clearColor(tColor.r, tColor.g, tColor.b, tColor.a)
                        tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);

                        // 대상 씬의 차일드 루프
                        tChildren = gChild[tUUID_Scene],
                        tChildrenArray = gChildArray[tUUID_Scene],
                        i2 = tChildrenArray.length;
                        var i3 = 0
                        while(i2--){
                            tItem = tChildrenArray[i3++],
                            tUUID_Item = tItem.uuid,
                            tCull = gCull[tUUID_Item];
                            if (tCull != pCull) {
                                if (tCull == Mesh.cullingNone) tGL.disable(tGL.CULL_FACE);
                                else if (tCull == Mesh.cullingBack) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CCW);
                                else if (tCull == Mesh.cullingFront) tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CW);
                            }
                            // 쉐이딩 결정
                            tMaterial = gMat[tUUID_Item],
                            tShading = gMatShading[tUUID_mat = tMaterial.uuid],
                            tDiffuseMaps = gMatDiffuseMaps[tUUID_mat];
                            tUseTexture = tDiffuseMaps ? 1 : 0
                            if (pShading != tShading || useTexture != tUseTexture) {
                                useTexture = tUseTexture,
                                useNormalBuffer = 1,
                                pShading = tShading,
                                tProgram =
                                    pShading == Shading.phong ? tGPU.programs[useTexture ? 'bitmapPhong' : 'colorPhong'] :
                                    pShading == Shading.gouraud ? tGPU.programs[useTexture ? 'bitmapGouraud' : 'colorGouraud'] :
                                    pShading == Shading.toon ? tGPU.programs['toonPhong'] :
                                    pShading == Shading.blinn ? tGPU.programs['bitmapBlinn'] :
                                    (useNormalBuffer = 0, tGPU.programs[useTexture ? 'bitmap' : 'color']),
                                    //pVBO = pVNBO = pUVBO = pIBO = pDiffuse = pNormal = pSpecular =  null, // TODO 디퓨즈는 항상 0번이니 상관없는건지 확인하자
                                    pVBO = pVNBO = pUVBO = pIBO = null,
                                tGL.useProgram(tProgram);
                            }
                            ///////////////////////////////////////////////////////////////
                            //총정점수계산
                            totalVertex += gGeoVertexCount[tGeo = gGeo[tUUID_Item].uuid],
                            ///////////////////////////////////////////////////////////////
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
                                tGL.uniform1f(tProgram.uLambert, gMatLambert[tUUID_mat]);
                            }
                            //색상
                            tColor = gMatColor[tUUID_mat],
                            tGL.uniform4fv(tProgram.uColor, tColor);
                            //텍스쳐
                            if (useTexture) {
                                //스프라이트
                                if (sheetInfo = gMatSprite[tUUID_mat]) {
                                   sheetOffset[0] = sheetInfo._col,
                                    sheetOffset[1] = sheetInfo._row,
                                    sheetOffset[2] = sheetInfo.curr % sheetInfo.col,
                                    sheetOffset[3] = parseInt(sheetInfo.curr / sheetInfo.col),
                                    tGL.uniform4fv(tProgram.uSheetOffset, sheetOffset),
                                    tGL.uniform1i(tProgram.uSheetMode, 1);
                                } else {
                                    tGL.uniform1i(tProgram.uSheetMode, 0);
                                }
                                //UV설정
                                tUVBO = tGPU.uvbo[tGeo];
                                if (tUVBO != pUVBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                                    tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0);
                                }
                                //디퓨즈
                                tDiffuse = tGPU.textures[tDiffuseMaps[tDiffuseMaps.length - 1].tex.uuid];
                                if (tDiffuse != pDiffuse && tDiffuse != null) {
                                    tGL.activeTexture(tGL.TEXTURE0),
                                    tGL.bindTexture(tGL.TEXTURE_2D, tDiffuse),
                                    tGL.uniform1i(tProgram.uSampler, 0);
                                }
                            }
                            tGL.uniform1f(tProgram.uSpecularPower, gMatSpecularPower[tUUID_mat]),
                            tGL.uniform4fv(tProgram.uSpecularColor, gMatSpecularColor[tUUID_mat]);
                            
                            //노말
                            if (tNormalMaps = gMatNormalMaps[tUUID_mat] ) {
                                tNormal = tGPU.textures[tNormalMaps[tNormalMaps.length - 1].tex.uuid]
                                if(tNormal != pNormal && tNormal != null){
                                    tGL.activeTexture(tGL.TEXTURE1),
                                    tGL.bindTexture(tGL.TEXTURE_2D, tNormal),
                                    tGL.uniform1i(tProgram.uNormalSampler, 1)
                                }
                                tGL.uniform1i(tProgram.useNormalMap, true),
                                tGL.uniform1f(tProgram.uNormalPower, gMatNormalPower[tUUID_mat]);
                            }else{
                                tGL.uniform1i(tProgram.useNormalMap, false);
                            }
                            //스페큘러
                            if(tSpecularMaps = gMatSpecularMaps[tUUID_mat]){
                                tSpecular = tGPU.textures[tSpecularMaps[tSpecularMaps.length - 1].tex.uuid]
                                if(tSpecular != pSpecular && tSpecular != null) {
                                    tGL.activeTexture(tGL.TEXTURE2),
                                    tGL.bindTexture(tGL.TEXTURE_2D, tSpecular),
                                    tGL.uniform1i(tProgram.uSpecularSampler, 2)
                                }
                                tGL.uniform1i(tProgram.useSpecularMap, true),
                                tGL.uniform1f(tProgram.uSpecularMapPower, 1.5);  //TODO 파워도 받아야함
                            }else{
                                tGL.uniform1i(tProgram.useSpecularMap, false);
                            }
                            tGL.uniform3fv(tProgram.uAffine,
                                (
                                    f9[0] = tItem.x, f9[1] = tItem.y, f9[2] = tItem.z,
                                    f9[3] = tItem.rotateX, f9[4] = tItem.rotateY, f9[5] = tItem.rotateZ,
                                    f9[6] = tItem.scaleX, f9[7] = tItem.scaleY, f9[8] = tItem.scaleZ, f9
                                )
                            ),
                            tIBO = tGPU.ibo[tGeo],
                            tIBO != pIBO ? tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO) : 0,
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0);
                            //와이어프레임 그리기
                            if (gMatWire[tUUID_mat]) {
                                tProgram = tGPU.programs['wireFrame'],
                                tGL.useProgram(tProgram)
                                tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                                tGL.uniform3fv(tProgram.uAffine,f9),
                                tColor = priMatWireColor[tUUID_mat],
                                tGL.uniform4fv(tProgram.uColor, tColor),
                                tGL.drawElements(tGL.LINES, tIBO.numItem, tGL.UNSIGNED_INT, 0)
                                pShading = 'wireFrame'
                            }
                            pCull = tCull, pVBO = tVBO, pVNBO = tVNBO, pUVBO = tUVBO, pIBO = tIBO,
                            pDiffuse = tDiffuse,
                            pNormal = tNormal,
                            pSpecular = tSpecular

                        }
                        if (cameraLength > 1) {
                            tGL.bindFramebuffer(tGL.FRAMEBUFFER, pVBO = pVNBO = pUVBO = pIBO = pDiffuse = pNormal = pSpecular = pShading = null);
                        }
                    }
                }

                // TODO 아래는 아직 다 못옮겨씀
                // 프레임버퍼를 모아서 찍어!!!
                if (cameraLength > 1) {
                    tGL.clearColor(0, 0, 0, 1);
                    tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                    tGL.viewport(0, 0, tCvs.width, tCvs.height);
                    tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LEQUAL);
                    tGL.enable(tGL.BLEND),tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA);

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
                    tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, rectMTX);
                    for (k in tCameraList) {
                        tCamera = tCameraList[k]
                        tUUID_camera = tCamera.uuid
                        if (tCamera.visible) {
                            tFrameBuffer = tGPU.framebuffers[tUUID_camera].frameBuffer;
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

                            tGL.uniform3fv(tProgram.uAffine,
                                (
                                    f9[0] = tFrameBuffer.x + tFrameBuffer.width / 2 / pRatio, f9[1] = tFrameBuffer.y + tFrameBuffer.height / 2 / pRatio , f9[2] = 0,
                                    f9[3] = 0, f9[4] = 0, f9[5] = 0,
                                    f9[6] = tFrameBuffer.width / 2 / pRatio, f9[7] = tFrameBuffer.height / 2 / pRatio, f9[8] = 1,
                                        f9
                                )
                            ),
                            //tGL.activeTexture(tGL.TEXTURE0),
                            tGL.bindTexture(tGL.TEXTURE_2D, tGPU.framebuffers[tUUID_camera].texture),
                            tGL.uniform1i(tProgram.uSampler, 0),
                            tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO),
                            tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_INT, 0);
                        }
                    }

                }
                if(tListener && tListener['WORLD_RENDER_AFTER']) tListener['WORLD_RENDER_AFTER'][0].f(currentTime,totalVertex)
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
            var self;
            if (!started[this.uuid]) {
                self = this;
                started[this.uuid] = MoGL.addInterval(function(t){
                    self.render(t);   
                });
            }
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
            if (started[this.uuid]) {
                MoGL.removeInterval(started[this.uuid]);
                started[this.uuid] = null;
            }
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