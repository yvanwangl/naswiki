import Login from './containers/login/components/Login';
import Registor from './containers/login/components/Registor';
import UploadDocs from './containers/uploadDocs/components/UploadDocs';

const routes =  [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/registor',
        component: Registor
    },
    {
        path: '/upload',
        component: UploadDocs
    }
];

export default routes;