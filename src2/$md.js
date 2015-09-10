//markdown
$md = function(classes){
    var list, val, func, sort, toStr, toValue, fieldDetail, methodDetail;
    sort = function(a, b){
        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    },
    list = function(type, md, v){
        var d, i, j;
        if (v.length) {
            v.sort(sort);
            md[md.length] = '\n**' + type + '**\n';
            for (i = 0, j = v.length; i < j; i++){
                d = v[i]['*description'],
                md[md.length] = '* [' + v[i].name + '](#' + v[i].name + ') - ' + 
                    d.split('\n')[0].replace(/^[*] |<[^<]*>/,'').substr(0, 20).trim() + (d.length > 20 ? '...' : '');
            }
        }
    },
    toStr = function(v){
        v = Array.isArray(v) ? v.join('\n') : !v ? '' : v;
        v = v.replace(/\[#([^\]]+)\]/g, '<i style="color:#a00">$1</i>').replace(/[:][*]/g, ':<i style="color:#a00">&#42;</i>');
        return v;
    },
    toValue = function(v){
        if (v === null || v == 'null') return null;
        if (v === undefined || v == 'undefined') return null;
        if (typeof v == 'string' ) return '"' + v + '"';
        return v;
    },
    val = function(type, md, ref){
            var v = [], temp = ref._info['_'+type], temp1 = ref['_'+type], t, i, j, k;
            t = [];
            for (k in temp) t.push(temp[k]);
            t.sort(sort);
            temp = t;
            for (i = 0, j = temp.length; i < j; i++) {
                k = temp[i];
                if (!k._checked) {
                    k._checked = true;
                    k['*type'] = k['*type'] || '?',
                    k['*default'] = k['*default'] || 'undefined',
                    k['*sample'] = toStr(k['*sample']) || '//none',
                    k['*description'] = toStr(k['*description']),
                    k['*enumerable'] = temp1[i] && temp1[i].enumerable || false, 
                    k['*configurable'] = temp1[i] && temp1[i].configurable || false;
                    k['*writable'] =  temp1[i] ? ('writable' in temp1[i]) || ('set' in temp1[i]) : false;
                }
                v[v.length] = k;
            }
            list(type, md, v);
            return v;
    }
    func = function(type, md, ref){
        var v = [], temp = ref._info['_'+type], temp1 = ref['_'+type], t, i, j, k;
        t = [];
        for (k in temp) t.push(temp[k]);
        t.sort(sort);
        temp = t;
        for (i = 0, j = temp.length; i < j; i++) {
            k = temp[i];
            if (!k._checked) {
                k._checked = true;
                k['*description'] = toStr(k['*description'] || 'prepare document');
                k['*param'] = toStr(k['*param']) || 'none';
                k['*return'] = toStr(k['*return']) || 'none';
                k['*sample'] = toStr(k['*sample']) || '//none';
            }
            v[v.length] = k;
        }
        list(type, md, v);
        return v;
    },
    fieldDetail = function(type, v, md) {
        var i, j, k, m, n;
        if (v.length) {
            for (i = 0, j = v.length; i < j; i++){
                k = v[i];
                md[md.length] = '\n<a name="' + k.name + '"></a><div style="background:#eee">';
                md[md.length] = '###' + k.name;
                md[md.length] = '</div>\n**description**\n';
                md[md.length] = '\n'+k['*description'];
                
                md[md.length] = '\n**value**\n';
                if ('value' in k) {
                    md[md.length] = '\n* fixed - ' + toValue(k.value);
                } else if ('*default' in k) {
                    md[md.length] = '\n* default - ' + toValue(k['*default']);
                }
                md[md.length] = '* type - <i style="color:#a00">' + k['*type'] + '</i>';
                md[md.length] = '* <i style="color:#00a">' + type + '</i>';
                
                md[md.length] = '\n**setting**\n';
                md[md.length] = '* writable : ' + k['*writable'] + 
                    '\n* enumerable : ' + k['*enumerable'] + 
                    '\n* configurable :' + k['*configurable'];
                    
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k['*sample'];
                md[md.length] = '```';
                md[md.length] = '\n[top](#)';
            }
        }
    },
    methodDetail = function(type, v, md){
        var i, j, k, l, m, n, o, c;
        if (v.length) {
            for (i = 0, j = v.length; i < j; i++){
                k = v[i];
                md[md.length] = '\n<a name="' + k.name + '"></a><div style="background:#eee">';
                o = [];
                if (k.param != 'none') {
                    l = k['*param'].split('\n');
                    for (m = 0, n = l.length; m < n ; m++) {
                        c = l[m].charAt(0);
                        if (c != ' ' && c != '*' && !/[0-9]/.test(c)) {
                            o.push(toStr(l[m].split('-')[0].trim()));
                        }
                    }
                }
                md[md.length] = '###' + k.name + '(' + o.join(', ') + ')</div>';
                md[md.length] = '\n<i style="color:#00a">' + type + '</i>';
                md[md.length] = '\n**description**\n';
                md[md.length] = '\n'+k['*description'];
                md[md.length] = '\n**param**\n';
                if (k.param != 'none' && n) {
                    for(m = 0; m < n ; m++){
                        c = l[m].charAt(0);
                        if (c == ' ' || c == '*' || /[0-9]/.test(c)) {
                            md[md.length] = '    ' + toStr(l[m]);
                        } else {
                            md[md.length] = (m + 1) + '. ' + toStr(l[m]);
                        }
                    }
                } else {
                    md[md.length] = 'none';
                }
                md[md.length] = '\n**return**\n';
                md[md.length] = '\n'+(k['*return'].length ? k['*return'].replace(/^this/, 'this - return self for method chaining') : 'none');
                /*
                md[md.length] = '\n**exception**\n';
                md[md.length] = '\n- '+k.exception;
                */
                md[md.length] = '\n**sample**\n';
                md[md.length] = '```javascript';
                md[md.length] = k['*sample'];
                md[md.length] = '```';
                md[md.length] = '\n[top](#)';
            }
        }
    };
    return function(){
        var md, ref, temp, temp1, i, j, k, l, m, n,
            parents, children, fields, methods, constants, events, statics, inherited;
        ref = classes[this.className].define;
//title
        md = ['#' + this.className];

//top navi
    //parent
        if (ref.parent) {
            parents = [];
            temp = ref.parent;
            while (temp) {
                parents[parents.length] = '[' + temp.className + '](' + temp.className + '.md)';
                temp = classes[temp.className].define.parent;
            }
            md[md.length] = '* parent : ' + parents.join(' < ');
        }
    //children
        children = [];
        for (k in classes) {
            if (classes[k].parent == this) {
                children[children.length] = '[' + k + '](' + k + '.md)';
            }
        }
        if (children.length) {
            children.sort(sort);
            md[md.length] = '* children : ' + temp.join(', ');
        }
    //constructor
        md[md.length] = '* [constructor](#constructor)\n';
    //items
        constants = val('constant', md, ref);
        events = val('event', md, ref);
        fields = val('field', md, ref);
        methods = func('method', md, ref);
        statics = func('static', md, ref);
//body
        temp = ref._construct;
        md[md.length] = '\n[top](#)';
        md[md.length] = '\n<a name="constructor"></a>';
        md[md.length] = '###<div style="background:#eee">constructor</div>';
        md[md.length] = '\n**description**\n';
        md[md.length] = toStr(temp['*description'] || 'prepare document');
        md[md.length] = '\n**param**\n';
        md[md.length] = toStr(temp['*param']) || 'none';
        /*
        md[md.length] = '\n**exception**\n';
        md[md.length] = '- '+toStr(temp.exception || 'none');
        */
        md[md.length] = '\n**sample**\n';
        md[md.length] = '```javascript';
        md[md.length] = toStr(temp['*sample']) || '//none';
        md[md.length] = '```';
        md[md.length] = '\n[top](#)';
        md[md.length] = '\n<i style="color:#00a">const</i>';
        md[md.length] = '***';
        fieldDetail('const', constants, md);
        md[md.length] = '\n<i style="color:#00a">event</i>';
        md[md.length] = '***';
        fieldDetail('event', events, md);
        md[md.length] = '\n<i style="color:#00a">field</i>';
        md[md.length] = '***';
        fieldDetail('field', fields, md);
        md[md.length] = '\n<i style="color:#00a">method</i>';
        md[md.length] = '***';
        methodDetail('method', methods, md);
        md[md.length] = '<i style="color:#00a">static</i>';
        md[md.length] = '***';
        methodDetail('static', statics, md);
        return md.join('\n');
    };
};