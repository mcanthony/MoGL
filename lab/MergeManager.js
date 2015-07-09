var MergeManager = (function () {
    'use strict';
    //private
    var maxVertex = 40000
    var maxUniform = 150
    //shared private

    $setPrivate('MergeManager', {});

    var priGeo = $getPrivate('Mesh', 'geometry')
    var priMat = $getPrivate('Mesh', 'material')
    var priMatColor = $getPrivate('Material', 'color')
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
            var i, i2, j, j2, k;
            var tx,ty,tz,rx,ry,rz,tP,tR;
            var tItem,tVertexCount;
            var prevLen,changeRotate, changePosition;
            var maxNum = 8
            return function (gpu, data,changePropertys) {
                var list = data.items
                i = list.length, i2 = list.length-1,
                prevLen = 0
                changePosition = changePropertys['position']
                changeRotate = changePropertys['rotate']
                if(changePosition || changeRotate) {
                    while (i--) {
                        tItem = list[i2 - i],
                        tVertexCount = priGeo[tItem.uuid].position.length / 3,
                        j = tVertexCount % maxNum, j2 = 0
                        while (j--)
                            k = prevLen + j2 * 3, j2++,
                            tx = tItem.x, ty = tItem.y, tz = tItem.z,
                            rx = tItem.rotateX, ry = tItem.rotateY, rz = tItem.rotateZ,
                            tP = data.positionData, tR = data.rotateData,
                            changePosition ? (tP[k++] = tx, tP[k++] = ty, tP[k++] = tz) : 0,
                            changeRotate ? (tR[k++] = rx, tR[k++] = ry, tR[k++] = rz) : 0

                        j = (tVertexCount / maxNum ) ^ 0, j2 = 0
                        while (j--)
                            k = prevLen + j2 * maxNum * 3,
                            tx = tItem.x, ty = tItem.y, tz = tItem.z,
                            rx = tItem.rotateX, ry = tItem.rotateY, rz = tItem.rotateZ,
                            tP = data.positionData, tR = data.rotateData,
                            changePosition ? (
                                tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz,
                                    tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz, tP[k++] = tx, tP[k++] = ty, tP[k++] = tz
                            ) : 0,
                            k = prevLen + j2 * maxNum * 3,
                            changeRotate ? (
                                tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz,
                                    tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz, tR[k++] = rx, tR[k++] = ry, tR[k++] = rz
                            ) : 0,
                            j2++

                        data.positionData.updated = changePosition
                        data.rotateBuffer.updated = changeRotate
                        prevLen += tVertexCount * 3
                    }
                }

                return data
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
                    itemNum:0,

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
                var i, j, len,iMax;
                var uuid, uuids, temp;
                var tVertex, tVertexCount, tList,tGeo,tIDX;
                var lastLength;
                uuids = data.uuids
                len = mergeTargets.length
                if(len==0) return data
                if(data.lists.length==0){
                    addList(data.lists)
                }

                var ttt = 1.1

                while(len--){
                    temp = mergeTargets[0]
                    uuid = temp.uuid
                    tGeo = priGeo[uuid]
                    uuids[uuid] = temp

                    tVertex = tGeo.position
                    tVertexCount = tVertex.length/3

                    if(checkVertex+tVertexCount > maxVertex){
                        addList(data.lists)
                    }else{
                        checkVertex+=tVertexCount
                    }
                    tIDX = data.lists.length-1
                    tList = data.lists[tIDX]
                    if(tList.items.indexOf(temp)==-1) tList.items.push(temp)
                    // 버텍스입력하고
                    for (j = 0; j < tVertexCount; j++) {
                        tList.vertexData.push(tVertex[j*3],tVertex[j*3+1],tVertex[j*3+2])
                        tList.vertexData.push(tGeo.normal[j*3],tGeo.normal[j*3+1],tGeo.normal[j*3+2])

                        tList.positionData.push(temp.x,temp.y,temp.z)
                        tList.rotateData.push(temp.rotateX,temp.rotateY,temp.rotateZ)
                    }
                    // 인덱스 입력하고
                    iMax = tGeo.index.length
                    lastLength = tList.maxIndex
                    var tMax =0
                    for (j = 0; j < iMax; j++) {
                        tList.indexData.push(lastLength + tGeo.index[j])
                        if(tMax<=tGeo.index[j]) tMax = tGeo.index[j]
                    }
                    tList.maxIndex = tMax + lastLength+1

                    // 프로퍼티 입력하고
                    var tUV = tGeo.uv
                    var uIDX = tList.itemNum%maxUniform
                    var tColor = priMatColor[priMat[uuid].uuid]
                    tList.itemNum++
                    for (j = 0; j < tVertexCount; j++) {
                        tList.scaleData.push(temp.scaleX, temp.scaleY, temp.scaleZ)
                        tList.materialData.push(uIDX,ttt,tUV[j*2],tUV[j*2+1],tColor[0],tColor[1],tColor[2],tColor[3])
                    }
                    ttt++
                    if(ttt>10) ttt = 1.1

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
                    tList.positionBuffer = makeUtil.makeVBO(gpu, 'mergePosition' + k, tList.positionData, 3),
                    tList.rotateBuffer = makeUtil.makeVBO(gpu, 'mergeRotate' + k, tList.rotateData, 3),
                    tList.materialBuffer = makeUtil.makeVBO(gpu, 'mergeMaterial' + k, tList.materialData, 8)
                }


                return data
            }
        })()
    })
    .build();
})();