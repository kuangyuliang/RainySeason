import React, { PureComponent } from 'react';
import { Map, Marker, Polygon } from 'react-amap';
import boundaries from '@/utils/boundaries.json';
import ToolKit from '@/components/ToolKit';
import MapSearchBar from '@/components/MapSearchBar';
import TimePlay from '@/components/TimePlay';

export default class AirMap extends PureComponent {
    constructor(props) {
        super(props);
        this.timeplay = React.createRef();
    }

    test = (date) => {
        console.log(date.format('YYYY-MM-DD HH:mm'));
        this.timeplay.current.delayAnimation();
        setTimeout(() => {
            this.timeplay.current.continueAnimation();
        }, 5000);
    }

    render() {
        const {
            amapkey,
            center,
            zoom,
            mapStyle,
            markers,
            airLayerData,
            onSearch,
            onSelect
        } = this.props;
        console.log(airLayerData);
        return (
            <Map
                amapkey={amapkey}
                mapStyle={mapStyle}
                center={center}
                zoom={zoom}
            >
                {
                    boundaries &&
                    boundaries.map((m, i) =>
                        <Polygon path={m} style={{ strokeWeight: 3, fillOpacity: 0, strokeColor: '#469FC7' }} key={i} />
                    )
                }
                {
                    markers &&
                    markers.map((m, i) => {
                        console.log(1)
                        return (
                            <Marker position={m.position} events={m.events} extData={m.extData} key={i}>
                                {m.html}
                            </Marker>
                        );
                    })
                }

                <MapSearchBar autoCompleteData={markers} onSearch={onSearch} onSelect={onSelect} />
                <ToolKit
                    airLayerData={{
                        data: airLayerData,
                        bounds: [[73.30875662922783, 13.817989837346863], [135.8132433707722, 54.94732457819207]],
                        zooms: [3, 18]
                    }}
                />

                <TimePlay timeUnitControl={false} callback={this.test} ref={this.timeplay} />
            </Map>
        )
    }
}