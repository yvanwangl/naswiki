import { action, observable } from 'mobx';
import request from '../../utils/request';
var NebPay = require("nebpay.js");
var nebPay = new NebPay();
var serialNumber; //交易序列号
var dappContactAddress = "n1xtqJ6Zf1GdBVK4oGPVzvoaGPQKoy1fMXV";


export interface DocsNameModel {
    _id: string;
    name: string;
}

export interface DocsTypeModel {
    _id: string;
    name: string;
}

class UploadDocsStore {

    @observable currentPage: number = 1;
    @observable addType: string = '';
    @observable visible: boolean = false;
    @observable docsNameList: Array<DocsNameModel> = [];
    @observable docsTypeList: Array<DocsTypeModel> = [];
    @observable newDocsNameId: string = '';
    @observable newDocsTypeId: string = '';

    rootStore: object;

    constructor(initialState: any = {}, rootStore: object) {
        Object.assign(this, initialState);
        this.rootStore = rootStore;
    }

    @action.bound
    showModal(addType: string) {
        this.visible = true;
        this.addType = addType;
    }

    @action.bound
    hideModal() {
        this.visible = false;
    }

    @action.bound
    resetNewDocsId(type: string) {
        this[type] = '';
    }

    @action.bound
    async fetchDocsNameList() {
        let { success, data } = await request('/api/submitDocsInfo/docsNameList');
        if (success) {
            this.docsNameList = data;
        }
        return { success, data };
    }

    /**
     * 增加文档名称 或 文档类型
     * 根据 addType 字段进行区分，
     * 'docsName' | 'docsType'
     * 
     * @param {*} docsNameInfo 
     * @returns 
     * @memberof UploadDocsStore
     */
    @action.bound
    async doAddName(docsNameInfo: any) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let { success, data } = await request('/api/submitDocsInfo/addDocsNameOrType', {
            method: 'post',
            body: JSON.stringify(docsNameInfo)
        });
        if (success) {
            this.visible = false;
            if (docsNameInfo.addType === 'docsType') {
                this.newDocsTypeId = data._id;
                this.docsTypeList.unshift(data);
            } else {
                this.newDocsNameId = data._id;
                this.docsNameList.unshift(data);
            }
        }
        return { success, data };
    }

    /**
     * 查询文档类型
     * 
     * @returns 
     * @memberof UploadDocsStore
     */
    @action.bound
    async fetchDocsTypeList() {
        let { success, data } = await request('/api/submitDocsInfo/docsTypeList');
        if (success) {
            this.docsTypeList = data;
        }
        return { success, data };
    }

    @action.bound
    async doSubmitDocsInfo({docsName, docsType, docsIntro, createInstance, docsLink}: any) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = "[\""+docsName+"\",\""+docsType+"\",\""+docsIntro+"\",\""+createInstance+"\",\""+docsLink+"\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: function (resp: any) {
                console.log("thecallback is " + resp)
            }
        });
        return {success: true, errorCode: ''};
    }

    @action.bound
    async doUpload(fileInfo: object) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let result = await request('/api/upload', {
            method: 'post',
            body: JSON.stringify(fileInfo)
        });
        return result;
    }

}

export default UploadDocsStore;