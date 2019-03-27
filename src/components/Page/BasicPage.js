import { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button, Icon, Card, Divider, message } from 'antd';
import FormModal from '@/components/Form/FormModal';
import BasicSearch from '@/components/Form/BasicSearch';
import { PAGE_SIZE } from '@/constants';
import styles from './BasicPage.less';
import qs from 'querystring';
import moment from 'moment';
import BreadcrumbView from '@/components/BreadcrumbView';
import MenuContext from '@/layouts/MenuContext';

class BasicPage extends PureComponent {
    constructor(props) {
        super(props);

        let params = {};
        if (this.props.isPagination !== false) {
            params = {
                pageIndex: 1,
                pageSize: PAGE_SIZE,
            }
        }

        let search = location.search;
        let urlParams = {};
        if (search) {
            urlParams = qs.parse(search.replace('?', ''));
        }
        let searchParams = {};
        this.props.searchItems.map(m => {
            let v = m.item.value;
            const urlValue = urlParams[m.item.id];
            if (urlValue && m.item.id in urlParams) {
                switch (m.item.type) {
                    case 'number':
                        v = this.changeType(urlValue, 'number');
                        break;
                    case 'checkbox':
                        const type = typeof (m.item.data[0].value);
                        v = urlValue.split(',').map(value => this.changeType(value, type));
                        break;
                    case 'datepicker':
                    case 'timepicker':
                    case 'monthpicker':
                        v = moment(urlValue, m.item.attributes.format);
                        break;
                    case 'weekpicker':
                        v = moment(urlValue, 'YYYY-WW');
                        break;
                    case 'rangepicker':
                        const date = urlValue.split(',');
                        v = [moment(date[0], m.item.attributes.format), moment(date[1], m.item.attributes.format)];
                        break;
                    default:
                        if (m.item.data) {
                            const type = typeof (m.item.data[0].value);
                            v = this.changeType(urlValue, type);
                        } else {
                            v = urlValue;
                        }
                }
                m.item.value = v;
                if (m.item.value) {
                    searchParams[m.item.id] = m.item.value;
                }
            }
        });
        searchParams = this.changeFormValues(searchParams, this.props.searchItems);
        params = { ...params, ...urlParams, ...searchParams };

        this.state = {
            search: params
        };

        if (this.props.isDelete !== false || this.props.isEdit !== false) {
            const operation = {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        {
                            (this.props.isEdit !== false) &&
                            <FormModal
                                record={record}
                                formItems={this.props.formItems.filter(f => !f.mode || f.mode === 'Update')}
                                modalTitle='编辑'
                                onOk={this.editHandler.bind(this, record[this.props.dataKey])}
                            >
                                <a>编辑</a>
                            </FormModal>
                        }
                        {
                            (this.props.isEdit !== false && this.props.isDelete !== false) &&
                            <Divider type="vertical" />
                        }
                        {
                            (this.props.isDelete !== false) &&
                            <Popconfirm
                                title="确定要删除该项？"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={this.deleteHandler.bind(this, record[this.props.dataKey])}>
                                <a>删除</a>
                            </Popconfirm>
                        }
                    </span>
                )
            };
            this.props.columns.push(operation);
        }
    }

    changeType(value, type) {
        switch (type) {
            case 'string':
                return String(value);
            case 'number':
                return Number(value);
            case 'boolean':
                return Boolean(value);
            default:
                return value;
        }
    }

    changeFormValues(values, items) {
        let params = {};
        for (let k in values) {
            const v = values[k];
            if (v !== undefined && v !== null) {
                const item = items.filter(f => f.item.id === k)[0];
                if (Array.isArray(v)) {
                    v = v.map(m => {
                        return m instanceof moment ? m.format(item.item.attributes.format) : m;
                    });
                }
                if (v instanceof moment) {
                    v = v.format(item.item.attributes.format);
                }
                params[k] = v;
            }
        }
        return params;
    }

    getPageData(params) {
        this.props.dispatch({
            type: 'np/fetch',
            payload: {
                url: this.props.retrieveUrl,
                params: params
            }
        });
    }

    pageChangeHandler = pageIndex => {
        this.setState(state => {
            state.search = { ...state.search, pageIndex }
        }, () => {
            this.getPageData.call(this, this.state.search);
        });
    }

    deleteHandler(key) {
        const that = this;
        that.props.dispatch({
            type: 'np/send',
            payload: {
                method: 'Delete',
                url: that.props.deleteUrl,
                params: { [that.props.dataKey]: key }
            },
            callback(res) {
                if (res) {
                    message.success('删除成功');
                    that.getPageData.call(that, that.state.search);
                } else {
                    message.error('删除失败');
                }
            }
        });
    }

    editHandler(key, values) {
        const that = this;
        that.props.dispatch({
            type: 'np/send',
            payload: {
                method: 'PUT',
                url: that.props.updateUrl,
                params: { key, ...that.changeFormValues(values, that.props.formItems) }
            },
            callback(res) {
                if (res) {
                    message.success('修改成功');
                    that.getPageData.call(that, that.state.search);
                } else {
                    message.error('修改失败');
                }
            }
        });
    }

    createHandler = values => {
        this.props.dispatch({
            type: 'np/send',
            payload: {
                url: this.props.createUrl,
                params: this.changeFormValues(values, this.props.formItems)
            },
            callback: res => {
                if (res) {
                    message.success('添加成功');
                    this.getPageData.call(this, this.state.search);
                } else {
                    message.error('添加失败');
                }
            }
        });
    }

    searchHandler = values => {
        console.log(values);
        let params = this.changeFormValues(values, this.props.searchItems);
        if (this.props.searchExtendUrlParams !== false) {
            params = { ...this.state.search, ...params };
        }

        if (this.props.isPagination !== false) {
            params = { ...params, pageIndex: 1, pageSize: PAGE_SIZE };
        }
        console.log(params);
        this.setState({ search: params }, () => {
            this.getPageData.call(this, this.state.search);
        });
    }

    reportHandler() {
        const that = this;
        that.props.dispatch({
            type: 'np/send',
            payload: {
                url: that.props.reportUrl,
                params: that.state.search
            }
        });
    }

    componentDidMount() {
        this.getPageData.call(this, this.state.search);
    }

    render() {
        const pageData = { ...this.props };
        const _tableAttr = { bordered: true, ...this.props.tableAttributes };

        return (
            <>
                <MenuContext.Consumer>
                    {
                        value => (
                            <BreadcrumbView {...value} />
                        )
                    }
                </MenuContext.Consumer>
                <div className={styles.main}>

                    <Card bordered style={{ width: '100%', height: '100%' }}>
                        {
                            this.props.searchItems &&
                            <BasicSearch searchItems={this.props.searchItems} exhibitionRows={this.props.exhibitionRows} searchHandler={this.searchHandler}>
                                {
                                    this.props.isExport &&
                                    <Button icon="download" style={{ marginLeft: 8 }} htmlType="submit">
                                        导出
                                </Button>
                                }
                            </BasicSearch>
                        }
                        <div className={styles.create}>
                            {
                                (this.props.isAdd !== false) &&
                                <FormModal
                                    record={{}}
                                    datakey={this.props.dataKey}
                                    formItems={this.props.formItems.filter(f => !f.mode || f.mode === 'Add')}
                                    modalTitle='新增'
                                    onOk={this.createHandler}
                                >
                                    <Button icon='plus' type="primary">新增</Button>
                                </FormModal>
                            }
                            {
                                this.props.toolbar ? this.props.toolbar : null
                            }
                        </div>
                        <Table
                            loading={this.props.loading}
                            columns={this.props.columns}
                            dataSource={this.props.list}
                            rowKey={record => record[this.props.dataKey]}
                            pagination={false}
                            {..._tableAttr}
                        />
                        {
                            this.props.isPagination !== false &&
                            <Pagination
                                className="ant-table-pagination"
                                total={Number(pageData.total)}
                                showTotal={total => `总共 ${total} 条`}
                                current={pageData.pageIndex}
                                pageSize={PAGE_SIZE}
                                onChange={this.pageChangeHandler}
                            />
                        }
                    </Card>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    const { list, total, pageIndex } = state.np;
    return {
        list,
        total,
        pageIndex,
        loading: state.loading.models.np,
    };
}

export default connect(mapStateToProps)(BasicPage);