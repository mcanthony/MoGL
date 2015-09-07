//math helper
var $color, GLMAT_EPSILON, SIN, COS, TAN, ATAN, ATAN2, ASIN, SQRT, CEIL, ABS, PI, PIH, PID, D2R, R2D;
$color = (function(){
    var co = [];
    return function(v){
        if (typeof v == 'string' && v.charAt(0) == '#') {
            if (v.length == 4) {
                v = v.substr(1,3)
                v = '#'+v[0]+v[0]+v[1]+v[1]+v[2]+v[2]
            }
            co[0] = parseInt(v.substr(1, 2), 16) / 255,
            co[1] = parseInt(v.substr(3, 2), 16) / 255,
            co[2] = parseInt(v.substr(5, 2), 16) / 255;
            if (v.length > 7) {
                co[3] = parseFloat(v.substr(7));
                if (co[3] > 1) co[3] = 1;
            } else {
                co[3] = 1;
            }
        } else if ('r' in v) {
            co[0] = v.r, co[1] = v.g, co[2] = v.b, co[3] = 'a' in v ? v.a : 1;
        } else {
            co[0] = v[0], co[1] = v[1], co[2] = v[2], co[3] = '3' in v ? v[3] : 1;
        }
        return co;
    };
})();
GLMAT_EPSILON = 0.000001,
TAN = Math.tan, ATAN = Math.atan, ATAN2 = Math.atan2, ASIN = Math.asin,
SQRT = Math.sqrt, CEIL = Math.ceil, ABS = Math.abs, PI = Math.PI, PIH = PI * 0.5, PID = PI * 2, D2R = PI / 180, R2D = 180 / PI;


SIN = (function(){
    var sin = Math.sin, s = {};
    return function(r){
        return s[r] || (s[r] = sin(r));
    };
})(),
COS = (function(){
    var cos = Math.cos, c = {};
    return function(r){
        return c[r] || (c[r] = cos(r));
    };
})();