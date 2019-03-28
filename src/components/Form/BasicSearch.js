import { PureComponent } from 'react';
import FormItem from './FormItem';
import { SEARCH_COL_SPAN } from '@/constants';
import { Form, Row, Col, Button, Icon } from 'antd';

@Form.create()
export default class BasicSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            expandBtn: false
        };
    }

    getFields() {
        const { searchItems, exhibitionRows = 1 } = this.props;
        let _exhibitionRows = exhibitionRows;
        const children = [];
        const interval = 24 / SEARCH_COL_SPAN;
        const rowsCount = Math.ceil(searchItems.length / interval);

        if (exhibitionRows < rowsCount) {
            this.state.expandBtn = true;
        }

        if (this.state.expand) {
            _exhibitionRows = rowsCount;
        } else {
            _exhibitionRows = exhibitionRows;
        }

        let rowIndex = 1;
        for (let i = 0; i < searchItems.length; i += interval) {
            const row = searchItems.slice(i, i + interval);
            children.push(
                <Row gutter={24} key={i} style={{ display: rowIndex <= _exhibitionRows ? 'block' : 'none' }}>
                    {
                        row.map(m => {
                            m.attributes = { labelCol: { span: 7 }, wrapperCol: { span: 12 }, ...m.attributes };
                            return (
                                <Col span={SEARCH_COL_SPAN} key={m.item.id} >
                                    <FormItem form={this.props.form} item={m.item} attributes={m.attributes} />
                                </Col>
                            );
                        })
                    }
                </Row>
            );
            rowIndex++;
        }

        return children;
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    search = e => {
        e.preventDefault();
        const { searchHandler } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                searchHandler(values);
            }
        });
    }

    render() {
        const _attr = { layout: "horizontal", ...this.props.attributes };
        const expand = this.state.expand;

        return (
            <Form
                {..._attr}
                onSubmit={this.search}
            >
                {this.getFields()}
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon='search' type="primary" htmlType="submit">查 询</Button>
                        {this.props.children ? <>{this.props.children}</> : null}
                        {this.state.expandBtn &&
                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                                {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
                            </a>
                        }
                    </Col>
                </Row>
            </Form>
        );
    }
}