import { action, observable } from 'mobx';
import request from '../../utils/request';
import { message } from 'antd';
const { dappContactAddress, neturlKey } = require('../../system.config');
var NebPay = require("nebpay.js");
var nebPay = new NebPay();

export interface DocsNameModel {
    _id: string;
    name: string;
}

export interface DocsTypeModel {
    _id: string;
    name: string;
}

var serialNumber = ''; //交易序列号
let intervalQuery: any;
let options = {
    //callback: NebPay.config.mainnetUrl 主网 NebPay.config.testnetUrl 测试网
    callback: NebPay.config[neturlKey]
};
class UploadDocsStore {

    @observable currentPage: number = 1;
    @observable addType: string = '';
    @observable visible: boolean = false;
    @observable docsNameList: Array<DocsNameModel> = [];
    @observable docsTypeList: Array<DocsTypeModel> = [];
    @observable newDocsNameId: string = '';
    @observable newDocsTypeId: string = '';
    @observable doUploading: boolean = false;

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
    async doSubmitDocsInfo({ docsName, docsType, docsIntro, createInstance, docsLink }: any) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let cancelCall = false;
        const that = this;
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = "[\"" + docsName + "\",\"" + docsType + "\",\"" + docsIntro + "\",\"" + createInstance + "\",\"" + docsLink + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: function (resp: any) {
                if (typeof resp === "object") {
                    that.doUploading = true;
                } else {
                    that.doUploading = false;
                    message.error('已取消上传');
                    cancelCall = true;
                }
            },
            callback: options.callback
        });
        return new Promise((resolve, reject) => {
            intervalQuery = setInterval(function () {
                if (cancelCall) {
                    clearInterval(intervalQuery);
                    return;
                }
                nebPay.queryPayInfo(serialNumber, options)   //search transaction result from server (result upload to server by app)
                    .then(function (resp: any) {
                        console.log("tx result: " + resp)   //resp is a JSON string
                        var respObject = JSON.parse(resp)
                        //code==0交易发送成功, status==1交易已被打包上链
                        if (respObject.code === 0 && respObject.data.status === 1) {
                            //交易成功,处理后续任务....
                            clearInterval(intervalQuery);    //清除定时查询
                            that.doUploading = false;
                            resolve({ success: true, errorCode: '' });
                        }
                    })
                    .catch(function (err: any) {
                        console.log(err);
                        that.doUploading = false;
                        reject({ success: false, errorCode: '文档信息上传失败，请重试！' })
                    });
            }, 10000);
        });
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