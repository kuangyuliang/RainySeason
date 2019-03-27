import BasicPage from '@/components/Page/BasicPage';

export default function () {
    const columns = [
        {
            title: '名称',
            dataIndex: 'NickName',
            key: 'NickName',
            render: text => <a href="">{text}</a>,
        },
        {
            title: '学习速率',
            dataIndex: 'LearningRate',
            key: 'LearningRate',
        },
        {
            title: '冲量',
            dataIndex: 'Momentum',
            key: 'Momentum',
        },
        {
            title: 'Sigmoids函数的α值',
            dataIndex: 'SigmoidsAlphaValue',
            key: 'SigmoidsAlphaValue',
        },
        {
            title: '神经元层数',
            dataIndex: 'NeuronsInFirstLayer',
            key: 'NeuronsInFirstLayer',
        },
        {
            title: '训练次数',
            dataIndex: 'Iterations',
            key: 'Iterations',
        }
    ];

    const formItems = [
        {
            item: {
                id: 'NickName',
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
                id: 'LearningRate',
                type: 'number',
                label: '学习速率',
                rules: [{ required: true, message: '学习速率不能为空!' }],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'Momentum',
                type: 'number',
                label: '冲量',
                rules: [],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'NeuronsInFirstLayer',
                type: 'number',
                label: 'Sigmoids函数的α值',
                rules: [],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'SigmoidsAlphaValue',
                type: 'number',
                label: '神经元层数',
                rules: [],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'Iterations',
                type: 'number',
                label: '训练次数',
                rules: [],
                attributes: {}
            },
            attributes: {}
        }
    ];

    const searchItems = [
        {
            item: {
                id: 'NickName',
                type: 'text',
                label: '名称',
                value: ''
            }
        },
        {
            item: {
                id: 'testSelect',
                type: 'select',
                value: 2,
                label: '下拉',
                rules: [],
                attributes: {},
                data: [
                    { label: 'aa', value: 1 },
                    { label: 'bb', value: 2 },
                    { label: 'cc', value: 3 }
                ]
            },
            attributes: {}
        },
        {
            item: {
                id: 'testRadio',
                type: 'radiobutton',
                value: 2,
                label: '单选',
                rules: [],
                attributes: {},
                data: [
                    { label: 'aa', value: 1 },
                    { label: 'bb', value: 2 },
                    { label: 'cc', value: 3 }
                ]
            },
            attributes: {}
        },
        {
            item: {
                id: 'testCheckbox',
                type: 'checkbox',
                value: [2],
                label: '多选',
                rules: [],
                attributes: {},
                data: [
                    { label: 'aa', value: 1 },
                    { label: 'bb', value: 2 },
                    { label: 'cc', value: 3 }
                ]
            },
            attributes: {}
        },
        {
            item: {
                id: 'bum',
                type: 'number',
                label: '数字',
                rules: [],
                attributes: {}
            },
            attributes: {}
        },
        {
            item: {
                id: 'Date',
                type: 'rangepicker',
                label: '时间',
                rules: [],
                attributes: {
                    showTime: true,
                    format: "YYYY-MM-DD HH:mm:ss"
                }
            },
            attributes: {}
        },
        {
            item: {
                id: 'Date1',
                type: 'weekpicker',
                label: '时间1',
                rules: [],
                attributes: {
                    format: "YYYY-WW周"
                }
            },
            attributes: {}
        }
    ];

    //BasicPage组件配置项
    const pageOption = {
        dataKey: 'Id',//数据唯一值
        createUrl: 'Test/Add',//新增数据接口地址
        retrieveUrl: 'Test/GetList',//获取数据接口地址
        updateUrl: 'Test/Edit',//修改数据接口地址
        deleteUrl: 'Test/Delete',//删除数据接口地址
        reportUrl: '',//导出数据接口地址
        isExport: true,//是否显示导出按钮(默认不显示)
        isAdd: true,//是否显示新增按钮(默认显示)
        isEdit: true,//是否显示编辑按钮(默认显示)
        /*
         const formItems = [
            {
                item: {
                    id: 'NickName',//控件Id
                    type: 'text',//控件类型
                    label: '名称',//控件label
                    //验证规则,不需要验证可以不传(参考ant design)
                    rules: [
                        { required: true, message: '名称不能为空!' }
                    ],
                    //控件属性(参考ant design)
                    attributes: {}
                },
                attributes: {},//Form.Item属性(参考ant design)
                mode:'Add'//显示模式(Add:只在新增的时候显示,Update:修改的时候显示,默认都显示)
            }
         ];
         *如果是时间类型控件,必须在控件属性内传入format属性(例:attributes: {format:'YYYY-MM-DD HH:mm:ss'},时间操作相关参考moment.js)
         */
        formItems: formItems,//如果不需要新增和修改,这项可以不传,否则必须传入
        isDelete: true,//是否显示编辑按钮(默认显示)
        columns: columns,//table组件的columns(参考ant design)
        tableAttributes: {},//table组件的自定义属性(参考ant design)
        searchItems: searchItems,//搜索组件(传[]或者不传默认不显示,格式参照formItems)
        exhibitionRows: 1,//搜索栏默认显示行数(默认1)
        isPagination: true,//是否启用分页(默认开启)
        searchExtendUrlParams: false,//查询参数是否合并url参数(默认合并)

    };

    return (
        <BasicPage {...pageOption} />
    );
}