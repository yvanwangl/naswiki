import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import Home from './containers/home/Home';
import UploadDocs from './containers/uploadDocs/components/UploadDocs';
import DocsList from './containers/docsList/components/DocsList';
import './App.css';
const Logo = require('./nebulasx602.png');

export interface AppProps {
    history: object;
}

export interface AppState {
    drawerOpen: boolean;
}

class App extends React.Component<object & RouteComponentProps<object>, AppState> {

    constructor(props: object & RouteComponentProps<object>) {
        super(props);
    }

    render() {
        return (
            <div>
                <header className='App-header'>

                </header>
                <main className='App-content'>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/documents" component={DocsList} />
                        <Route path="/upload" component={UploadDocs} />
                    </Switch>
                </main>
                <footer>
                    <div>
                        <p>
                            Copyright © 2015 YvanWang.com. All Rights Reserved. |  京 ICP 备 15039446 号
                        </p>
                        <p>
                            Designed by Huan & Developed by Yafei Wang
                        </p>
                    </div>
                    <a href="https://nebulas.io/index.html" target='_blank'>
                        <img src={Logo} alt="Nebulas" />
                    </a>
                </footer>
            </div>
        );
    }
}

export default withRouter(App) as any;