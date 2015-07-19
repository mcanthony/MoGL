var StaticAnalyzer = (function() {

    var srcDir;

    // 파일별 소스 내용
    var srcStr = "    $setPrivate('Camera', {});\
    return Matrix.extend('Camera',{\
        description: '씬을 실제로 렌더링할 카메라 객체를 생성함',\
        sample: [\
            'var camera = new Camera();'\
        ],";

    var files = [
        "BlendMode.js",
        "Camera.js",
        "Geometry",
        "Group"
    ];

    var lines = [
        "var BlendMode = MoGL.extend('BlendMode', {",
        "return Matrix.extend('Camera',{",
        "return MoGL.extend('Geometry', {",
        "var Group = Matrix.extend('Group', {",
        "return MoGL.extend('Material',{",
        "return MoGL.extend('Matrix',{",
        "return Matrix.extend('Mesh', {",
        "return MoGL.extend('Primitive', {",
        "return MoGL.extend('Scene', {",
        "return MoGL.extend('Shader', {",
        "var Shading = MoGL.extend('Shading', {",
        "return MoGL.extend('Texture',{",
        "var Vector = MoGL.extend('Vector', {",
        "var Vertex = MoGL.extend('Vertex', {",
        "return MoGL.extend('World', {"
    ];

    var SA = function() {};

    SA.setRoot = function(srcDir) {
        srcDir = srcDir;
        return this;
    };

    SA.run = function() {
        var extendingPattern = '.extend(';
        var files = getFileList(srcDir);
        var lines = getLines(files, extendingPattern);
        var map = makeClsMoGLMap(lines, extendingPattern);
        var hier = getHier(map);
        var obj = makeObj(hier);
        var json = JSON.stringify(obj);
        drawDiagram(json);
    };

    // TODO
    // src 디렉토리 위치를 입력받아서 파일 목록 배열을 반환
    // 위에 있는 files 값 참고
    var getFileList = function(srcDir) {
        return files;
    };

    // TODO
    // 파일 목록(files) 내에서 extendingPattern 문자열을 포함한 행을 원소로 하는 배열 반환
    // 위에 있는 lines 값 참고
    var getLines = function(files, extendingPattern) {
        return lines;
    };

    // 위계 정보를 추출하여 위계 정보를 담고 있는 ClsMoGL를 원소로 하는 map 반환
    var makeClsMoGLMap = function(lines, extendingPattern) {
        var line, splitted, parent, child, tmp, regexp0,
            k, clsMoGLMap = {};

        regexp0 = /'\w+'|"\w+"/;
        for (k in lines) {

            line = lines[k];
            if (line.indexOf(extendingPattern) > 0) {
                splitted = line.split(extendingPattern);
                parent = splitted[0].substring(splitted[0].lastIndexOf(' ') + 1);
                tmp = regexp0.exec(splitted[1])[0];
                child = tmp.substring(1, tmp.length - 1);
            }

            if (clsMoGLMap[parent]) {
                clsMoGLMap[parent].childrenNames = child;
            } else {
                clsMoGLMap[parent] = new ClsMoGL();
                clsMoGLMap[parent].name = parent;
                clsMoGLMap[parent].childrenNames = child;
            }

            if (clsMoGLMap[child]) {
                clsMoGLMap[child].parentName = parent;
            } else {
                clsMoGLMap[child] = new ClsMoGL();
                clsMoGLMap[child].name = child;
                clsMoGLMap[child].parentName = parent;
            }
        }
        return clsMoGLMap;
    };

    // Hierarchy 정보를 담고 있는 ClsMoGL형 객체 반환
    var getHier = function(gatheringMap) {
        var hier, k;
        for (k in gatheringMap) {
            if (!gatheringMap[k].parentName) {
                hier = makeHier(gatheringMap, k);
                break;
            }
        }
        return hier;
    };

    // parent가 없는 root 클래스 이름을 입력받고,
    // Hierarchy 정보를 담고 있는 ClsMoGL형 객체 반환
    var makeHier = function(map, clsName) {
        var cls = map[clsName],
            childrenNames = cls.childrenNames,
            k, child;

        cls.parent = map[cls.parentName];

        for (k in childrenNames) {

            child = makeHier(map, childrenNames[k]);
            cls.children = child;
        }

        return cls;
    };

    // hierarchy 정보를 담고 있는 ClsMoGL형 객체를 입력받고,
    // hierarchy 정보를 담고 있는 Object를 생성해서 반환
    var makeObj = function(cls) {
        var obj = {}, child, children = [], i, l;
        obj.name = cls.name;
        for ( i = 0, l = cls.children.length ; i < l ; i++ ) {
            child = makeObj(cls.children[i]);
            children.push(child);
        }
        if (children.length > 0) {
            obj.children = children;
        }

        return obj;
    };

    // json을 받아 다이어그램 표시
    var drawDiagram = function(json) {
        var width = 1280,
            height = 700;

        var cluster = d3.layout.cluster()
            .size([height, width - 400]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(150,0)");


        var nodes = cluster.nodes(JSON.parse(json)),
            links = cluster.links(nodes);

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .attr("r", 10);

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 10)
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.name; });

        d3.select(self.frameElement).style("height", height + "px");
    };

    return SA;
}());

var ClsMoGL = function() {
    var name, parentName, parent, childrenNames = [], children = [];
    Object.defineProperties(this, {
        'name':{
            enumerable:true,
            get:function() {
                return name;
            },
            set:function(value) {
                name = value;
            }
        },
        'parentName':{
            enumerable:true,
            get:function() {
                return parentName;
            },
            set:function(value) {
                parentName = value;
            }
        },
        'parent':{
            enumerable:true,
            get:function() {
                return parent;
            },
            set:function(value) {
                parent = value;
            }
        },
        'childrenNames':{
            enumerable:true,
            get:function() {
                return childrenNames;
            },
            set:function(childName) {
                childrenNames.push(childName);
            }
        },
        'children':{
            enumerable:true,
            get:function() {
                return children;
            },
            set:function(child) {
                children.push(child);
            }
        }
    });
};

StaticAnalyzer.setRoot('src').run();