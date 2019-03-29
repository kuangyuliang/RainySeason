import { PureComponent } from 'react';
import moment from 'moment';
import styles from './index.less';

export default class TimePlay extends PureComponent {
    constructor(props) {
        super(props);

        this.option = {
            startDate: moment().add(-3, 'months'),
            endDate: moment().add(6, 'days'),
            currentData: moment(),
            timeUnitControl: true,
            speed: 1000,
            callback(date) {
                console.log(date);
            },
            ...this.props,
            delay: false,
            index: 0,
            timer: null,
            translate: 0,
            width: 0,
            timeUnit: '时',
            left: 0,
            right: 0,
            dis: 0,
            dis_hour: 0,
            curr_x: 0,
            temp_day: {},
            curr_day: {},
            index_hover: 0,
            hover: 0
        };

        this.changeTimeUnit = this.changeTimeUnit.bind(this);
        this.hoverPopup = this.hoverPopup.bind(this);
        this.pageNext = this.pageNext.bind(this);
        this.pagePrev = this.pagePrev.bind(this);
        this.clickPopup = this.clickPopup.bind(this);
        this.play = this.play.bind(this);
        this.today = this.today.bind(this);
    }

    initDate() {
        const { currentData } = this.option;
        const
            year = currentData.get('year'),
            month = currentData.get('month') + 1,
            day = currentData.get('date'),
            hour = currentData.get('hour');
        this.option.left = this.offset(document.querySelector('.timeProgress-box')).left;
        this.option.right = window.innerWidth - this.option.left - this.getWidth(document.querySelector('.timeProgress-box'));
        this.option.dis = this.getOuterWidth(document.querySelector('.timeProgress-inner li'));
        this.option.dis_hour = this.option.dis / 24;
        this.option.curr_day = {
            year,
            month,
            day,
            hour
        };

        document.querySelector('.curr-popup').style.display = 'none';
        document.querySelector('.for-animate').style.display = 'block';

        document.querySelector('.for-click').textContent = `${hour}:00`;
        document.querySelector('.for-animate').textContent = `${hour}:00`;
        const every = document.querySelectorAll('.every');
        for (let i = 0; i < every.length; i++) {
            const { m, d } = every[i].dataset;
            if (month === parseInt(m) && day === parseInt(d)) {
                this.option.index = i;
                this.option.width = this.option.dis * i + this.option.dis / 24 * hour;
                this.progressAni();
                break;
            }
        }
    }

    progressAni() {
        let
            page_width = this.getWidth(document.querySelector(".timeProgress-box")),
            con_width = this.getWidth(document.querySelector(".timeProgress-inner")),
            page_num = Math.floor(this.option.width / page_width),
            left_dis = page_num * page_width;
        if (page_width - this.option.width + left_dis < this.option.dis) {
            left_dis = left_dis + (page_width / 2);
        }
        if (left_dis + page_width > con_width) {
            left_dis = con_width - page_width;
            document.querySelector(".next").classList.add('disable');
        }
        if ((this.option.width - left_dis) < this.option.dis) {
            left_dis = left_dis - (page_width / 2);
        }
        if (left_dis < 0) {
            left_dis = 0;
        }
        this.option.translate = left_dis;
        document.querySelector(".timeProgress-inner").style.transform = `translateX(-${left_dis}px)`;
        document.querySelector(".timeProgress-bar").style.width = `${this.option.width}px`;
    }

    calcLeapYear(year) {
        return (year % 4 == 0) && ((year % 100 == 0) ? (year % 400 == 0) : true);
    }

    monthCount(month, year) {
        return (month < 8) ? ((month == 2) ? (this.calcLeapYear(year) ? 29 : 28) : ((month % 2 == 0) ? 30 : 31)) : ((month % 2 == 0) ? 31 : 30);
    }

