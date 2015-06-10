/**
 * Created by redcamel on 2015-05-22.
 */
var FreeController = (function () {
    var MAT1 = Matrix(), MAT2 = Matrix();
    return MoGL.extend(function FreeController(camera) {
        if(!(camera instanceof Camera)) this.error(0);
        this._camera = camera;
        this._displacement = [0,0,0];
        this._speed = 1000.0;
        this._smoothDelay = 0.1;
        this._desirePosition=this._camera.position;
    })
    .method('autoBindKey', function autoBindKey() {
        //TODO 기본 조작키를 세팅하자..c
    })
    .method('bindKey', function bindKey() {
        //TODO 전후좌우 로테이션등의 키를 바인딩할수있게 개선
    })
    .method('setSpeed', function setSpeed(value){
        this._speed = value;
    })
    .method('setSmoothDelay', function setSmoothDelay(value){
        this._smoothDelay = value > 0.5 ? 0.5 : value;
    })
    .method('getSpeed', function getSpeed(){
         return this._speed;
    })
    .method('getSmoothDelay', function getSmoothDelay(){
        return this._smoothDelay;
    })
    .method('update', function update(){
        var forward = false, back = false, up = false, down = false, left = false, right = false;
        var updateRotateX,updateRotateY,updateRotateZ,speed;
        var downKey, tCamera;
        updateRotateX = updateRotateY = updateRotateZ = 0,
        downKey = KeyBoard.downed,
        tCamera = this._camera;
        if (downKey[KeyBoard.A]) left = true;
        if (downKey[KeyBoard.D]) right = true;
        if (downKey[KeyBoard.R]) up = true;
        if (downKey[KeyBoard.F]) down = true;
        if (downKey[KeyBoard.W]) forward = true;
        if (downKey[KeyBoard.S]) back = true;

        speed = this._speed * 0.001;

        if (downKey[KeyBoard.Q]) updateRotateY = -0.01 * speed;
        if (downKey[KeyBoard.E]) updateRotateY = 0.01 * speed;
        if (downKey[KeyBoard.T]) updateRotateX = -0.01 * speed;
        if (downKey[KeyBoard.G]) updateRotateX = 0.01 * speed;

        this._displacement[0] = right ? -speed : (left ? speed : 0),
        this._displacement[1] = up ? -speed : (down ? speed : 0),
        this._displacement[2] = forward ? -speed : (back ? speed : 0);

        MAT1.matIdentity(),
        MAT1.matTranslate(this._displacement[0], this._displacement[1], this._displacement[2]),
        MAT2.matIdentity(),
        MAT2.matRotateZ(tCamera.rotateZ),
        MAT2.matRotateY(tCamera.rotateY),
        MAT2.matRotateX(tCamera.rotateX),
        MAT2.matMultiply(MAT1),

        this._desirePosition[0] += MAT2.raw[12],
        this._desirePosition[1] += MAT2.raw[13],
        this._desirePosition[2] += MAT2.raw[14],

        tCamera.x += (this._desirePosition[0] - tCamera.x)*this._smoothDelay,
        tCamera.y += (this._desirePosition[1] - tCamera.y)*this._smoothDelay,
        tCamera.z += (this._desirePosition[2] - tCamera.z)*this._smoothDelay,
        tCamera.rotateX += updateRotateX,
        tCamera.rotateY += updateRotateY ,
        this._displacement[0]=0,
        this._displacement[1]=0,
        this._displacement[2]=0,
        updateRotateX = 0,
        updateRotateY = 0;
    })
    .build();
})();
