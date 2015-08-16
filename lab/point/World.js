var World = (function (makeUtil) {
    'use strict';
    var getGL, glSetting, glContext, rectMTX = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    var makeProgram, makeTexture, makeFrameBuffer, makeBOs;
    var baseShaderUpdate, cameraRenderAreaUpdate;
    var tProjectionMtx, tCameraMtx;
    var totalVertex = 0, totalObject = 0;
    var pRatio = window.devicePixelRatio;

    glSetting = {
        alpha:false,
        depth:true,
        stencil:false,
        antialias:window.devicePixelRatio == 1 ? true : false,
        premultipliedAlpha:false,
        preserveDrawingBuffer:false
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
            if (gl) gl.getExtension("OES_element_index_uint");
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
            makeProgram(gpu, 'color', vS.colorVertexShader, fS.colorFragmentShader),
                makeProgram(gpu, 'mouse', vS.mouseVertexShader, fS.colorFragmentShader),
                makeProgram(gpu, 'wireFrame', vS.wireFrameVertexShader, fS.wireFrameFragmentShader),
                makeProgram(gpu, 'bitmap', vS.bitmapVertexShader, fS.bitmapFragmentShader),
                makeProgram(gpu, 'bitmapGouraud', vS.bitmapVertexShaderGouraud, fS.bitmapFragmentShaderGouraud),
                makeProgram(gpu, 'colorGouraud', vS.colorVertexShaderGouraud, fS.colorFragmentShaderGouraud),
                makeProgram(gpu, 'colorPhong', vS.colorVertexShaderPhong, fS.colorFragmentShaderPhong),
                makeProgram(gpu, 'toonPhong', vS.toonVertexShaderPhong, fS.toonFragmentShaderPhong),
                makeProgram(gpu, 'bitmapPhong', vS.bitmapVertexShaderPhong, fS.bitmapFragmentShaderPhong),
                makeProgram(gpu, 'postBase', vS.postBaseVertexShader, fS.postBaseFragmentShader);
        },
        cameraRenderAreaUpdate = function (self) {
            var p, p2, k, k2;
            p = sceneList[self]
            for (k in p) {
                p2 = p[k].cameras
                for (k2 in p2) {
                    var camera, tRenderArea, cvs, pixelRatio;
                    camera = p2[k2],
                        cvs = cvsList[self]
                    tRenderArea = camera.renderArea;
                    pixelRatio = pRatio
                    if (tRenderArea && !camera.renderArea.byAutoArea) {
                        var tw, th
                        tw = cvs.width,
                            th = cvs.height
                        var wRatio = tRenderArea[2] / tw;
                        var hRatio = tRenderArea[3] / th;
                        tRenderArea[0] = typeof tRenderArea[0] == 'string' ? tw * tRenderArea[0].replace('%', '') * 0.01 : tRenderArea[0],
                            tRenderArea[1] = typeof tRenderArea[1] == 'string' ? th * tRenderArea[1].replace('%', '') * 0.01 : tRenderArea[1],
                            tRenderArea[2] = tw * wRatio,
                            tRenderArea[3] = th * hRatio,
                            camera.renderArea.byAutoArea = false
                    } else {
                        if (tRenderArea) {
                            tRenderArea[0] = tRenderArea[1] = 0,
                                tRenderArea[2] = cvs.width, tRenderArea[3] = cvs.height;
                        } else {
                            camera.renderArea = [0, 0, cvs.width, cvs.height];
                        }
                        camera.renderArea.byAutoArea = true
                    }
                    camera.resetProjectionMatrix()
                    tProjectionMtx = camera.projectionMatrix;
                    //TODO 렌더러 반영하겠금 고쳐야겠고..
                    // 헉!! 프레임 버퍼가 카메라에 종속되있어!!!!!!
                    makeFrameBuffer(gpu[self], camera, cvs);
                }

            }
        };
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
        value:(function () {
            // tXXX 현재 대상
            // pXXX 직전 렌더의 대상 - 캐싱을 확인하기 위해 사용
            // gXXX 글로벌 private

            var cameraLength = 0;
            var prevWidth, prevHeight
            var f9 = new Float32Array(9), f3 = new Float32Array(3);
            var tGPU, tGL, tScene, tSceneList, tCameraList, tCamera, tChild, tChildArray, tRenderList;
            var tCvs, tCvsW, tCvsH;
            var tMesh, tMaterial;
            var tUID, tUID_camera, tUID_Mesh, tUID_mat, pUUID_mat, tUID_Scene;
            var tGeo, tBgColor, tColor2, tDiffuseMaps, tNormalMaps, tSpecularMaps;
            var tCull, tVBO, tVNBO, tUVBO, tIBO, tDiffuse, tNormal, tSpecular, tShading, tFrameBuffer, tProgram;
            var pCull, pNormal, pSpecular, pShading;
            var tListener;
            var tTextures;

            var gChild, gChildArray, gCameraLen;
            var gGeo, gMat;
            var gCull, gAlpha, gBillboard, propLookAt = {rotateX:Math.PI / 2}, gVisible

            var gRenderList;
            var gMatColor, gMatWire, priMatWireColor;
            var gMatShading, gMatLambert, gMatSpecularPower, gMatSpecularColor, gMatNormalPower, gMatSpecularMapPower;
            var gMatDiffuseMaps, gMatNormalMaps, gMatSpecularMaps;
            var gMatSprite;

            var gGeoVertexCount;

            var gPointSize, gPathType; // pss

            var gPickColors,gPickMeshs;
            var gCameraProperty;
            var gTextureIsLoaded;

            var baseLightRotate;
            var useNormalBuffer, useTexture, useSheet;

            var gListener

            // 마우스 이벤트 정보들
            var mouseCurrent = new Uint8Array(4);
            mouseCurrent[3] = 1;
            var mouseCurrItem, mouseOldItem, mouseCheck = true;
            var mouseObj = {};
            var mousePickLength;
            var tMouse;

            // 묶음 정보들
            var vs = new Float32Array(26), fs = new Float32Array(22);

            gListener = $getPrivate('MoGL', 'listener'),
                gCameraProperty = $getPrivate('Camera', 'property'),
                gChild = $getPrivate('Scene', 'children'),
                gChildArray = $getPrivate('Scene', 'childrenArray'),
                gCameraLen = $getPrivate('Scene', 'cameraLength'),
                gRenderList = $getPrivate('Scene', 'renderList'),
                gGeo = $getPrivate('Mesh', 'geometry'),
                gMat = $getPrivate('Mesh', 'material'),
                gPickColors = $getPrivate('Mesh', 'pickingColors'),
                gPickMeshs = $getPrivate('Mesh', 'pickingMeshs'),
                gCull = $getPrivate('Mesh', 'culling'),
                gAlpha = $getPrivate('Mesh', 'alpha'),
                gBillboard = $getPrivate('Mesh', 'billboard'),
                gVisible = $getPrivate('Mesh', 'visible'),
                gMatColor = $getPrivate('Material', 'color'),
                gMatWire = $getPrivate('Material', 'wireFrame'),
                priMatWireColor = $getPrivate('Material', 'wireFrameColor'),
                gMatShading = $getPrivate('Material', 'shading'),
                gMatLambert = $getPrivate('Material', 'lambert'),
                gMatNormalPower = $getPrivate('Material', 'normalPower'),
                gMatSpecularPower = $getPrivate('Material', 'specularPower'),
                gMatSpecularColor = $getPrivate('Material', 'specularColor'),
                gMatSpecularMapPower = $getPrivate('Material', 'specularMapPower'),
                gMatDiffuseMaps = $getPrivate('Material', 'diffuse'),
                gMatNormalMaps = $getPrivate('Material', 'normal'),
                gMatSpecularMaps = $getPrivate('Material', 'specular'),
                gMatSprite = $getPrivate('Material', 'sprite'),
                gGeoVertexCount = $getPrivate('Geometry', 'vertexCount'),
                gTextureIsLoaded = $getPrivate('Texture', 'isLoaded');

                gPointSize = $getPrivate('Point', 'pointsize'); // pss
                gPathType = $getPrivate('Path', 'pathtype'); // pss

            var render = function render() {
                var sheetInfo, i, i2, j, k, k2, sortGeo, sortCull, sortCullList, sortGeoList, sortDiffuse, sortDiffuseList, sortShading, sortList, list, curr;
                tUID = this.uuid,
                    pCull = null,
                    tCvs = cvsList[tUID], tSceneList = sceneList[tUID],
                    tGPU = gpu[tUID], tGL = tGPU.gl,
                    tTextures = tGPU.textures,
                    tCvsW = tCvs.width, tCvsH = tCvs.height,
                    tDiffuseMaps = tNormalMaps = pShading = null,
                    totalVertex = 0,
                    totalObject = 0,
                    i = tSceneList.length,
                    tListener = gListener[tUID],
                    tCull = Mesh.cullingNone,
                    tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LESS),
                    tGL.disable(tGL.BLEND);

                while (i--) {
                    tScene = tSceneList[i],
                        tUID_Scene = tScene.uuid,
                        cameraLength = gCameraLen[tUID_Scene],
                        list = tScene.updateList.geometry;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[j];
                            if (!tGPU.vbo[curr]) makeBOs(tGPU, curr)
                        }
                        list.length = 0;
                    }
                    list = tScene.updateList.texture;
                    if (j = list.length) {
                        while (j--) {
                            curr = list[0].tex
                            if (gTextureIsLoaded[curr.uuid]) makeTexture(tGPU, curr), list.shift();
                        }
                    }
                    if (tScene.updateList.camera.length) cameraRenderAreaUpdate(tUID);
                    tScene.updateList.camera.length = 0,
                        //////////////////////////////////////////////////////////////////////////////////////////////////////
                        tCameraList = tScene.cameras,
                        baseLightRotate = tScene.baseLightRotate;
                    //TODO for k로 돌리니 먼가 쌓이는듯한데?
                    for (k in tCameraList) {
                        tCamera = tCameraList[k],
                            tCameraMtx = tCamera.raw,
                            tUID_camera = tCamera.uuid;
                        if (!tCamera.visible) continue;
                        //TODO 마우스용 프레임버퍼가 따로 필요하군 현재는 공용이자나!!!
                        for (k2 in tGPU.programs) {
                            tGL.useProgram(tProgram = tGPU.programs[k2]),
                                tGL.uniformMatrix4fv(tProgram.uPixelMatrix, false, tProjectionMtx),
                                tGL.uniformMatrix4fv(tProgram.uCameraMatrix, false, tCameraMtx);
                            if (tProgram['uDLite']) tGL.uniform3fv(tProgram.uDLite, baseLightRotate);
                            vs[22] = tCvsW
                            vs[23] = tCvsH
                        }
                        // mouse Start
                        tProgram = tGPU.programs['mouse'],
                            tGL.useProgram(tProgram),
                            vs[17] = 0.0
                        useNormalBuffer = useTexture = mousePickLength = 0;
                        if (mouseCheck = !mouseCheck) {
                            // TODO 이놈도 지오별로 렌더하게 변경해야함
                            var pVBO = null
                            tFrameBuffer = tGPU.framebuffers[tUID_camera].frameBuffer,
                                tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer)
                            if (prevWidth != tFrameBuffer.width || prevHeight != tFrameBuffer.height) {
                                tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height)
                            }
                            prevWidth = tFrameBuffer.width , prevHeight = tFrameBuffer.height
                            for (k2 in gPickMeshs) {
                                mousePickLength++,
                                    tMesh = gPickMeshs[k2].mesh,
                                    tUID_Mesh = tMesh.uuid
                                if (!gVisible[tUID_Mesh]) continue;
                                tGeo = gGeo[tUID_Mesh].uuid,
                                    tVBO = tGPU.vbo[tGeo],
                                    tIBO = tGPU.ibo[tGeo],
                                    tCull = gCull[tUID_Mesh];
                                if (tVBO != pVBO) {
                                    tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                        tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0),
                                        tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO);
                                }
                                tGL.uniform4fv(tProgram.uColor, gPickColors[tUID_Mesh]),
                                    tGL.uniform3fv(tProgram.uAffine,
                                        (
                                            f9[0] = tMesh.x, f9[1] = tMesh.y, f9[2] = tMesh.z,
                                                f9[3] = tMesh.rotateX, f9[4] = tMesh.rotateY, f9[5] = tMesh.rotateZ,
                                                f9[6] = tMesh.scaleX, f9[7] = tMesh.scaleY, f9[8] = tMesh.scaleZ,
                                                f9
                                        )
                                    ),
                                    tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0),
                                    pVBO = tVBO
                            }
                            if (mousePickLength && (tMouse = mouse[tUID]) && tMouse.x) {
                                tGL.readPixels(tMouse.x, tMouse.y, 1, 1, tGL.RGBA, tGL.UNSIGNED_BYTE, mouseCurrent),
                                    mouseCurrItem = gPickMeshs['' + mouseCurrent[0] + mouseCurrent[1] + mouseCurrent[2] + '255'],
                                    mouseObj.x = tMouse.x,
                                    mouseObj.y = tMouse.y,
                                    mouseObj.z = 0;

                                if (mouseCurrItem) mouseObj.target = mouseCurrItem.mesh;
                                if (tMouse.down && mouseCurrItem) {
                                    mouseCurrItem.mesh.dispatch(Mesh.down, mouseObj);
                                } else if (tMouse.up && mouseCurrItem) {
                                    mouseCurrItem.mesh.dispatch(Mesh.up, mouseObj),
                                        tMouse.x = null;
                                } else if (mouseCurrItem != mouseOldItem) {
                                    if (mouseOldItem) mouseOldItem.mesh.dispatch(Mesh.out, mouseObj);
                                    if (mouseCurrItem) mouseCurrItem.mesh.dispatch(Mesh.over, mouseObj);
                                    mouseOldItem = mouseCurrItem;
                                } else if (mouseOldItem && tMouse.move) {
                                    mouseOldItem.mesh.dispatch(Mesh.move, mouseObj);
                                }

                                tMouse.down ? tMouse.down = false : 0,
                                    tMouse.move ? tMouse.move = false : 0,
                                    tMouse.up ? tMouse.up = false : 0,
                                    tGL.clearColor(0, 0, 0, 0),
                                    tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                            }
                            tGL.bindFramebuffer(tGL.FRAMEBUFFER, null);
                        }

                        // draw Start
                        // 뷰포트설정
                        tBgColor != gCameraProperty[tUID_camera] ? (
                            tBgColor = gCameraProperty[tUID_camera],
                                tGL.clearColor(tBgColor.r, tBgColor.g, tBgColor.b, tBgColor.a)
                        ) : 0
                        if (cameraLength > 1) {
                            tFrameBuffer = tGPU.framebuffers[tUID_camera].frameBuffer,
                                tGL.bindFramebuffer(tGL.FRAMEBUFFER, tFrameBuffer);
                            if (prevWidth != tFrameBuffer.width || prevHeight != tFrameBuffer.height) {
                                tGL.viewport(0, 0, tFrameBuffer.width, tFrameBuffer.height);
                            }
                            prevWidth = tFrameBuffer.width , prevHeight = tFrameBuffer.height;
                        } else {
                            tGL.enable(tGL.BLEND), tGL.blendFunc(tGL.SRC_ALPHA, tGL.ONE_MINUS_SRC_ALPHA),
                                tGL.clear(tGL.COLOR_BUFFER_BIT | tGL.DEPTH_BUFFER_BIT);
                        }

                        // 대상 씬의 차일드 루프
                        tChild = gChild[tUID_Scene],
                            tChildArray = gChildArray[tUID_Scene],
                            tRenderList = gRenderList[tUID_Scene];

                        for (sortCull in tRenderList) {
                            // 현재 컬링
                            tCull = sortCull
                            tCull != pCull ? (
                                tCull == Mesh.cullingNone ? tGL.disable(tGL.CULL_FACE) :
                                    tCull == Mesh.cullingBack ? (tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CCW)) :
                                        tCull == Mesh.cullingFront ? (tGL.enable(tGL.CULL_FACE), tGL.frontFace(tGL.CW)) : 0
                            ) : 0;
                            sortCullList = tRenderList[sortCull]
                            for (sortGeo in sortCullList) {
                                sortGeoList = sortCullList[sortGeo];
                                tGeo = sortGeo,
                                    // 지오가 바뀌는 시점
                                    pShading = pUUID_mat = tProgram = null
                                for (sortDiffuse in sortGeoList) {
                                    useTexture = 0,
                                        sortDiffuseList = sortGeoList[sortDiffuse]
                                    if (sortDiffuse.indexOf('useTexture') > -1){
                                        useTexture = 1 // 텍스쳐를 사용함
                                        // 시트냐 아니냐
                                        if (sortDiffuse.indexOf('sprite_') > -1) {
                                            tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.ALWAYS),
                                                useSheet = true
                                        }else{
                                            useSheet = false
                                        }

                                    }
                                    for (sortShading in sortDiffuseList) {
                                        useNormalBuffer = 1,
                                            useNormalBuffer = (sortShading == 'bitmap' || sortShading == 'color') ? 0 : 1 // 노멀 버퍼를 사용할지 결정함
                                        pShading = null,
                                            sortList = sortDiffuseList[sortShading],
                                            i2 = sortList.length;
                                        if (!i2) continue

                                        sortShading=
                                            sortShading == Shading.phong ? useTexture ? 'bitmapPhong' : 'colorPhong' :
                                                sortShading == Shading.gouraud ? useTexture ? 'bitmapGouraud' : 'colorGouraud' :
                                                    sortShading == Shading.toon ? 'toonPhong' :
                                                        sortShading == Shading.blinn ? 'bitmapBlinn' :
                                                            useTexture ? 'bitmap' : 'color';
                                        tProgram = tGPU.programs[sortShading],
                                            tGL.useProgram(tProgram);
                                        ///////////////////////////////////////////////////////////////
                                        // 버텍스버퍼설정
                                        tVBO = tGPU.vbo[tGeo];
                                        if (!tVBO) continue
                                        //TODO 바인딩은 상태머신인건가?
                                        tGL.bindBuffer(tGL.ARRAY_BUFFER, tVBO),
                                            tGL.vertexAttribPointer(tProgram.aVertexPosition, tVBO.stride, tGL.FLOAT, false, 0, 0);
                                        ///////////////////////////////////////////////////////////////
                                        // 노말버퍼설정
                                        if (useNormalBuffer) {
                                            tVNBO = tGPU.vnbo[tGeo],
                                                tGL.bindBuffer(tGL.ARRAY_BUFFER, tVNBO),
                                                tGL.vertexAttribPointer(tProgram.aVertexNormal, tVNBO.stride, tGL.FLOAT, true, 0, 0);
                                        }
                                        ///////////////////////////////////////////////////////////////
                                        // UV버퍼설정
                                        tUVBO = tGPU.uvbo[tGeo];
                                        if (useTexture) {
                                            tGL.bindBuffer(tGL.ARRAY_BUFFER, tUVBO),
                                                tGL.vertexAttribPointer(tProgram.aUV, tUVBO.stride, tGL.FLOAT, false, 0, 0);
                                        }
                                        tIBO = tGPU.ibo[tGeo],
                                            tGL.bindBuffer(tGL.ELEMENT_ARRAY_BUFFER, tIBO);
                                        ///////////////////////////////////////////////////////////////
                                        // 디퓨즈 or 컬러설정
                                        tMesh = sortList[0],
                                            tUID_Mesh = tMesh.uuid,
                                            tCull = gCull[tUID_Mesh],
                                            tMaterial = gMat[tUID_Mesh],
                                            tUID_mat = tMaterial.uuid,
                                            tShading = gMatShading[tUID_mat]
                                        if (useTexture) {
                                            tDiffuseMaps = gMatDiffuseMaps[tUID_mat],
                                                tDiffuse = tTextures[tDiffuseMaps[tDiffuseMaps.length - 1].tex.uuid],
                                                tGL.activeTexture(tGL.TEXTURE0),
                                                tGL.bindTexture(tGL.TEXTURE_2D, tDiffuse),
                                                tGL.uniform1i(tProgram.uSampler, 0);
                                        } else {
                                            tColor2 = gMatColor[tUID_mat],
                                                fs[0] = tColor2[0],
                                                fs[1] = tColor2[1],
                                                fs[2] = tColor2[2],
                                                fs[3] = tColor2[3]
                                        }
                                        while (i2--) {
                                            // 현재 대상 관련 정보 추출
                                            tMesh = sortList[i2],
                                                tUID_Mesh = tMesh.uuid;
                                            if (!gVisible[tUID_Mesh]) continue;
                                            tCull = gCull[tUID_Mesh],
                                                tMaterial = gMat[tUID_Mesh],
                                                tUID_mat = tMaterial.uuid,
                                                tShading = gMatShading[tUID_mat],
                                                tDiffuseMaps = gMatDiffuseMaps[tUID_mat],
                                                ///////////////////////////////////////////////////////////////
                                                //총정점수계산
                                                totalObject++,
                                                totalVertex += gGeoVertexCount[tGeo = gGeo[tUID_Mesh].uuid];
                                            ///////////////////////////////////////////////////////////////
                                            //아핀관련정보 입력
                                            if (gBillboard[tUID_Mesh]) {
                                                tMesh.lookAt(tCamera.x, tCamera.y, -tCamera.z).rotateX = propLookAt.rotateX;
                                            }
                                            if(tMesh.useMatrix){
                                                vs[0] = tMesh[0], vs[1] = tMesh[1], vs[2] = tMesh[2], vs[3] = tMesh[3],
                                                    vs[4] = tMesh[4], vs[5] = tMesh[5], vs[6] = tMesh[6], vs[7] = tMesh[7],
                                                    vs[8] = tMesh[8], vs[9] = tMesh[9], vs[10] = tMesh[10], vs[11] = tMesh[11],
                                                    vs[12] = tMesh[12], vs[13] = tMesh[13], vs[14] = tMesh[14], vs[15] = tMesh[15],
                                                    vs[16] = 1.0 // 행렬정보 사용
                                            }else{
                                                vs[0] = tMesh.x, vs[1] = tMesh.y, vs[2] = tMesh.z,
                                                    vs[3] = tMesh.rotateX, vs[4] = tMesh.rotateY, vs[5] = tMesh.rotateZ,
                                                    vs[6] = tMesh.scaleX, vs[7] = tMesh.scaleY, vs[8] = tMesh.scaleZ
                                                vs[16] = 0.0 // 행렬정보 사용 안함
                                            }

                                            ///////////////////////////////////////////////////////////////
                                            //스프라이트
                                            if (useSheet) {
                                                sheetInfo = gMatSprite[tUID_mat],
                                                    vs[18] = sheetInfo._col,
                                                    vs[19] = sheetInfo._row,
                                                    vs[20] = sheetInfo.curr % sheetInfo.col,
                                                    vs[21] = parseInt(sheetInfo.curr / sheetInfo.col)
                                            }
                                            vs[17] = useSheet
                                            if (tUID_mat != pUUID_mat) {
                                                ///////////////////////////////////////////////////////////////
                                                //노말
                                                if (useNormalBuffer) {
                                                    fs[10] = gMatLambert[tUID_mat], // 램버트 강도 설정
                                                        fs[11] = gMatSpecularPower[tUID_mat], // 스페큘라 파워
                                                        tColor2 = gMatSpecularColor[tUID_mat],
                                                        fs[12] = tColor2[0], // 스페큘라 컬러 r
                                                        fs[13] = tColor2[1], // 스페큘라 컬러 g
                                                        fs[14] = tColor2[2], // 스페큘라 컬러 b
                                                        fs[15] = tColor2[3] // 스페큘라 컬러 a

                                                    if (tNormalMaps = gMatNormalMaps[tUID_mat]) {
                                                        tNormal = tTextures[tNormalMaps[tNormalMaps.length - 1].tex.uuid]
                                                        if (tNormal != pNormal && tNormal != null) {
                                                            tGL.activeTexture(tGL.TEXTURE1),
                                                                tGL.bindTexture(tGL.TEXTURE_2D, tNormal),
                                                                tGL.uniform1i(tProgram.uNormalSampler, 1)
                                                        }
                                                        fs[16] = 1.0, // 노말맵 사용여부
                                                            fs[17] = gMatNormalPower[tUID_mat] // 노말맵강도
                                                    } else {
                                                        fs[16] = 0.0 // 노말맵 사용여부
                                                    }
                                                } else {
                                                    fs[16] = 0.0 // 노말맵 사용여부
                                                }
                                                ///////////////////////////////////////////////////////////////
                                                //스페큘러
                                                if (tSpecularMaps = gMatSpecularMaps[tUID_mat]) {
                                                    tSpecular = tTextures[tSpecularMaps[tSpecularMaps.length - 1].tex.uuid]
                                                    if (tSpecular != pSpecular && tSpecular != null) {
                                                        tGL.activeTexture(tGL.TEXTURE2),
                                                            tGL.bindTexture(tGL.TEXTURE_2D, tSpecular),
                                                            tGL.uniform1i(tProgram.uSpecularSampler, 2)
                                                    }
                                                    fs[18] = 1.0, // 스페큘러맵사용여부
                                                        fs[19] = gMatSpecularMapPower[tUID_mat] // 스페큘러맵 강도
                                                } else {
                                                    fs[18] = 0.0 // 스페큘러맵사용여부
                                                }
                                            }
                                            ///////////////////////////////////////////////////////////////
                                            // 드로우
                                            fs[9] = gAlpha[tUID_Mesh] // 메쉬의 알파
                                            var pointSize = gPointSize[tUID_Mesh];
                                            vs[25] = pointSize ? pointSize : 1.0;
                                            var pathtype = gPathType[tUID_Mesh];

                                            tGL.uniform1fv(tProgram.uVS, vs),
                                                ///////////////////////////////////////////////////////////////
                                                //와이어프레임 그리기
                                                gMatWire[tUID_mat] ? (
                                                    tColor2 = priMatWireColor[tUID_mat],
                                                        fs[4] = 1.0,
                                                        fs[5] = tColor2[0],
                                                        fs[6] = tColor2[1],
                                                        fs[7] = tColor2[2],
                                                        fs[8] = tColor2[3],
                                                        tGL.uniform1fv(tProgram.uFS, fs),
                                                        tGL.drawElements(tGL.LINES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0),
                                                        fs[4] = 0.0
                                                ) : 0,
                                                tGL.uniform1fv(tProgram.uFS, fs);
                                                if(pointSize){
                                                    tGL.drawArrays(tGL.POINTS, 0, tVBO.numItem);
                                                }else{
                                                    if(pathtype){
                                                        tGL.drawArrays(pathtype, 0, tVBO.numItem);
                                                        //tGL.drawArrays(tGL.LINES, 0, tVBO.numItem);
                                                        //tGL.drawArrays(tGL.LINE_STRIP, 0, tVBO.numItem);
                                                        //tGL.drawArrays(tGL.LINE_LOOP, 0, tVBO.numItem);
                                                        //tGL.drawElements(tGL.LINES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);
                                                        //tGL.drawElements(tGL.LINE_STRIP, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);
                                                        //tGL.drawElements(tGL.LINE_LOOP, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);
                                                    }else{
                                                        tGL.drawElements(tGL.TRIANGLES, tIBO.numItem, tGL.UNSIGNED_SHORT, 0);
                                                    }
                                                }
                                                pCull = tCull, pNormal = tNormal, pSpecular = tSpecular, pUUID_mat = tUID_mat
                                        }
                                        if (useSheet) {
                                            tGL.enable(tGL.DEPTH_TEST), tGL.depthFunc(tGL.LESS) // 스프라이트일 경우 기본상태로 되돌림
                                        }
                                    }
                                }
                            }
                        }

                        if (cameraLength > 1) {
                            tGL.bindFramebuffer(tGL.FRAMEBUFFER, pNormal = pSpecular = pShading = pUUID_mat = null);
                        }
                    }
                }
            };
            var mouseEvent = ['mousemove', 'mousedown', 'mouseup'];
            var mouseListener = function (e) {
                var ev = this.ev;
                e.stopPropagation(),
                    e.preventDefault(),
                    ev.x = e.clientX,
                    ev.y = this.height - e.clientY,
                    ev.move = true,
                    e.type == 'mousedown' ? (ev.down = true) : e.type == 'mouseup' ? (ev.up = true) : 0
            };
            var touchEvent = ['touchmove', 'touchstart', 'touchend'];
            var touchListener = function (e) {
                var ev = this.ev, t = e.type == 'touchend' ? 'changedTouches' : 'touches';
                e.stopPropagation(),
                    e.preventDefault(),
                    ev.x = e[t][0].clientX * pRatio,
                    ev.y = this.height - e[t][0].pageY * pRatio,
                    ev.move = true,
                    e.type == 'touchstart' ? (ev.down = true) : e.type == 'touchend' ? (ev.up = true) : 0
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
                mouse[this] = c.ev = {x:0, y:0},
                    i = mouseEvent.length;
                while (i--) {
                    c.addEventListener(mouseEvent[i], mouseListener, true),
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
                            autoSizer[this] = function () {
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
                        window.addEventListener('orientationchange', autoSizer[this]),
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
                var priListener = $getPrivate('MoGL', 'listener')
                var tListener
                if (!started[this.uuid]) {
                    self = this;
                    tListener = priListener[self.uuid]
                    var prev = performance.now()
                    var after = false
                    var fps = 60
                    started[this.uuid] = MoGL.addInterval(function (t) {
                        tListener = priListener[self.uuid]
                        if (tListener && tListener['WORLD_RENDER_BEFORE']) {
                            tListener['WORLD_RENDER_BEFORE'][0].f(fps, t, totalVertex, totalObject)
                        }
                        if (after && tListener && tListener['WORLD_RENDER_AFTER']) {
                            tListener['WORLD_RENDER_AFTER'][0].f(fps, t, totalVertex, totalObject)
                        }
                        if (after) {
                            after = false
                            t = performance.now()
                            fps = 1000 / (t - prev)
                            prev = t
                        }
                    });

                }
                //TODO 삭제를 어찌할꺼지?
                var self = this
                var renderFunc = function () {
                    self.render();
                    after = true
                    requestAnimationFrame(renderFunc);
                }
                requestAnimationFrame(renderFunc);
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

