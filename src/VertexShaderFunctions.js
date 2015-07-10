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
    '}\n' +
    'mat4 quaternionZYX(vec3 t)' +
    '{\n' +
    '    float cos0= cos(t[0]*0.5);\n' +
    '    float cos1= cos(t[1]*0.5);\n' +
    '    float cos2= cos(t[2]*0.5);\n' +
    '    float sin0= sin(t[0]*0.5);\n' +
    '    float sin1= sin(t[1]*0.5);\n' +
    '    float sin2= sin(t[2]*0.5);\n' +
    '    float w = cos2 * cos1 * cos0 + sin2 * sin1 * sin0;\n' +
    '    float x = cos2 * cos1 * sin0 - sin2 * sin1 * cos0;\n' +
    '    float y = cos2 * sin1 * cos0 + sin2 * cos1 * sin0;\n' +
    '    float z = sin2 * cos1 * cos0 - cos2 * sin1 * sin0;\n' +
    //'    float w = cos(t[2]*0.5) * cos1 * cos(t[0]*0.5) + sin(t[2]*0.5) * sin(t[1]*0.5) * sin(t[0]*0.5);\n' +
    //'    float x = cos(t[2]*0.5) * cos(t[1]*0.5) * sin(t[0]*0.5) - sin(t[2]*0.5) * sin(t[1]*0.5) * cos(t[0]*0.5);\n' +
    //'    float y = cos(t[2]*0.5) * sin(t[1]*0.5) * cos(t[0]*0.5) + sin(t[2]*0.5) * cos(t[1]*0.5) * sin(t[0]*0.5);\n' +
    //'    float z = sin(t[2]*0.5) * cos(t[1]*0.5) * cos(t[0]*0.5) - cos(t[2]*0.5) * sin(t[1]*0.5) * sin(t[0]*0.5);\n' +
    '    mat4 quaternionMTX = mat4(\n' +
    '        pow(w, 2.0) + pow(x, 2.0) - pow(y, 2.0) - pow(z, 2.0), 2.0*(x*y + w*z), 2.0*(x*z - w*y), 0,\n' +
    '        2.0*(x*y - w*z), pow(w, 2.0) - pow(x, 2.0) + pow(y, 2.0) - pow(z, 2.0), 2.0*(y*z + w*x), 0,\n' +
    '        2.0*(x*z + w*y), 2.0*(y*z - w*x), pow(w, 2.0) - pow(x, 2.0) - pow(y, 2.0) + pow(z, 2.0), 0,\n' +
    '        0, 0, 0, 1\n' +
    '    );\n' +
    '    return quaternionMTX;\n' +
    '}\n' +
    'mat4 quaternionXYZ(vec3 t)' +
    '{\n' +
    '    float cos0= cos(t[0]*0.5);\n' +
    '    float cos1= cos(t[1]*0.5);\n' +
    '    float cos2= cos(t[2]*0.5);\n' +
    '    float sin0= sin(t[0]*0.5);\n' +
    '    float sin1= sin(t[1]*0.5);\n' +
    '    float sin2= sin(t[2]*0.5);\n' +
    '    float w = cos2 * cos1 * cos0 - sin2 * sin1 * sin0;\n' +
    '    float x = cos2 * cos1 * sin0 + sin2 * sin1 * cos0;\n' +
    '    float y = cos2 * sin1 * cos0 - sin2 * cos1 * sin0;\n' +
    '    float z = sin2 * cos1 * cos0 + cos2 * sin1 * sin0;\n' +
    '    mat4 quaternionMTX = mat4(\n' +
    '        pow(w, 2.0) + pow(x, 2.0) - pow(y, 2.0) - pow(z, 2.0), 2.0*(x*y + w*z), 2.0*(x*z - w*y), 0,\n' +
    '        2.0*(x*y - w*z), pow(w, 2.0) - pow(x, 2.0) + pow(y, 2.0) - pow(z, 2.0), 2.0*(y*z + w*x), 0,\n' +
    '        2.0*(x*z + w*y), 2.0*(y*z - w*x), pow(w, 2.0) - pow(x, 2.0) - pow(y, 2.0) + pow(z, 2.0), 0,\n' +
    '        0, 0, 0, 1\n' +
    '    );\n' +
    '    return quaternionMTX;\n' +
    '}\n'
};
Object.freeze(VertexShader);
