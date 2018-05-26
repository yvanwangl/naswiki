import LoginStore from '../containers/login/LoginStore';
import UploadDocsStore from '../containers/uploadDocs/UploadDocsStore';
import DocsListStore from '../containers/docsList/DocsListStore';

let rootStore = {
    login: LoginStore,
    uploadDocs: UploadDocsStore,
    docsList: DocsListStore
};

//初始化state对象
export let initialState = {
    login: {},
    uploadDocs: {},
    docsList: {},
};

export default function configStore(state: any = {}) {
    const createdStores = {};
    Object.keys(state).map(key => {
        createdStores[key] = new rootStore[key](state[key], createdStores);
    });

    return createdStores;
}