    fillDate() {
        const { startDate, endDate } = this.option;
        let startYear = startDate.get('year'),
            startMonth = startDate.get('month') + 1,
            startDay = startDate.get('date'),
            endYear = endDate.get('year'),
            endMonth = endDate.get('month') + 1,
            endDay = endDate.get('date'),
            list = [
                <li key={`${startYear}-${startMonth}-${startDay}`} className="every" data-y={startYear} data-m={startMonth} data-d={startDay}>
                    <span className="mon">{startMonth}</span>/<span className="day">{startDay}</span>
                </li>
            ];
        while ((startDay != endDay) || (startMonth != endMonth) || (startYear != endYear)) {
            startDay++;
            if (startDay > this.monthCount(startMonth, startYear)) {
                startDay = 1;
                startMonth++;
            }
            if (startMonth > 12) {
                startMonth = 1;
                startYear++;
            }
            list.push(
                <li key={`${startYear}-${startMonth}-${startDay}`} className="every" data-y={startYear} data-m={startMonth} data-d={startDay}>
                    <span className="mon">{startMonth}</span>/<span className="day">{startDay}</span>
                </li>
            );
        }

        return list;
    }

    offset(el) {
        const box = el.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
        }
    }

    getWidth(el) {
        const styles = window.getComputedStyle(el);
        const width = el.offsetWidth;
        const borderLeftWidth = parseFloat(styles.borderLeftWidth);
        const borderRightWidth = parseFloat(styles.borderRightWidth);
        const paddingLeft = parseFloat(styles.paddingLeft);
        const paddingRight = parseFloat(styles.paddingRight);
        return width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight;
    }

    getOuterWidth(el) {
        const styles = window.getComputedStyle(el);
        const width = el.clientWidth;
        const borderLeftWidth = parseFloat(styles.borderLeftWidth);
        const borderRightWidth = parseFloat(styles.borderRightWidth);
        return width + borderLeftWidth + borderRightWidth;
    }

    hoverPopup() {
        const move = (event) => {
            const e = event || window.event;
            const x = e.clientX;
            const { translate, left, dis, dis_hour, timeUnit } = this.option;
            const day_index = Math.floor((x + translate - left) / dis);
            this.option.index_hover = day_index;
            const date = document.querySelectorAll('.every')[day_index];
            this.option.temp_day = {
                year: parseInt(date.dataset.y),
                month: parseInt(date.dataset.m),
                day: parseInt(date.dataset.d),
                hour: Math.floor(((x + translate - left) % dis) / dis_hour)
            }
            this.option.curr_x = x + translate - left;
            let texts = `${this.option.temp_day.hour}:00`;
            if (timeUnit == '天') {
                texts = `${this.option.temp_day.month}月${this.option.temp_day.day}日`;
            }
            const popup = document.querySelector('.hover-popup');
            popup.style.display = 'block';
            popup.style.left = `${x - left}px`;
            popup.textContent = texts;
        };
        window.addEventListener('mousemove', move);

        const timeProgress = document.querySelector('.timeProgress');
        const leave = () => {
            timeProgress.removeEventListener('mouseleave', leave);
            window.removeEventListener('mousemove', move);
            document.querySelector('.hover-popup').style.display = 'none';
        }
        timeProgress.addEventListener('mouseleave', leave);
    }

    clickPopup() {
        this.stopPlay();
        const { timeUnit, temp_day, curr_x, translate, index_hover } = this.option;
        let texts = `${temp_day.hour}:00`;
        if (timeUnit == '天') {
            texts = `${this.option.temp_day.month}月${this.option.temp_day.day}日`;
        }
        const animate = document.querySelector('.for-animate'),
            click = document.querySelector('.for-click');
        animate.style.display = 'none';
        click.style.display = 'block';
        click.style.left = `${curr_x - translate}px`;
        animate.textContent = click.textContent = texts;
        document.querySelector(".timeProgress-bar").style.width = `${curr_x}px`;
        this.option.width = curr_x;
        this.option.curr_day = temp_day;
        this.option.index = index_hover;
        const { year, month, day, hour } = this.option.curr_day;
        this.option.callback(moment(`${year}-${month}-${day} ${hour}:00`, 'YYYY-MM-DD HH:mm'));
    }

    changeTimeUnit() {
        let unit = '时',
            texts = `${this.option.curr_day.hour}:00`;
        const timeUnitBtns = document.querySelectorAll('.timeUnitBtn');

        timeUnitBtns.forEach(f => {
            f.classList.toggle('active');
            if (f.classList.contains('active')) {
                this.option.timeUnit = unit = f.dataset.unit;
            }
        });
        console.log(unit);
        if (unit === '天') {
            texts = `${this.option.curr_day.month}月${this.option.curr_day.day}日`;
        }

        document.querySelector('.for-click').textContent = texts;
        document.querySelector('.for-animate').textContent = texts;
    }

    pageNext() {
        document.querySelector('.for-click').style.display = 'none';
        document.querySelector('.for-animate').style.display = 'block';
        document.querySelector(".prev").classList.remove('disable');
        const inner = document.querySelector('.timeProgress-inner'),
            page_width = this.getWidth(document.querySelector('.timeProgress-box')),
            con_width = this.getWidth(inner);
        this.option.translate += page_width;
        if (this.option.translate + page_width >= con_width) {
            this.option.translate = con_width - page_width;
            document.querySelector(".next").classList.add('disable');
        }
        inner.style.transform = `translateX(-${this.option.translate}px)`;
    }

    pagePrev() {
        document.querySelector('.for-click').style.display = 'none';
        document.querySelector('.for-animate').style.display = 'block';
        document.querySelector(".next").classList.remove('disable');
        const page_width = this.getWidth(document.querySelector('.timeProgress-box'));
        this.option.translate -= page_width;
        if (this.option.translate < 0) {
            this.option.translate = 0;
            document.querySelector(".prev").classList.add('disable');
        }
        document.querySelector('.timeProgress-inner').style.transform = `translateX(-${this.option.translate}px)`;
    }

    play() {
        if (document.querySelector('.timeControl').classList.contains('play')) {
            this.startPlay();
        }
        else {
            this.stopPlay();
        }
    }

    startPlay() {
        const timeProgress = document.querySelector('.timeProgress');
        if (this.option.width >= this.getWidth(timeProgress)) {
            return false;
        }
        const timeControl = document.querySelector('.timeControl'),
            click = document.querySelector('.for-click'),
            animate = document.querySelector('.for-animate');
        timeControl.classList.toggle('play');
        timeControl.classList.toggle('pause');
        click.style.display = 'none';
        animate.style.display = 'block';

        this.progressAni();
        this.option.timer = setInterval(() => {
            if (this.option.delay) {
                return false;
            }
            const temp_date = this.option.curr_day;
            if (this.reachEnd()) {
                this.halfPageNext();
            }
            if (this.option.timeUnit === '时') {
                const real_width = Math.floor(this.option.width / this.option.dis_hour) * this.option.dis_hour;
                this.option.width = real_width + this.option.dis_hour;
                this.option.curr_day.hour = this.option.curr_day.hour + 1;
                if ((this.option.curr_day.hour % 24) == 0) {
                    this.option.index++;
                    const date = document.querySelectorAll('.every')[this.option.index];
                    this.option.curr_day = {
                        year: parseInt(date.dataset.y),
                        month: parseInt(date.dataset.m),
                        day: parseInt(date.dataset.d),
                        hour: 0
                    }
                }
                click.textContent = `${this.option.curr_day.hour}:00`;
                animate.textContent = `${this.option.curr_day.hour}:00`;
            } else {
                this.option.index++;
                const date = document.querySelectorAll('.every');
                const real_width = Math.floor(this.option.width / this.option.dis) * this.option.dis;
                this.option.width = real_width + this.option.dis;
                this.option.curr_day = {
                    year: parseInt(date[this.option.index].dataset.y),
                    month: parseInt(date[this.option.index].dataset.m),
                    day: parseInt(date[this.option.index].dataset.d),
                    hour: 0
                }
                if (this.option.index < date.length) {
                    click.textContent = `${this.option.curr_day.month}月${this.option.curr_day.day}日`;
                    animate.textContent = `${this.option.curr_day.month}月${this.option.curr_day.day}日`;
                }
            }
            if (this.option.width >= this.getWidth(timeProgress)) {
                this.option.width = this.getWidth(timeProgress);
                this.option.curr_day = temp_date;
                this.option.stopPlay();
            }
            document.querySelector('.timeProgress-bar').style.width = `${this.option.width}px`;
            const { year, month, day, hour } = this.option.curr_day;
            this.option.callback(moment(`${year}-${month}-${day} ${hour}:00`, 'YYYY-MM-DD HH:mm'));
        }, this.option.speed);
    }

    stopPlay() {
        const timeControl = document.querySelector('.timeControl');
        if (timeControl.classList.contains('pause')) {
            timeControl.classList.toggle('play');
            timeControl.classList.toggle('pause');
        }
        clearInterval(this.option.timer);
    }

    reachEnd() {
        const dis_right = this.getWidth(document.querySelector('.timeProgress-box')) - (this.option.width - this.option.translate);
        if (dis_right <= 108) {
            return true;
        }
        return false;
    }

    halfPageNext() {
        document.querySelector('.prev').classList.remove('disable');
        const inner = document.querySelector('.timeProgress-inner'),
            page_width = this.getWidth(document.querySelector('.timeProgress-box')),
            con_width = this.getWidth(inner);
        this.option.translate += (page_width / 2);
        if (this.option.translate + page_width > con_width) {
            this.option.translate = con_width - page_width;
            document.querySelector('.next').classList.add('disable');
        }
        inner.style.transform = `translateX(-${this.option.translate}px)`;
    }

    delayAnimation() {
        this.option.delay = true;
    }

    continueAnimation() {
        this.option.delay = false;
    }

    today() {
        this.initDate();
        const { year, month, day, hour } = this.option.curr_day;
        this.option.callback(moment(`${year}-${month}-${day} ${hour}:00`, 'YYYY-MM-DD HH:mm'));
    }

    componentDidMount() {
        this.initDate();
    }

    render() {
        return (
            <div className={styles.timePlay}>
                {
                    this.option.timeUnitControl &&
                    <div className="timeUnit">
                        <div className="inner">
                            <div className="timeUnitBtn" data-unit='天' onClick={this.changeTimeUnit}>天</div>
                            <div className="timeUnitBtn active" data-unit='时' onClick={this.changeTimeUnit}>时</div>
                        </div>
                    </div>
                }
                <div className="timeMain">
                    <div className="timeControl-box">
                        <div className="timeControl play" onClick={this.play}></div>
                    </div>
                    <div className="prev-box">
                        <div className="prev" title="上一页" onClick={this.pagePrev}></div>
                    </div>
                    <div className="next-box">
                        <div className="next" title="下一页" onClick={this.pageNext}></div>
                    </div>
                    <div className="today" onClick={this.today}>回到今天</div>
                    <div className="timeProgress-box">
                        <div className="hover-popup"></div>
                        <div className="curr-popup for-click">17:00</div>
                        <div className="timeProgress-hide">
                            <div className="timeProgress-inner">
                                <div className="timeProgress" onMouseOver={this.hoverPopup} onClick={this.clickPopup}>

                                    <div className="timeProgress-bar">
                                        <div className="curr-popup for-animate">11:00</div>
                                    </div>

                                </div>
                                <ul>
                                    {
                                        this.fillDate().map(m => m)
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}