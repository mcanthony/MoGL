var makeUtil = (function(){
    'use strict';
    var makeBuffer = function makeBuffer(gl, target, data, stribe) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer),
        gl.bufferData(target, data, gl.STATIC_DRAW),
        buffer.data = data,
        buffer.stride = stribe,
        buffer.numItem = data.length / stribe,
        gl.bindBuffer(target, null);
        return buffer;
    };
    return {
        makeVBO:function makeVBO(gpu, geo, data, stribe) {
            var gl, buffer;
            gl = gpu.gl,
            buffer = gpu.vbo[geo];
            if (buffer) return;
            if(Array.isArray(data)) {
                data = new Float32Array(data);
            }
            buffer = makeBuffer(gl, gl.ARRAY_BUFFER, data, stribe),
            buffer.name = geo,
            buffer.type = 'VBO',
            gpu.vbo[geo] = buffer;
        },
        makeVNBO:function makeVNVO(gpu, geo, data, stribe) {
            var gl, buffer;
            gl = gpu.gl,
            buffer = gpu.vnbo[geo];
            if (buffer) return;
            if (Array.isArray(data)) {
                data = new Float32Array(data);
            }
            buffer = makeBuffer(gl, gl.ARRAY_BUFFER, data, stribe),
            buffer.name = geo,
            buffer.type = 'VNBO';
            gpu.vnbo[geo] = buffer;
        },
        makeIBO:function makeIBO(gpu, geo, data, stribe) {
            var gl, buffer;
            gl = gpu.gl,
            buffer = gpu.ibo[geo];
            if (buffer) return;
            if (Array.isArray(data)) {
                data = new Uint16Array(data);
            }
            buffer = makeBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, stribe),
            buffer.name = geo,
            buffer.type = 'IBO';
            gpu.ibo[geo] = buffer;
        },
        makeUVBO:function makeUVBO(gpu, geo, data, stribe) {
            var gl, buffer;
            gl = gpu.gl,
            buffer = gpu.uvbo[geo];
            if (buffer) return;
            if (Array.isArray(data)) {
                data = new Float32Array(data);
            }
            buffer = makeBuffer(gl, gl.ARRAY_BUFFER, data, stribe),
            buffer.name = geo,
            buffer.type = 'UVBO';
            gpu.uvbo[geo] = buffer;
        },
        makeProgram:function makeProgram(gpu, name, vSource, fSource) {
            var gl, vShader, fShader, program, i, len, tList;
            gl = gpu.gl,
            vShader = gl.createShader(gl.VERTEX_SHADER),
            fShader = gl.createShader(gl.FRAGMENT_SHADER),
            gl.shaderSource(vShader, vSource.shaderStr),
            gl.compileShader(vShader),
            gl.shaderSource(fShader, fSource.shaderStr),
            gl.compileShader(fShader);

            program = gl.createProgram(),
            gl.attachShader(program, vShader),
            gl.attachShader(program, fShader),
            gl.linkProgram(program),
            vShader.name = vSource.id,
            fShader.name = fSource.id,
            program.name = name;
            if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                // MoGL error를 사용할 수 없을까.
                throw new Error('프로그램 셰이더 초기화 실패');
            }
            gl.useProgram(program),
            tList = vSource.attributes,
            len = tList.length;
            for (i = 0; i < len; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, gpu.vbo['null']),
                gl.enableVertexAttribArray(program[tList[i]] = gl.getAttribLocation(program, tList[i])),
                gl.vertexAttribPointer(program[tList[i]], gpu.vbo['null'].stride, gl.FLOAT, false, 0, 0),
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
        makeTexture:function makeTexture(gpu, texture) {
            var gl, glTexture;
            gl = gpu.gl;
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
            gl.bindTexture(gl.TEXTURE_2D, null);
        },
        makeFrameBuffer:function makeFrameBuffer(gpu, camera, cvs) {
            var gl, texture, fBuffer, rBuffer, tArea, cvsW, cvsH, pRatio;
            if (!cvs) return;
            cvsW = cvs.width,
            cvsH = cvs.height,
            pRatio = window.devicePixelRatio;
            if (camera.renderArea) {
                tArea = camera.renderArea;
            } else {
                tArea = [0, 0, cvsW, cvsH];
            }
            gl = gpu.gl,
            fBuffer = gl.createFramebuffer(),
            fBuffer.x = tArea[0], fBuffer.y = tArea[1],
            fBuffer.width = Math.min(tArea[2] * pRatio, cvsW),
            fBuffer.height = Math.min(tArea[3] * pRatio, cvsH),
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
                frameBuffer:fBuffer,
                texture:texture
            };
        },
	    vertexShaderParser: function vertexShaderParser(source) {
		    var i, temp, str, resultObject, code;
		    code = source.code,
		    resultObject = {
			    uniforms: [],
			    attributes: [],
			    id: code.id,
			    shaderStr: null
		    },
		    str = "",
		    temp = code.attributes,
		    i = temp.length;
		    while (i--) {
			    str += 'attribute ' + temp[i] + ';\n',
			    resultObject.attributes.push(temp[i].split(' ')[1]);
		    }
		    temp = code.uniforms,
			    i = temp.length;
		    while (i--) {
			    str += 'uniform ' + temp[i] + ';\n',
			    resultObject.uniforms.push(temp[i].split(' ')[1]);
		    }
		    temp = code.varyings,
		    i = temp.length;
		    while (i--) {
			    str += 'varying ' + temp[i] + ';\n';
		    }
		    str += VertexShader.baseFunction,
		    str += 'void main(void){\n',
		    str += code.main + ';\n',
		    str += '}\n'
		    resultObject.shaderStr = str
		    return resultObject;
	    },
	    fragmentShaderParser : function fragmentShaderParser(source) {
		    var i, temp, str, resultObject, code;
		    code = source.code,
		    resultObject = {
			    uniforms: [],
			    id: code.id,
			    shaderStr: null
		    },
		    str = "";
		    if (code.precision) {
			    str += 'precision ' + code.precision + ';\n';
		    }
		    else {
			    str += 'precision mediump float;\n';
		    }
		    temp = code.uniforms,
		    i = temp.length;
		    while (i--) {
			    str += 'uniform ' + temp[i] + ';\n',
			    resultObject.uniforms.push(temp[i].split(' ')[1]);
		    }
		    temp = code.varyings,
		    i = temp.length;
		    while (i--) {
			    str += 'varying ' + temp[i] + ';\n';
		    }
		    str += 'void main(void){\n',
		    str += code.main + ';\n',
		    str += '}\n'
		    resultObject.shaderStr = str
		    return resultObject;
	    }
    };
})();