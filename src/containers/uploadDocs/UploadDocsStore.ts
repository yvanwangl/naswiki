import { action, observable } from 'mobx';
import request from '../../utils/request';

export interface DocsNameModel {
    _id: string;
    name: string;
}

class UploadDocsStore {

    @observable currentPage: number = 1;
    @observable visible: boolean = false;
    @observable docsNameList: Array<DocsNameModel> =[];
    @observable newDocsNameId: string = '';

    rootStore: object;

    constructor(initialState: any = {}, rootStore: object) {
        Object.assign(this, initialState);
        this.rootStore = rootStore;
    }

    @action.bound
    showModal(){
        this.visible = true;
    }

    @action.bound
    hideModal(){
        this.visible = false;
    }

    @action.bound
    resetNewDocsNameId(){
        this.newDocsNameId = '';
    }

    @action.bound
    async fetchDocsNameList() {
        let { success, data} = await request('/api/submitDocsInfo/docsNameList');
        if(success){
            this.docsNameList = data;
        }
        return {success, data};
    }

    @action.bound
    async doAddDocsName(docsNameInfo: any) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let {success, data} = await request('/api/submitDocsInfo/addDocsName', {
            method: 'post',
            body: JSON.stringify(docsNameInfo)
        });
        if(success){
            this.visible = false;
            this.newDocsNameId = data._id;
            this.docsNameList.unshift(data);
        }
        return { success, data };
    }

    @action.bound
    async doSubmitDocsInfo(docInfo: object) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let result = await request('/api/submitDocsInfo/addDocsInfo', {
            method: 'post',
            body: JSON.stringify(docInfo)
        });
        return result;
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