import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { Button } from 'antd';
import DocsListStore from '../DocsListStore';
import { userAuth } from '../../../utils/util';
import './index.css';

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


    componentDidMount() {
        const { docsList: { fetchDocsList } } = this.props;
        fetchDocsList();
    }

    handleDocsClick = (e: any) => {
        let ele = e.target;
        ele.classList.toggle('active');
    };

    handleUploadButton = () => {
        let { history } = this.props;
        history.push('/upload');
    };

    render() {
        let {
            authenticate,
            admin
        } = userAuth();
        const { docsList: { docsItemList } } = this.props;
        return (
            <div className='DocsList-container'>
                {(authenticate && admin && <Button className='Home-uploadButton' onClick={this.handleUploadButton}> 上传文档 </Button>)}
                {
                    docsItemList.map((docs: any) => (
                        <div key={docs._id} className='DocsList-wrapper' onClick={(e) => this.handleDocsClick(e)}>
                            {docs.docsName}
                            <ul>
                                {
                                    docs.versions.map(({link, version, createInstance}: any, index: number) =>
                                        <li key={index}>
                                            <a href={link} target='_blank' title={version} className='DocsList-version'> {version} </a>
                                            <span className='DcosList-dotLine'></span>
                                            <span className='DocsList-createInstance'>{moment(createInstance).format('YYYY-MM-DD HH:mm')}</span>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    )

                    )
                }
            </div>
        );
    }

}

export default withRouter(DocsList);