import { action, observable } from 'mobx';
const nebulas = require("nebulas");

var dappContactAddress = "n1xtqJ6Zf1GdBVK4oGPVzvoaGPQKoy1fMXV";
var neb = new nebulas.Neb();
var httpAddress = "https://mainnet.nebulas.io";
//var httpAddress = "https://testnet.nebulas.io";
neb.setRequest(new nebulas.HttpRequest(httpAddress));

export interface DocsItemModel {
    _id: string;
    docsNameId: String,
    docsName: String,
    versions: Array<any>,
    createInstance: Date,
}

class DocsListStore {

    @observable docsItemList: Array<DocsItemModel> = [];
    @observable showLoading: boolean = false;
    @observable docsEmpty: boolean = false;

    rootStore: object;

    constructor(initialState: any = {}, rootStore: object) {
        Object.assign(this, initialState);
        this.rootStore = rootStore;
    }

    @action.bound
    async fetchDocsList(walletAddress: string) {
        if(!walletAddress){
            return;
        }
        this.docsEmpty = false;
        this.showLoading = true;
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction = "get";
        var callArgs = "[\"" + walletAddress + "\"]";
        var contract = {
            "function": callFunction,
            "args": callArgs
        }
        let {result} = await neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract)
        if (result && result !== 'null') {
            this.docsItemList = JSON.parse(result);
        }else {
            this.docsEmpty = true;
        }
        this.showLoading = false;
        return result;
    }

}

export default DocsListStore;