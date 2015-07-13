var MergeManager = (function () {
    'use strict';
    //private
    var maxVertex = 3*16000
    var maxUniform = 150
    //shared private

    $setPrivate('MergeManager', {});

    var priGeo = $getPrivate('Mesh', 'geometry')
    var priMat = $getPrivate('Mesh', 'material')
    var priMatColor = $getPrivate('Material', 'color')

    var items = {}
    return MoGL.extend('MergeManager', {
        description: "",
        param: [],
        sample: [],
        exception: [],
        value: function MergeManager() {
        }
    })
    //.static('mergePropertyChange',{
    //  value : (function(){
    //      var ti=[],tr=[], i,len
    //      var offset,checkNum= 0, checkNumItem = 0
    //      var tList
    //      var tItem
    //      var t
    //      return function(gl,list,tProgram){
    //          // 업데이트 시만 변경
    //          checkNum= 0, checkNumItem = 0
    //          offset = list.indexBuffer.numItem
    //          tList = list.items
    //          t = 0
    //          i = tList.length
    //          len = tList.length-1
    //          ti.length=0
    //          tr.length=0
    //          while(i--){
    //              //TODO 헐...프로퍼티 리스트도 캐시화 해야되는게냐...
    //              tItem = tList[len-i]
    //              checkNumItem +=priGeo[tItem.uuid].index.length
    //              checkNum++
    //
    //              ti.push(tItem.x, tItem.y, tItem.z)
    //              tr.push(tItem.rotateX, tItem.rotateY, tItem.rotateZ)
    //              if(checkNum==maxUniform){
    //                  gl.uniform3fv(tProgram['uPosition'], ti);
    //                  gl.uniform3fv(tProgram['uRotate'], tr);
    //                  offset-=checkNumItem
    //                  gl.drawElements(gl.TRIANGLES, checkNumItem, gl.UNSIGNED_INT, offset*Uint32Array.BYTES_PER_ELEMENT);
    //                  checkNumItem = 0
    //                  checkNum = 0
    //                  t=0
    //                  ti.length=0
    //                  tr.length=0
    //              }
    //          }
    //          if(checkNumItem>0){
    //              gl.uniform3fv(tProgram['uPosition'], ti);
    //              gl.uniform3fv(tProgram['uRotate'], tr);
    //              gl.drawElements(gl.TRIANGLES, checkNumItem, gl.UNSIGNED_INT, 0);
    //          }
    //      }
    //  })()
    //})
    .static('mergePropertyChange',{
        value : (function(){
            var i, j, k, len;
            var tx, ty, tz, rx, ry, rz, sx, sy, sz, tP, tR, tS,uuid;
            var t, t1, t2, t3, tCount;
            var changeRotate, changePosition, changeScale;
            return function (gpu, data, updateData, changePropertys) {
                i = updateData.length,
                changePosition = changePropertys['position'],
                changeRotate = changePropertys['rotate'],
                changeScale = changePropertys['scale']
                var tData
                if (changePosition || changeRotate || changeScale) {
                    while (i--) {
                        t = updateData[i],
                        uuid = t.uuid,
                        tData = data[items[uuid].listIDX],
                        tP = tData.positionData, tR = tData.rotateData, tS = tData.scaleData
                        len = priGeo[uuid].position.length,
                        tCount = len / 3,
                        k = items[uuid].idx*len,
                        tx = t.x, ty = t.y, tz = t.z,
                        rx = t.rotateX, ry = t.rotateY, rz = t.rotateZ,
                        sx = t.scaleX, sy = t.scaleY, sz = t.scaleZ,
                        j = tCount
                        while (j--) {
                            t1 = k, t2 = k + 1, t3 = k + 2
                            tP[t1] = tx, tP[t2] = ty, tP[t3] = tz,
                            tR[t1] = rx, tR[t2] = ry, tR[t3] = rz,
                            tS[t1] = sx, tS[t2] = sy, tS[t3] = sz,
                            k=k+3
                        }
                    }
                    if(tData){
                        tData.positionBuffer.updated = changePosition
                        tData.rotateBuffer.updated = changeRotate
                        tData.scaleBuffer.updated = changeScale
                        updateData.length=0
                    }
                }

            }
        })()
    })
    .static('mergeData',{
        value : (function(){
            var addList;
            var checkVertex;
            checkVertex = 0;
            addList = function(v){
                v.push( {
                    maxIndex : 0,
                    items:[],

                    vertexData: [],
                    indexData: [],
                    positionData: [],
                    rotateData:[],
                    //propertys
                    scaleData: [],
                    materialData: [],
                    //buffers
                    vertexBuffer: null,
                    indexBuffer: null,
                    scaleBuffer: null,
                    positionBuffer: null,
                    rotationBuffer:null,
                    materialBuffer:null
                })
                checkVertex=0
                console.log('머지페이지추가', v.length)
            }
            var targetVBOS= {}
            return function mergeData(gpu,data, mergeTargets){
                var j, len, iMax;
                var uuid, uuids, temp;
                var tVertex, tVertexCount, tList, tGeo, tIDX;
                var lastLen;
                uuids = data.uuids
                len = mergeTargets.length
                if(len==0) return data
                if(data.lists.length==0){
                    addList(data.lists)
                }

                var textureIDX = 1.1

                while(len--){
                    temp = mergeTargets[0]
                    uuid = temp.uuid
                    tGeo = priGeo[uuid]
                    uuids[uuid] = temp

                    tVertex = tGeo.position
                    tVertexCount = (tVertex.length/3)^0

                    if(checkVertex+tVertexCount > maxVertex){
                        addList(data.lists)
                    }else{
                        checkVertex+=tVertexCount
                    }
                    tIDX = data.lists.length-1
                    tList = data.lists[tIDX]
                    if(!items[uuid]) {
                        tList.items.push(temp)
                        items[uuid] = {idx : tList.items.length-1, listIDX : data.lists.length-1}
                    }
                    // 버텍스입력하고
                    for (j = 0; j < tVertexCount; j++) {
                        tList.vertexData.push(tVertex[j*3],tVertex[j*3+1],tVertex[j*3+2])
                        tList.vertexData.push(tGeo.normal[j*3],tGeo.normal[j*3+1],tGeo.normal[j*3+2])

                        tList.positionData.push(temp.x,temp.y,temp.z)
                        tList.rotateData.push(temp.rotateX,temp.rotateY,temp.rotateZ)
                    }


                    // 인덱스 입력하고
                    iMax = tGeo.index.length
                    lastLen = tList.maxIndex
                    var tMax =0
                    for (j = 0; j < iMax; j++) {
                        tList.indexData.push(lastLen + tGeo.index[j])
                        if(tMax<=tGeo.index[j]) tMax = tGeo.index[j]
                    }
                    tList.maxIndex = tMax + lastLen+1

                    // 프로퍼티 입력하고
                    var tUV = tGeo.uv
                    var tColor = priMatColor[priMat[uuid].uuid]
                    for (j = 0; j < tVertexCount; j++) {
                        tList.scaleData.push(temp.scaleX, temp.scaleY, temp.scaleZ)
                        tList.materialData.push(textureIDX,tUV[j*2],tUV[j*2+1],tColor[0],tColor[1],tColor[2],tColor[3])
                    }
                    textureIDX++
                    if(textureIDX>10) textureIDX = 1.1

                    targetVBOS[tIDX] = tList
                    mergeTargets.shift()


                }

                // 버퍼를 맹그러
                for(var k in targetVBOS){
                    tList = data.lists[k]
                    tList.vertexBuffer = makeUtil.makeVBO(gpu, 'mergeVBO' + k, tList.vertexData, 6),
                    tList.indexBuffer = makeUtil.makeIBO(gpu, 'mergeIBO' + k, tList.indexData, 1),
                    tList.scaleBuffer = makeUtil.makeVBO(gpu, 'mergeScale' + k, tList.scaleData, 3),
                    tList.positionData = new Float32Array(tList.positionData)
                    tList.rotateData = new Float32Array(tList.rotateData)
                    tList.scaleData = new Float32Array(tList.scaleData)
                    tList.positionBuffer = makeUtil.makeVBO(gpu, 'mergePosition' + k, tList.positionData, 3),
                    tList.rotateBuffer = makeUtil.makeVBO(gpu, 'mergeRotate' + k, tList.rotateData, 3),
                    tList.materialBuffer = makeUtil.makeVBO(gpu, 'mergeMaterial' + k, tList.materialData, 7)
                }


                return data
            }
        })()
    })
    .build();
})();