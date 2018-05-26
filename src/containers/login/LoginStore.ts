import { action, observable } from 'mobx';
import request from '../../utils/request';

class LoginStore {

    @observable currentPage: number = 1;

    rootStore: object;

    constructor(initialState: any = {}, rootStore: object) {
        Object.assign(this, initialState);
        this.rootStore = rootStore;
    }

    @action.bound
    async doLogin(userInfo: object) {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let { success, data } = await request('/api/login', {
            method: 'post',
            body: JSON.stringify(userInfo)
        });
        if (success && userInfo['type'] == 'signin') {
            sessionStorage.setItem('user', JSON.stringify(data));
        }
        return { success, data };
    }

    @action.bound
    async doLogout() {
        //数据提交前对数据清洗
        //Object.keys(userInfo).map((key: string) => userInfo[key] = filterInput(link[key]));
        let { success, data } = await request('/api/logout', {
            method: 'post',
        });
        if (success) {
            sessionStorage.removeItem('user');
        }
        return { success, data };
    }

}

export default LoginStore;
