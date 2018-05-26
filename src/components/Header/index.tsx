import * as React from 'react';
const Logo = require('./logo.png');
import './index.css';

const Header = ({ children, headerSmall }: any) => {
    return (
        <header className={headerSmall ? 'Header small' : 'Header'}>
            <a href="https://nebulas.io/index.html" target='_blank'>
                <img src={Logo} alt="Nebulas" />
            </a>
            <div>
                <a href="/">
                    <h2>NAS wiki</h2>
                </a>
                {children}
            </div>
        </header>
    );
};

export default Header;