var BlendMode = MoGL.extend('BlendMode', {
    description:'BlendMode',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.add);'
    ],
    value:function BlendMode() {}
})
.constant('add', {
    description:'전면색을 배경색에 더하고 올림값 0xFF를 적용',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.add);'
    ],
    value:'add'
})
.constant('alpha', {
    description:'전면색의 알파값에 따라 배경색을 덮어가는 가장 일반적인 중첩',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.alpha);'
    ],
    value:'alpha'
})
.constant('darken', {
    description:'전면색과 배경색 중 보다 어두운 색상(값이 작은 색상)을 선택',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.darken);'
    ],
    value:'darken'
})
.constant('difference', {
    description:'전면색과 배경색을 비교하여 둘 중 밝은 색상 값에서 어두운 색상 값을 뺌',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.difference);'
    ],
    value:'difference'
})
.constant('erase', {
    description:'전면색의 알파만 적용하여 배경색을 지움',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.erase);'
    ],
    value:'erase'
})
.constant('hardlight', {
    description:'전면색의 어두운 정도를 기준으로 배경색을 조정',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.hardlight);'
    ],
    value:'hardlight'
})
.constant('invert', {
    description:'전면색을 이용하여 배경색을 반전시킴',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.invert);'
    ],
    value:'invert'
})
.constant('lighten', {
    description:'전면색과 배경색 중 보다 밝은 색(값이 큰 색상)으로 선택',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.lighten);'
    ],
    value:'lighten'
})
.constant('multiply', {
    description:'전면색에 배경색을 곱하고 0xFF로 나누어 정규화하여 보다 어두운 색을 만듬',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.multiply);'
    ],
    value:'multiply'
})
.constant('screen', {
    description:'전면색의 보수(역수)에 배경색 보수를 곱하여 표백 효과를 냄',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.screen);'
    ],
    value:'screen'
})
.constant('subtract', {
    description:'전면색의 값을 배경색에서 빼고 내림값 0을 적용',
    sample:[
        'var material = Material();',
        'material.addTexture(Texture.diffuse, new Texture(), null, BlendMode.subtract);'
    ],
    value:'subtract'
})
.build();