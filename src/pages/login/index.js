import { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Alert, Checkbox } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
}))
class Login extends Component {
    componentDidMount() {
        //绘制canvas
        const canvas = this.refs.mainCanvas;
        function SiriWave(opt) {
            this.opt = opt || {};
            if (!devicePixelRatio) devicePixelRatio = 1;
            this.width = devicePixelRatio * (this.opt.width || 320);
            this.height = devicePixelRatio * (this.opt.height || 100);
            this.K = 2;
            this.F = 2;
            this.speed = 0.05;
            this.MAX = (this.height / 3) - 4;
            this.noise = this.opt.noise || 0;
            this.phase = this.opt.phase || 0;

            this.canvas = canvas;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.ctx = this.canvas.getContext('2d');

            this.run = false;
        }
        SiriWave.prototype = {
            _globalAttenuationFn: function (x) {
                return Math.pow(this.K * 4 / (this.K * 4 + Math.pow(x, 4)), this.K * 2);
            },

            _drawLine: function (attenuation, color, width) {
                this.ctx.moveTo(0, 0);
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = width || 1;
                let x, y;
                for (let i = -this.K; i <= this.K; i += 0.01) {
                    x = this.width * ((i + this.K) / (this.K * 2));
                    y = this.height / 3 + this.noise * this._globalAttenuationFn(i) * (1 / attenuation) * Math.sin(this.F * i - this.phase);
                    this.ctx.lineTo(x, y);
                }
                this.ctx.stroke();
            },
            _draw: function () {
                if (!this.run) return;
                this._clear();
                this.phase = (this.phase + this.speed) % (Math.PI * 64);
                this._drawLine(-1, 'rgba(16, 142, 233, 1)');
                this._drawLine(-6, 'rgba(12, 142, 233, 0.2)');
                this._drawLine(4, 'rgba(16, 142, 233, 0.1)');
                this._drawLine(8, 'rgba(16, 142, 233, 0.05)');


                requestAnimationFrame(this._draw.bind(this), 1000);
            },
            _clear: function () {
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.globalCompositeOperation = 'source-over';
            },
            start: function () {
                this.phase = 0;
                this.run = true;
                this._draw();
            },

            setNoise: function (v) {
                this.noise = Math.min(v, 1) * this.MAX;
            },
        };
        const SW = new SiriWave({
            width: 740,
            height: 300
        });
        SW.start();
        setInterval(function () {
            SW.setNoise(0.2);
        }, 0);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'login/login',
                    payload: {
                        ...values
                    }
                });
            }
        });
    }

    render() {
        const { login, submitting } = this.props;
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div>
                <canvas className={styles.login_canvas} ref="mainCanvas">
                </canvas>
                <div>
                    <Form
                        className={styles["login-form"]}
                        onSubmit={this.handleSubmit.bind(this)}
                    >
                        <h1 className={styles.login_title}>旭诚科技</h1>
                        <FormItem>
                            {getFieldDecorator('userNameOrEmailAddress', {
                                rules: [{ required: true, message: '请输入用户名！' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        {
                            (login.success === false && login.error) &&
                            <FormItem>
                                <Alert message={login.error.details} type="error" showIcon />
                            </FormItem>
                        }
                        <FormItem>
                            <Button type="primary" className={styles["login-form-button"]} htmlType="submit" loading={submitting}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Form.create()(Login);;