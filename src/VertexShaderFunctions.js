var VertexShader = {
    baseFunction: "mat4 positionMTX(vec3 t)" +
    "{\n" +
    "   return mat4( 1,0,0,0, 0,1,0,0, 0,0,1,0, t[0],t[1],t[2],1);\n" +
    "}\n" +
    'mat4 scaleMTX(vec3 t)' +
    '{\n' +
    '   return mat4( t[0],0,0,0, 0,t[1],0,0, 0,0,t[2],0, 0,0,0,1);\n' +
    '}\n' +
    'mat4 rotationMTX(vec3 t)' +
    '{\n' +
    '   float s = sin(t[0]);float c = cos(t[0]);\n' +
    '   mat4 m1 = mat4( 1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1);s = sin(t[1]);c = cos(t[1]);\n' +
    '   mat4 m2 = mat4(c,0,-s,0, 0,1,0,0, s,0,c,0,  0,0,0,1);s = sin(t[2]);c = cos(t[2]);\n' +
    '   mat4 m3 = mat4(c,s,0,0, -s,c,0,0, 0,0,1,0,  0,0,0,1);\n' +
    '   return m3*m2*m1;\n' +
    '}\n'
};
Object.freeze(VertexShader);
