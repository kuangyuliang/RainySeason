import { Component } from 'react';
import { Drawer } from 'antd';
import Map from '@/components/Map';
import styles from './index.less';
import { connect } from 'dva';
import { DETECTION_ITEM_TEXT_NAME } from '@/constants';
import Details from '@/components/Map/Details';

@connect(({ map, loading }) => ({
  map,
  loading: loading.effects['map/fetch'],
}))
export default class AirMap extends Component {
  constructor(props) {
    super(props);

    const { stationData } = this.props.map;
    const { markers, airLayerData } = this.generateData(stationData);
    console.log(stationData);
    this.state = {
      mapWidth: window.innerWidth,
      mapHeight: window.innerHeight - 64,
      center: { longitude: 116.23, latitude: 39.54 },
      markers,
      airLayerData,
      stationDetail: {
        visible: false,
      },
      markerInfo: {
        display: 'none',
        date: null,
        level: 0,
        name: '',
        value: 0,
        code: '',
        left: 0,
        top: 0
      },
    };
    // this.filterMarkers = this.filterMarkers.bind(this);
    this.stationDetail = this.stationDetail.bind(this);
  }

  generateData(data, detectionItem = 'AQI') {
    const markers = [], airData = [];
    data.forEach(f => {
      const item = f.data[detectionItem];
      markers.push({
        id: f.id,
        name: f.name,
        extData: {
          id: f.id,
          name: f.name,
          date: f.RecordTime,
          level: item.Level,
          value: item.Value,
          code: detectionItem
        },
        position: {
          longitude: f.geo.lng,
          latitude: f.geo.lat
        },
        html: <div className={`station-icon station-icon${f.type} bg-color${item.Level}`}></div>,
        events: {
          click: (e) => {
            this.stationDetail(e.target.getExtData());
          },
          mouseover: (e) => {
            this.setState({
              markerInfo: {
                display: 'block',
                ...e.target.getExtData()
              }
            });
            const wh = this.getElemPos(e.target.getContentDom());
            const x = wh.x - document.querySelector('.mark-info').offsetWidth / 2 + 10;
            const y = wh.y - document.querySelector('.mark-info').offsetHeight - 3;

            this.setState({
              markerInfo: {
                ...this.state.markerInfo,
                left: x,
                top: y,
              }
            });
          },
          mouseout: (e) => {
            this.setState({ markerInfo: { display: 'none' } });
          }
        }
      });

      airData.push({
        lng: f.geo.lng,
        lat: f.geo.lat,
        value: item.Value,
      });
    });
    const airLayerData = {
      data: {
        datas: airData,
        paramName: detectionItem
      },
      center: [104.561, 37.096],
      scale: 550,
      size: [600, 500],
      sectorName: '中国'
    };
    return { markers, airLayerData };
  }

  getElemPos(obj) {
    const pos = { top: 0, left: 0 };
    if (obj.offsetParent) {
      while (obj.offsetParent) {
        pos.top += obj.offsetTop;
        pos.left += obj.offsetLeft;
        obj = obj.offsetParent;
      }
    } else if (obj.x) {
      pos.left += obj.x;
    } else if (obj.x) {
      pos.top += obj.y;
    }
    return { x: pos.left, y: pos.top };
  }

  closeDrawer() {
    this.setState({ stationDetail: { visible: false } });
  }

  filterMarkers = itemType => {
    const { stationData } = this.props.map;
    const { markers, airLayerData } = this.generateData(stationData, itemType);
    this.setState({
      markers,
      airLayerData
    });
  }

  stationDetail(data) {
    this.setState({
      stationDetail: {
        visible: true,
      }
    });
    console.log(data);
  }

  render() {
    const {
      markerInfo,
      markers,
      airLayerData,
      stationDetail,
      mapWidth,
      mapHeight,
      center
    } = this.state;
    return (
      //style={{ width: `${mapWidth}px`, height: `${mapHeight}px`, margin: '-24px -24px 0' }}
      <div style={{ height: `${mapHeight}px` }} className={styles.map}>
        <Map
          amapkey="7c42bd396475066a40de929712bbba7b"
          center={center}
          zoom={8}
          mapStyle={'amap://styles/ff797d62f68a590eef5b96dc2cdf483c'}
          markers={markers}
          airLayerData={airLayerData}
          onSelect={this.filterMarkers}
          onSearch={this.stationDetail}
        >
        </Map>
        <Drawer
          title="顺义新城"
          placement="right"
          closable={true}
          width={550}
          mask={false}
          visible={stationDetail.visible}
          onClose={this.closeDrawer.bind(this)}
        >
          <Details />
        </Drawer>
        <div className="mark-info" style={{ left: `${markerInfo.left}px`, top: `${markerInfo.top}px`, display: `${markerInfo.display}` }}>
          <div className="inner">
            <div className="left">
              <div className="aqi">{DETECTION_ITEM_TEXT_NAME[markerInfo.code]}</div>
              <div className={`value color${markerInfo.level}`}>{markerInfo.value}</div>
            </div>
            <div className="right">
              <div className="time">{markerInfo.date}</div>
              <div className="address">{markerInfo.name}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
