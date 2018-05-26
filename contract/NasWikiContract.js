var DocItem = function (docsName, docsType, docsIntro, createInstance, docsLink) {
    if (docsName) {
        this.docsName = docsName;
        this.docsType = docsType;
        this.docsIntro = docsIntro;
        this.createInstance = createInstance;
        this.docsLink = docsLink;
    }
};

DocItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var WikiDoc = function () {
    LocalContractStorage.defineMapProperty(this, 'data', {
        parse: function (docListStr) {
            return JSON.parse(docListStr);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
};

WikiDoc.prototype = {
    init: function () { },
    save: function (docsName, docsType, docsIntro, createInstance, docsLink) {
        var from = Blockchain.transaction.from;
        if(docsName.length > 50){
            throw new Error('文档名称不能多于 50 字');
        }
        if(docsType.length > 50){
            throw new Error('文档类型不能多于 50 字');
        }
        if(docsIntro.length > 200){
            throw new Error('文档简介不能多于 200 字');
        }
        if(!/^http(s)?:\/\//.test(docsLink)){
            throw new Error('文档链接格式不正确，例如：https://nebulas.io/index.html');
        }
        docItem = new DocItem(docsName, docsType, docsIntro, createInstance, docsLink);
        docItem.author = from;
        var docList = this.data.get(from);
        if (!docList) {
            docList = [docItem];
        } else {
            docList.push(docItem);
        }

        this.data.put(from, docList);
    },

    get: function (wallteAddress) {
        if (!wallteAddress) {
            throw new Error('not exist');
        }
        return this.data.get(wallteAddress);
    }
};

module.exports = WikiDoc;