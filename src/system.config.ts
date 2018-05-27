const debug = process.env.NODE_ENV === 'development';

console.log(process.env.NODE_ENV);

//开发模式，跨域请求
//跨域请求url
const httpServerDev = 'http://localhost:8090';
//跨域请求头配置
const defaultOptionsDev = {
     mode: 'cors',
     credentials: 'include',
     headers: {
        'content-type': 'application/json'
     },
 };
 // test net
 const dappContactAddressDev = 'n1f9GDHxUHd396vMdJ8tT9s7wbJntbAwgSm';
 const contractHttpAddressDev = "https://testnet.nebulas.io";
 const neturlKeyDev = 'testnetUrl';

//部署模式，同域请求
// 同域请求url
const httpServerProd = '';
//同域请求头配置
const defaultOptionsProd = {
    credentials: 'same-origin',
    headers: {
        'content-type': 'application/json'
    },
};
// main net
const dappContactAddressProd = 'n1xtqJ6Zf1GdBVK4oGPVzvoaGPQKoy1fMXV';
const contractHttpAddressProd = "https://mainnet.nebulas.io";
const neturlKeyProd = 'mainnetUrl';

module.exports = {
    httpServer: debug ? httpServerDev : httpServerProd,
    defaultOptions: debug ? defaultOptionsDev : defaultOptionsProd,
    limit: 30,
    registor: false,
    dappContactAddress: debug ? dappContactAddressDev : dappContactAddressProd,
    contractHttpAddress: debug ? contractHttpAddressDev : contractHttpAddressProd,
    neturlKey: debug ? neturlKeyDev : neturlKeyProd,
};