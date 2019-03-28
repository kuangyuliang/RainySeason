import { PureComponent } from 'react';
import { Form } from 'antd';
import FormItem from './FormItem';

@Form.create()
export default class BasicForm extends PureComponent {
    render() {
        const { formItems, attributes } = this.props;
        const _attr = { layout: "horizontal", ...attributes };

        return (
            <Form {..._attr}>
                {formItems.map(m => <FormItem form={this.props.form} item={m.item} attributes={m.attributes} key={m.item.id} />)}
            </Form>
        );
    }
}