import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { Spin, Input, Icon } from 'antd';
import DocsListStore from '../DocsListStore';
import Header from '../../../components/Header';
import './index.css';

const docsEmptyImg = require('./docsEmptyImg.png');
export interface DocsListProps {
    docsList: DocsListStore;
}

export interface DocsListState {
    openDialog: boolean;
}

@inject('docsList')
@observer
class DocsList extends React.Component<DocsListProps & RouteComponentProps<any>, DocsListState> {

    constructor(props: DocsListProps & RouteComponentProps<any>) {
        super(props);
    }

    handleDocsClick = (e: any) => {
        e.stopPropagation();
        let ele = e.target;
        ele.classList.toggle('active');
    };

    handleSearchClick = (e: any) => {
        const { docsList: { fetchDocsList } } = this.props;
        if (e.target.value) {
            fetchDocsList(e.target.value);
        }
    };

    // 对文档类型进行排序：产品、交互、设计
    sortDocsTypeList = (arrayList: Array<Object>) => {
        let sortType = ['产品', '交互', '设计'];
        let result: Array<Object> = [];
        arrayList.map((type: any) => {
            let index = sortType.findIndex((item) => item === type.docsTypeName);
            if (index > -1) {
                result[index] = type;
            } else {
                sortType.push(type.docsTypeName);
                result[sortType.length - 1] = type;
            }
        });
        return result;
    };

    render() {
        const { docsList: { docsItemList, showLoading, docsEmpty } } = this.props;
        return (
            <div className='DocsList-container'>
                <Header headerSmall={true}/>
                <div className='DocsList-result'>
                    <div className='DocsList-search'>
                        <h2>搜索结果</h2>
                        <Input
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="输入钱包地址查询文档"
                            onPressEnter={this.handleSearchClick}
                        />
                    </div>
                    {showLoading && <div className='DocsList-loading'><Spin /></div>}
                    {docsEmpty ?
                        <div className='DocsList-docsEmpty'>
                            <img src={docsEmptyImg} alt="没有结果" />
                            <p>
                                没有查询到文档，<a href='/upload'>立即上传</a>
                            </p>
                        </div> :
                        <div className='DocsList-content'>
                            <ul>
                                {
                                    docsItemList.map(({ docsName, docsType, docsIntro, docsLink, createInstance }: any, index: number) => (
                                        <a href={docsLink} target='_blank' title={docsLink} key={index}>
                                            <li key={index} className='DocsList-item'>
                                                <h2>{docsName}</h2>
                                                <p>{docsIntro}</p>
                                                <div>
                                                    <span className='DocsList-createInstance'><span>上传于</span> {moment(createInstance).format('YYYY-MM-DD HH:mm')}</span>
                                                    <span className='DocsList-docsType'>{docsType}</span>
                                                </div>
                                            </li>
                                        </a>

                                    ))
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>
        );
    }

}

export default withRouter(DocsList);