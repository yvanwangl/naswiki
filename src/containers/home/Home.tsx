import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import Header from '../../components/Header';
import NasSearch from '../../components/NasSearch';
import DocsListStore from '../docsList/DocsListStore';
import './index.css';

const Sample = require('./sample.png');
const Safe = require('./safe.png');
const Share = require('./share.png');
const faqItem = require('./faqItem.png');


export interface HomeProps {
    docsList: DocsListStore;
}

export interface AppState {
    drawerOpen: boolean;
}

const FaqIcon = () => <img className='faqItem-img' src={faqItem} alt="icon" />;

const faqItems = [
    {
        q: 'Nas wiki 是什么',
        a: 'Nas wiki 是一个基于星云链构建的在线文档托管系统，支持上传各种类型的共享文档。',
    },
    {
        q: 'Nas wiki 如何使用',
        a: '只需要通过你的 Nas 钱包上传文档，并将钱包地址分享给他人，即可达到文档共享的目的。',
    },
    {
        q: '如何获取 Nas 钱包',
        a: `点击 <a href="https://github.com/ChengOrangeJu/WebExtensionWallet" target='_blank'>WebExtensionWallet</a> 链接，
        根据使用说明，在chrome浏览器中安装 NAS 钱包插件，并生成你的个人钱包。`,
    },
    {
        q: '钱包没有 Nas 币怎么办',
        a: `可以在各大数字货币交易所进行购买 Nas 币，再转账到你个人的 NAS 钱包地址。
        或者你可以邀请你的好友给你
        <a href="http://xu.renmaixifen.com/#/" target='_blank'>发 Nas 红包</a>`
    }
]
@inject('docsList')
@observer
class Home extends React.Component<HomeProps & RouteComponentProps<any>, AppState> {

    constructor(props: HomeProps & RouteComponentProps<any>) {
        super(props);
        this.state = {
            drawerOpen: true
        };
    }

    handleSearchClick = (value: string) => {
        const { docsList: { fetchDocsList }, history } = this.props;
        if (value) {
            fetchDocsList(value);
            history.push('/documents');
        }
    };

    handleUploadButton = () => {
        let { history } = this.props;
        history.push('/upload');
    };

    renderFaqItems = () => faqItems.map(({ q, a }, index) =>
        <li key={index}>
            <p className='faqItem-q'><FaqIcon /> {q}</p>
            <p className='faqItem-a' dangerouslySetInnerHTML={{ __html: a }}></p>
        </li>
    );

    render() {
        return (
            <div className='Home-container'>
                <Header>
                    <p>Managed System</p>
                    <Button className='Home-uploadButton' onClick={this.handleUploadButton}> Upload File </Button>
                    <NasSearch onSearch={this.handleSearchClick} />
                </Header>

                <section className="App-feature">
                    <ul>
                        <li key={1}>
                            <div><img src={Sample} alt="Sample" /></div>
                            <h2>SIMPLE</h2>
                            <p>Share documents, should be only share the address of a NAS wallet</p>

                        </li>
                        <li key={2}>  
                            <div><img src={Safe} alt="Safe" /></div>
                            <h2>SAFE</h2>
                            <p>Document information stored in the blockchain is more secure and reliable</p>

                        </li>
                        <li key={3}>
                            <div><img src={Share} alt="Share" /></div>
                            <h2>SHARE</h2>
                            <p>Others use Nas Wallet address to easily share your document information</p>

                        </li>
                    </ul>
                </section>
                <section className='App-faq'>
                    <h2> <span>FAQ</span></h2>
                    <ul>
                        {this.renderFaqItems()}
                    </ul>
                </section>
            </div>

        );
    }
}

export default withRouter(Home);