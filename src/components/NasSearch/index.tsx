import * as React from 'react';
import { Input } from 'antd';
import './index.css';

const Search = Input.Search;

const NasSearch = ({ onSearch }: any) => (
    <span className='Nas-search'>
        <Search
            placeholder="输入钱包地址查询文档"
            enterButton="Search"
            size="large"
            onSearch={onSearch}
        />
    </span>

);

export default NasSearch;