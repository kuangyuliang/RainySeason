import { PureComponent } from 'react';
import WindLayer from './AMapWindLayer';
import moment from 'moment';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';
import { getAirLayerData, getWindyData } from '@/services/map';
import { AIR_LAYER_URL } from '@/constants';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';

// @connect(({ map, loading }) => ({
//     airLoading: loading.effects['map/getAirLayer'],
//     windyLoading: loading.effects['map/getWindyLayer']
// }))
export default class ToolKit extends PureComponent {
    constructor(props) {
        super(props);
        const { __map__: map, airLayerData } = this.props;
        AMap.plugin('AMap.MouseTool', () => {
            this.tool = new AMap.MouseTool(map);
        });

        this.airLayer = new AMap.ImageLayer({
            zooms: airLayerData.zooms
        });

        this.state = {
            map,
            airLoading: false,
            windyLoading: false
        };

        this.memoizeOneGetWindyData = memoizeOne(getWindyData, isEqual);
        this.airLayerHandler = this.airLayerHandler.bind(this);
        this.windyLayerHandler = this.windyLayerHandler.bind(this);
    }

    initWind() {
        const { map } = this.state;
        const canvas = document.createElement('canvas');
        canvas.width = map.getSize().width;
        canvas.height = map.getSize().height;
        const windLayer = {
            layerCanvas: canvas,
            amapCustomLayer: new AMap.CustomLayer(canvas, {
                zooms: [3, 18],
                zIndex: 15
            }),
            layerOption: {
                canvas,
                data: null
            },
            layer: null,
            close() {
                windLayer.layerOption = null;
                windLayer.layerCanvas = null;
                windLayer.amapCustomLayer.setMap();
                windLayer.amapCustomLayer = null;
                windLayer.layer.dispose();
                windLayer.layer = null;
            }
        };
        windLayer.layer = new WindLayer(map, windLayer.amapCustomLayer, windLayer.layerOption);
        windLayer.amapCustomLayer.setMap(map);
        return windLayer;
    }

    zoomIn() {
        const { map } = this.state;
        map.zoomIn();
    }

    zoomOut() {
        const { map } = this.state;
        map.zoomOut();
    }

    traffic(e) {
        const { map } = this.state;
        const el = e.target.parentElement;
        if (el.classList.contains('active')) {
            map.remove(this.state.trafficLayer);
            el.classList.remove('active');
        } else {
            const trafficLayer = new AMap.TileLayer.Traffic({
                zIndex: 10
            });
            trafficLayer.setMap(map);
            el.classList.add('active');
            this.setState({ trafficLayer });
        }
    }

    drawMarker(e) {
        const el = e.target.parentElement;
        if (el.classList.contains('active')) {
            this.tool.close(true);
            el.classList.remove('active');
        } else {
            this.tool.marker({ zIndex: 999 });
            el.classList.add('active');
        }
    }

    drawRuler(e) {
        const el = e.target.parentElement;
        if (el.classList.contains('active')) {
            this.tool.close(true);
            el.classList.remove('active');
        } else {
            this.tool.rule({ zIndex: 999 });
            el.classList.add('active');
        }
    }

    airLayerHandler(e) {
        const el = e.target.parentElement;
        if (el.classList.contains('active')) {
            this.airLayer.setMap(null);
            el.classList.remove('active');
        } else {
            this.setState({ airLoading: true });
            el.classList.add('active');
            this.drawAirLayer();
        }
    }

    windyLayerHandler(e) {
        const el = e.target.parentElement;
        if (el.classList.contains('active')) {
            this.windLayer.close();
            el.classList.remove('active');
        } else {
            const { __map__: map } = this.props;
            this.setState({ windyLoading: true });
            el.classList.add('active');
            this.windLayer = this.initWind(map);
            this.drawWindLayer(moment());
        }
    }

    drawAirLayer() {
        const that = this;
        const { airLayerData, __map__: map } = this.props;
        getAirLayerData(airLayerData.data).then(res => {
            map.remove(that.airLayer);
            that.airLayer.setImageUrl(`${AIR_LAYER_URL}render/getimg?hash=${res.hash}`);
            that.airLayer.setBounds(new AMap.Bounds(...airLayerData.bounds));
            that.airLayer.setMap(map);
            that.setState({ airLoading: false });
        });
    }

    drawWindLayer = (date) => {
        let params = {
            dir: date.format('YYYYMMDD'),
            file: date.format('YYYYMMDDHH0000')
        };
        this.memoizeOneGetWindyData(params).then(res => {
            this.windLayer.layer.update(res);
            this.setState({ windyLoading: false });
        }).catch(e => {
            params = {
                ...params,
                dir: date.subtract(1, 'day').format('YYYYMMDD')
            };
            this.memoizeOneGetWindyData(params).then(res => {
                this.windLayer.layer.update(res);
                this.setState({ windyLoading: false });
            });
        });
    }

    // componentDidUpdate() {
    //     if (this.airLayer.getMap()) {
    //         this.drawAirLayer();
    //     }
    // }

    render() {
        const { airLoading, windyLoading } = this.state;
        return (
            <div className={styles["right-map-toolbar"]}>
                <div className="zoom-btn" onClick={this.zoomIn.bind(this)}><i className="icon icon44x44 icon-plus"></i></div>
                <div className="zoom-btn" onClick={this.zoomOut.bind(this)}><i className="icon icon44x44 icon-minus"></i></div>
                <ul className="tool-box">
                    <li className="wind-layer" >
                        {
                            windyLoading ?
                                <Icon type="loading" className="icons" />
                                :
                                <img src={require('@/assets/right-icon-1.png')} className="icons" onClick={this.windyLayerHandler} />
                        }
                        <div className="text">风场</div>
                    </li>
                    <li className="air-layer">
                        {
                            airLoading ?
                                <Icon type="loading" className="icons" />
                                :
                                <img src={require('@/assets/right-icon-2.png')} className="icons" onClick={this.airLayerHandler} />
                        }
                        <div className="text">渲染</div>
                    </li>
                    <li className="traffic" onClick={this.traffic.bind(this)}>
                        <i className="icon icon44x44 icon-traffic"></i>
                        <div className="text">路况</div>
                    </li>
                    <li className="draw-marker" onClick={this.drawMarker.bind(this)}>
                        <i className="icon icon44x44 icon-map-marker"></i>
                        <div className="text">标记</div>
                    </li>
                    <li className="draw-ruler" onClick={this.drawRuler.bind(this)}>
                        <i className="icon icon44x44 icon-measure"></i>
                        <div className="text">测距</div>
                    </li>
                </ul>
            </div>
        )
    }
}