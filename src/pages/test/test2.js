import BasicPage from '@/components/Page/BasicPage';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import Trend from '@/components/Trend';

export default () => {
    const columns = [
        {
            title: '登录名',
            dataIndex: 'userName',
            key: 'userName',
            render: v => <Trend flag='up'>{v}</Trend>
        },
        {
            title: '姓',
            dataIndex: 'surname',
            key: 'surname',
            render: v => <Trend flag='down'>{v}</Trend>
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'emailAddress',
            key: 'emailAddress',
            render: v => <Ellipsis length={10} tooltip>{v}</Ellipsis>
        },
        {
            title: '是否启用',
            dataIndex: 'isActive',
            key: 'isActive',
            render: v => v ? '是' : '否'
        },
        {
            title: '最后登录时间',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
            render: v => v ? moment(v).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: '创建时间',
            dataIndex: 'creationTime',
            key: 'creationTime',
            render: v => moment(v).format('YYYY-MM-DD HH:mm')
        }
    ];

    const searchItems = [
        {
            item: {
                id: 'UserName',
                type: 'text',
                label: '登录名',
                value: ''
            }
        },
        {
            item: {
                id: 'Name',
                type: 'text',
                label: '名称',
            }
        },
        {
            item: {
                id: 'IsActive',
                type: 'select',
                value: '',
                label: '是否启用',
                data: [
                    { label: '是', value: 'true' },
                    { label: '否', value: 'false' }
                ]
            }
        }
    ];

    const formItems = [
        {
            item: {
                id: 'userName',
                type: 'text',
                label: '登录名',
                rules: [
                    { required: true, message: '登录名不能为空!' }
                ],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'surname',
                type: 'text',
                label: '姓',
                rules: [
                    { required: true, message: '姓不能为空!' }
                ],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'name',
                type: 'text',
                label: '名称',
                rules: [
                    { required: true, message: '名称不能为空!' }
                ],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'emailAddress',
                type: 'text',
                label: '邮箱',
                rules: [],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'password',
                type: 'text',
                label: '密码',
                rules: [
                    { required: true, message: '密码不能为空!' }
                ],
                attributes: {}
            },
            attributes: {},
            mode: 'Add'
        },
        {
            item: {
                id: 'isActive',
                type: 'radiobutton',
                label: '是否启用',
                value: true,
                rules: [
                    { required: true, message: '请选择是否启用!' }
                ],
                data: [
                    { label: '是', value: true },
                    { label: '否', value: false }
                ],
                attributes: {}
            },
            attributes: {}
        }
    ];

    const pageOption = {
        dataKey: 'id',//数据唯一值
        createUrl: 'services/app/User/Create',//新增数据接口地址
        retrieveUrl: 'services/app/User/GetAll',//获取数据接口地址
        updateUrl: 'services/app/User/Update',//修改数据接口地址
        deleteUrl: 'services/app/User/Delete',//删除数据接口地址
        //reportUrl: '',//导出数据接口地址
        //isExport: true,//是否显示导出按钮(默认不显示)
        isAdd: true,//是否显示新增按钮(默认显示)
        isEdit: true,//是否显示编辑按钮(默认显示)
        formItems: formItems,//如果不需要新增和修改,这项可以不传,否则必须传入
        isDelete: true,//是否显示编辑按钮(默认显示)
        columns: columns,//table组件的columns(参考ant design)
        tableAttributes: {},//table组件的自定义属性(参考ant design)
        searchItems: searchItems,//搜索组件(传[]或者不传默认不显示,格式参照formItems)
        exhibitionRows: 1,//搜索栏默认显示行数(默认1)
        isPagination: true,//是否启用分页(默认开启)
        //searchExtendUrlParams: false,//查询参数是否合并url参数(默认合并)
    };

    return (
        <BasicPage {...pageOption} />
    );
}