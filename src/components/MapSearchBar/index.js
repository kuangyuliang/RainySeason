import { PureComponent } from 'react';
import { Input, AutoComplete } from 'antd';
import styles from './index.less';

const Search = Input.Search;
const Option = AutoComplete.Option;

export default class MapSearchBar extends PureComponent {
    constructor(props) {
        super(props);
        const { autoCompleteData } = this.props;
        this.state = {
            dataSource: [],
            autoCompleteData
        };
    }

    handleSearch = v => {
        if (!v) {
            this.setState({
                dataSource: []
            });
            return false;
        }
        const { autoCompleteData } = this.state;
        this.setState({
            dataSource: autoCompleteData.filter(f => f.name.indexOf(v) > -1).map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)
        });
    }

    onSelect = stationId => {
        const { autoCompleteData } = this.state;
        const { position, extData } = autoCompleteData.find(f => f.id === stationId);
        const { __map__: map, onSearch } = this.props;
        map.setCenter([position.longitude, position.latitude]);
        map.setZoom(10);
        if (onSearch) onSearch(extData);
    }

    onActive = e => {
        let el = e.target;
        if (el.nodeName !== 'LI') {
            el = el.parentElement;
        }
        [...el.parentElement.children].map(m => m.classList.remove('selected'));
        el.classList.add('selected');
        const { onSelect } = this.props;
        const itemType = el.dataset.code
        if (onSelect) onSelect(itemType);
    }

    render() {
        return (
            <div className={`${styles['aqi-select']} clearfix`}>
                <div className="input-wrapper search">
                    <AutoComplete
                        dataSource={this.state.dataSource}
                        style={{ width: 170 }}
                        onSelect={this.onSelect}
                        onSearch={this.handleSearch}
                    >
                        <Search placeholder="搜索污染地址" />
                    </AutoComplete>
                </div>
                <ul className="list clearfix">
                    <li className="selected" data-code='AQI' onClick={this.onActive}>AQI</li>
                    <li data-code='PM2_5' onClick={this.onActive}>PM<sub>2.5</sub></li>
                    <li data-code='PM10' onClick={this.onActive}>PM<sub>10</sub></li>
                    <li data-code='SO2' onClick={this.onActive}>SO<sub>2</sub></li>
                    <li data-code='NO2' onClick={this.onActive}>NO<sub>2</sub></li>
                    <li data-code='O3' onClick={this.onActive}>O<sub>3</sub></li>
                    <li data-code='CO' onClick={this.onActive}>CO</li>
                </ul>
            </div>
        );
    }
}