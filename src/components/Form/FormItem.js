import { PureComponent } from 'react';
import { Form, Select, Input, InputNumber, Radio, Checkbox, DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Item = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;

class FormItem extends PureComponent {
    getItemType(type, attributes, data) {
        let _attr = {};
        switch (type) {
            case "text":
                return <Input {...attributes} />;
            case "textarea":
                return <TextArea {...attributes} />;
            case "password":
                return <Input type="password" {...attributes} />;
            case "number":
                _attr = { style: { width: '100%' }, ...attributes };
                return <InputNumber {..._attr} />;
            case "select":
                return (
                    <Select {...attributes}>
                        {data.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                );
            case "radio":
                return (
                    <RadioGroup {...attributes}>
                        {data.map(d => <Radio value={d.value} key={d.value}>{d.label}</Radio>)}
                    </RadioGroup>
                );
            case "radiobutton":
                return (
                    <RadioGroup {...attributes}>
                        {data.map(d => <RadioButton value={d.value} key={d.value}>{d.label}</RadioButton>)}
                    </RadioGroup>
                );
            case "checkbox":
                return (
                    <CheckboxGroup options={data} {...attributes} />
                );
            case "timepicker":

                return <TimePicker {...attributes} />;
            case "datepicker":
                return <DatePicker {...attributes} />;
            case "weekpicker":
                return <WeekPicker {...attributes} />;
            case "monthpicker":
                return <MonthPicker {...attributes} />;
            case "rangepicker":
                _attr = { ranges: { '今天': [moment(), moment()], '本月': [moment().startOf('month'), moment().endOf('month')] }, ...attributes };
                return <RangePicker {..._attr} />;
            default:
                break;
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 14 }
        };
        const { attributes, item } = this.props;
        const { getFieldDecorator } = this.props.form;
        const _attr = { ...formItemLayout, label: item.label, ...attributes };

        return (
            <Item {..._attr}>
                {
                    getFieldDecorator(item.id, {
                        rules: item.rules,
                        initialValue: item.value,
                    })(
                        this.getItemType(item.type, item.attributes, item.data)
                    )
                }
            </Item>
        );
    }
}

export default FormItem;