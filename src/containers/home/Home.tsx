import * as React from 'react';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import PrivateRouter from './PrivateRouter';
import UploadDocs from '../uploadDocs/components/UploadDocs';
import DocsList from '../docsList/components/DocsList';
import LoginStore from '../login/LoginStore';
import './index.css';

export interface HomeProps {
    login: LoginStore;
}

export interface AppState {
    drawerOpen: boolean;
}

@inject('login')
@observer
class Home extends React.Component<HomeProps & RouteComponentProps<any>, AppState> {

    constructor(props: HomeProps &  RouteComponentProps<any>) {
        super(props);
        this.state = {
            drawerOpen: true
        };
    }

    handleLogout = () => {
        const { login: { doLogout }, history } = this.props;
        doLogout().then(()=> history.push('/login'));
    };

    render() {
        return (
            <div className='Home-container'>
                <Button className='Home-uploadButton' onClick={this.handleLogout}> 退出 </Button>
                <div style={{ width: '40%' }}>
                    <PrivateRouter exact path="/" component={DocsList} />
                    <PrivateRouter path="/upload" component={UploadDocs} />
                </div>
            </div>

        );
    }
}

export default withRouter(Home);