import { PureComponent } from 'react';
import { COLOR, LEVEL_DISPLAY_NAME } from '@/constants';
import styles from './Details.less';
import ReactEcharts from 'echarts-for-react';

export default class Details extends PureComponent {
    constructor(props) {
        super(props);

    }

    fillAqiPan(v) {
        const degs = v <= 200 ? (30 * v / 50) : v <= 300 ? (120 + (v - 200) / 100 * 30) : v <= 500 ? (150 + (v - 300) / 200 * 30) : 180;
        const index = v <= 200 ? Math.ceil(v / 50) : v <= 300 ? 5 : 6;
        const rdeg = degs - 45;
        const rcolor = index < 6 ? 'transparent' : COLOR[6];
        const bcolor = index < 2 ? 'transparent' : COLOR[index];
        const bar = document.querySelector('.bar');
        const level = document.querySelector('.dish .aqi-level');
        bar.style.transform = `rotateZ(${rdeg}deg)`;
        bar.style['border-left-color'] = COLOR[index];
        bar.style['border-bottom-color'] = bcolor;
        bar.style['border-right-color'] = rcolor;
        document.querySelector('.dish .aqi-value').textContent = v;
        level.className = `aqi-level bgcolor${index}`;
        level.textContent = LEVEL_DISPLAY_NAME[index];
    }

    componentDidMount() {
        var a = setInterval(() => {
            this.fillAqiPan(100);
            clearInterval(a);
        }, 1000);
        var b = setInterval(() => {
            this.fillAqiPan(200);
            clearInterval(b);
        }, 2000);
        var c = setInterval(() => {
            this.fillAqiPan(50);
            clearInterval(c);
        }, 3000);
        var d = setInterval(() => {
            this.fillAqiPan(250);
            clearInterval(d);
        }, 4000);
    }

    getOption() {
        return {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['AQI', 'PM2.5', 'PM10', 'SO2', 'NO2', 'O3', 'CO'],
                top: '1%'
            },
            grid: {
                left: '3%',
                top: '12%',
                right: '4%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'AQI',
                    type: 'line',
                    smooth: true,
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: 'PM2.5',
                    type: 'line',
                    smooth: true,
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: 'PM10',
                    type: 'line',
                    smooth: true,
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: 'SO2',
                    type: 'line',
                    smooth: true,
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: 'NO2',
                    type: 'line',
                    smooth: true,
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                },
                {
                    name: 'O3',
                    type: 'line',
                    smooth: true,
                    data: [234, 523, 78, 123, 456, 801, 346]
                },
                {
                    name: 'CO',
                    type: 'line',
                    smooth: true,
                    data: [521, 456, 112, 445, 124, 653, 781]
                }
            ]
        };
    }

    render() {
        return (
            <div className={styles['right-popup']}>
                <div className="right-aqi-box">
                    <p className="aqi-update-time">2019-2-22 10时更新</p>
                    <div className="dish">
                        <div className="aqi-level-box">
                            <p>质量等级：<span className="aqi-level bgcolor2">良</span></p>
                            <p>首要污染物：<span>PM2.5</span></p>
                            <div className="health-tip-box">
                                <span className="health-tip">健康提示</span>
                                <span className="health-tip-text">
                                    <i>健康影响：空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响</i>
                                    <i>建议措施：极少数异常敏感人群应减少户外活动</i>
                                </span>
                            </div>
                        </div>
                        <div className="aqi-value">55</div>
                        <div className="aqi-name">AQI参数</div>
                        <img src={require('@/assets/pan.png')} className="pan" />
                        <div className="bar-wrap"><div className="bar"><img src={require('@/assets/needle.png')} /></div></div>
                    </div>
                    <p className="sm-title">六项污染物浓度<span className="unit">单位为:μg/m<sup>3</sup>&nbsp;&nbsp;CO为:mg/m<sup>3</sup></span></p>
                    <table className="aqi-table">
                        <tbody>
                            <tr>
                                <td><span>SO<sub>2</sub></span><span className="bgcolor1">11</span></td>
                                <td><span>NO<sub>2</sub></span><span className="bgcolor2">11</span></td>
                                <td><span>CO</span><span className="bgcolor3">11</span></td>
                            </tr>
                            <tr>
                                <td><span>O<sub>3</sub></span><span className="bgcolor4">11</span></td>
                                <td><span>PM<sub>10</sub></span><span className="bgcolor5">11</span></td>
                                <td><span>PM<sub>2.5</sub></span><span className="bgcolor6">11</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right-chart-title">24小时变化浓度</div>
                <div className="right-chart-box">
                    <ReactEcharts option={this.getOption()} style={{ height: '250px' }} />
                </div>
                <div className="right-chart-title">关联站点浓度变化趋势</div>
                <div className="right-chart-box">
                </div>
            </div>
        );
    }
}