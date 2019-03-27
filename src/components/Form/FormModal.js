import { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import BasicForm from './BasicForm'

@Form.create()
export default class BasicModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = () => {
        const { onOk } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                onOk(values);
                this.hideModelHandler();
            }
        });
    };

    render() {
        const { children, record } = this.props;
        if (Object.keys(record).length > 0) {
            this.props.formItems.forEach(f => {
                f.item = { ...f.item, value: record[f.item.id] }
            });
        } else {
            this.props.formItems.map(f => f.item.value = null);
        }

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal
                    title={this.props.modalTitle}
                    visible={this.state.visible}
                    onOk={this.okHandler}
                    onCancel={this.hideModelHandler}
                >
                    <BasicForm formItems={this.props.formItems} form={this.props.form} onSubmit={this.okHandler} />
                </Modal>
            </span>
        );
    }
}