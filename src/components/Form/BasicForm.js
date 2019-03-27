import { PureComponent } from 'react';
import { Form } from 'antd';
import FormItem from './FormItem';

class BasicForm extends PureComponent {
    render() {
        const { formItems, attributes } = this.props;
        const _attr = { layout: "horizontal", ...attributes };

        return (
            <Form {..._attr} onSubmit={this.props.onSubmit}>
                {formItems.map(m => <FormItem form={this.props.form} item={m.item} attributes={m.attributes} key={m.item.id} />)}
            </Form>
        );
    }
}

export default BasicForm;