"use strict";
export default function WindLayer(map, amapCustomLayer, option) {
    var _ = {
        map: map,
        amapLayer: amapCustomLayer,
        canvas: {},
        data: [], //数据使用grib2json转换后的格式
        fadeFillStyle: "rgba(200, 100, 200, 0.95)",
        particles: [],
        buckets: [],
        colorStyles: [],
        grid: [],
        columns: [],
        timerID: null
    };

    this.get = function (key) {
        return _[key];
    };
    this.set = function (key, value) {
        _[key] = value;
    };
    this.configure(option);
    this.initLayer();
}

WindLayer.prototype.configure = function (option) {
    var self = this;
    self.set("canvas", option.canvas);
    self.set("data", option.data);
};
WindLayer.prototype.initLayer = function () {
    var self = this;
    var map = this.get("map");
    var datas = this.get("data");
    var mapZoomEventListener = this.get("mapZoomEventListener");
    var canvas = this.get("canvas");
    //初始化风矢量颜色等级
    this.set("colorStyles", WindLayer.windIntensityColorScale(10, 17));

    if (datas != null) {
        //仅更新数据，不触发渲染动画
        this.update(datas, false);
    }

    //amap的刷新机制触发方法
    //clean =true 表示将之前动画内容清除。如果没有发生地图拖拽且需要查看连续时间数据的变化效果时，使用false
    this.get("amapLayer").render = function () {
        var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var datas = this.get("data");
        if (datas == null) {
            return;
        }
        var grid = this.get("grid");
        var canvas = this.get("canvas");

        var header = datas[0].header;
        var λ0 = header.lo1,
            φ0 = header.la1;
        var Δλ = header.dx,
            Δφ = header.dy;
        var ni = header.nx,
            nj = header.ny;
        var date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);

        //高德地图的经度从西-180到东180，纬度从北90到南-90
        //暂停动画
        clearInterval(this.get("timerID"));

        if (clean) {
            var g = canvas.getContext("2d");
            g.clearRect(0, 0, canvas.width, canvas.height);
        }

        var xside = [];
        var yside = [];
        for (var x = 0; x <= canvas.width; x += 2) {
            var agps = map.containTolnglat(new AMap.Pixel(x, 0));
            var ggps = WindLayer.lngLatA2G(agps.getLng(), agps.getLat());
            xside[x + 1] = xside[x] = ggps.lng;
        }
        for (var y = 0; y <= canvas.height; y += 2) {
            var agps = map.containTolnglat(new AMap.Pixel(0, y));
            var ggps = WindLayer.lngLatA2G(agps.getLng(), agps.getLat());
            yside[y + 1] = yside[y] = ggps.lat;
        }

        var columns = [];
        for (var x = 0; x <= canvas.width; x += 2) {
            var column = [];
            for (var y = 0; y <= canvas.height; y += 2) {
                var ggps = { lng: xside[x], lat: yside[y] };

                var wind = WindLayer.interpolate(grid, ggps.lng, ggps.lat, λ0, Δλ, φ0, Δφ);
                if (wind) {
                    wind = WindLayer.distort(wind, WindLayer.FLYSPEED);
                }
                column[y + 1] = column[y] = wind || WindLayer.HOLE_VECTOR;
            }
            columns[x + 1] = columns[x] = column;
        }
        this.set("columns", columns);

        //启动动画
        this.set("timerID", setInterval(function () {
            this.animate(map.getZoom());
        }.bind(this), 40));
    }.bind(this);
};

//
/**
 * 更新数据并渲染新动画
 * @param  {[type]}  data   [description]
 * @param  {Boolean} render 是否渲染动画，在初始化时必须为false
 * @return {[type]}         [description]
 */
WindLayer.prototype.update = function (data) {
    var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var datas = data || this.get("data");
    //初始化GFS格点数据
    var uData = datas[0].data;
    var vData = datas[1].data;
    var header = datas[0].header;

    var λ0 = header.lo1,
        φ0 = header.la1;
    var Δλ = header.dx,
        Δφ = header.dy;
    var ni = header.nx,
        nj = header.ny;

    var grid = [],
        p = 0;
    var isContinuous = Math.floor(ni * Δλ) >= 360;
    for (var j = 0; j < nj; j++) {
        var row = [];
        for (var i = 0; i < ni; i++ , p++) {
            row[i] = [uData[p], vData[p]];
        }
        if (isContinuous) {
            row.push(row[0]);
        }
        grid[j] = row;
    }
    //grid是列索引从南0-北180，行索引从西0-东361，对应的GFS的经纬度格式
    this.set("grid", grid);
    //如果初始化的时候没有data，则此时需要创建粒子
    if (this.get("data") == null) {
        this.set("data", data);
        this.updataParticles();
    } else {
        this.set("data", data);
    }

    if (render) {
        this.get("amapLayer").render(false);
    }
};

//动画渲染方法
WindLayer.prototype.animate = function (maplevel) {
    var particles = this.get("particles");
    var colorStyles = this.get("colorStyles");
    var buckets = colorStyles.map(function () {
        return [];
    });
    var columns = this.get("columns");
    var canvas = this.get("canvas");
    var g = canvas.getContext("2d");
    g.lineWidth = this.getParticleConfig(maplevel).width;
    g.fillStyle = this.get("fadeFillStyle");

    particles.forEach(function (particle) {
        if (particle.age > WindLayer.MAX_PARTICLE_AGE) {
            WindLayer.randomize(particle, 0, canvas.width, 0, canvas.height).age = 0;
        }
        var x = particle.x;
        var y = particle.y;
        var v = WindLayer.getVector(columns, x, y);
        var m = v[2];
        if (m === null) {
            particle.age = 100;
        } else {
            var xt = x + v[0];
            var yt = y + v[1];
            if (true) {
                particle.xt = xt;
                particle.yt = yt;
                buckets[colorStyles.indexFor(m)].push(particle);
            } else {
                particle.x = xt;
                particle.y = yt;
            }
        }
        particle.age += 1;
    });
    this.set("buckets", buckets);

    var prev = g.globalCompositeOperation;
    g.globalCompositeOperation = "destination-in";
    g.fillRect(0, 0, canvas.width, canvas.height);
    g.globalCompositeOperation = prev;

    buckets.forEach(function (bucket, i) {
        if (bucket.length > 0) {
            g.beginPath();
            g.strokeStyle = colorStyles[i];
            bucket.forEach(function (particle) {
                g.moveTo(particle.x, particle.y);
                g.lineTo(particle.xt, particle.yt);
                particle.x = particle.xt;
                particle.y = particle.yt;
            });
            g.stroke();
        }
    });
};

/**
 * 刷新例子，数量根据地图缩放级别确定
 * @return {[type]} [description]
 */
WindLayer.prototype.updataParticles = function () {
    var map = this.get("map");
    var canvas = this.get("canvas");
    var multiplier = this.getParticleConfig(map.getZoom()).multiplier;
    var particleCount = Math.round(canvas.width * multiplier);
    var particles = [];
    for (var i = 0; i < particleCount; i++) {
        particles.push(WindLayer.randomize({ age: Math.round(Math.random() * WindLayer.MAX_PARTICLE_AGE) }, 0, canvas.width, 0, canvas.height));
    }
    this.set("particles", particles);
    return particles;
};

WindLayer.prototype.getParticleConfig = function (mapLevel) {
    if (WindLayer.contains([1, 2, 3], mapLevel)) {
        //国家级
        return { multiplier: 4, width: 1 };
    } else if (WindLayer.contains([4, 5, 6, 7], mapLevel)) {
        //城市级
        return { multiplier: 1, width: 1 };
    } else if (WindLayer.contains([8, 9, 10], mapLevel)) {
        //区县级
        return { multiplier: 0.5, width: 1 };
    } else if (WindLayer.contains([8, 9, 10, 11, 12, 13], mapLevel)) {
        //街道级
        return { multiplier: 0.5, width: 1 };
    } else {
        //站点级[14,15..18]
        return { multiplier: 0.4, width: 1 };
    }
};

//释放所有资源，一定要手动置null，防止泄漏
WindLayer.prototype.dispose = function () {
    //暂停动画
    clearInterval(this.get("timerID"));

    this.set("map", null);
    this.set("amapLayer", null);
    this.set("canvas", null);
    this.set("data", []);
    this.set("particles", []);
    this.set("buckets", []);
    this.set("buckets", []);
    this.set("grid", []);
    this.set("columns", []);
    this.set("timerID", null);
};

//---------------------枚举变量------------------------------


WindLayer.NULL_WIND_VECTOR = [NaN, NaN, null];
WindLayer.HOLE_VECTOR = [NaN, NaN, null];

WindLayer.MAX_PARTICLE_AGE = 100;
WindLayer.FLYSPEED = 0.13;

//---------------------工具方法------------------------------


//高德地图经纬度(西-180~东180,南-90~北90)转换为GFS的GPS(西-180~东180,南-90~北90)的经纬度
WindLayer.lngLatA2G = function (alng, alat) {
    return { lng: alng, lat: alat };
};

WindLayer.interpolate = function (grid, λ, φ, λ0, Δλ, φ0, Δφ) {
    var i = WindLayer.floorMod(λ - λ0, 360) / Δλ;
    var j = (φ0 - φ) / Δφ;

    var fi = Math.floor(i),
        ci = fi + 1;
    var fj = Math.floor(j),
        cj = fj + 1;

    var row;
    if (row = grid[fj]) {
        var g00 = row[fi];
        var g10 = row[ci];
        if (WindLayer.isValue(g00) && WindLayer.isValue(g10) && (row = grid[cj])) {
            var g01 = row[fi];
            var g11 = row[ci];
            if (WindLayer.isValue(g01) && WindLayer.isValue(g11)) {
                return WindLayer.interpolateWindVector(i - fi, j - fj, g00, g10, g01, g11);
            }
        }
    }
    return null;
};

WindLayer.interpolateWindVector = function (x, y, g00, g10, g01, g11) {
    var rx = 1 - x;
    var ry = 1 - y;
    var a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
};

WindLayer.asColorStyle = function (r, g, b, a) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
};

WindLayer.windIntensityColorScale = function (step, maxWind) {
    var result = [];
    for (var j = 220; j <= 255; j += step) {
        result.push(WindLayer.asColorStyle(77, 147, 206, 1.0));
    }
    result.indexFor = function (m) {
        // map wind speed to a style
        return Math.floor(Math.min(m, maxWind) / maxWind * (result.length - 1));
    };
    return result;
};

WindLayer.randomize = function (o, xMin, xMax, yMin, yMax) {
    var x, y;
    x = Math.round(xMin + Math.random() * (xMax - xMin));
    y = Math.round(yMin + Math.random() * (yMax - yMin));
    o.x = x;
    o.y = y;
    return o;
};

WindLayer.getVector = function (columns, x, y) {
    var column = columns[Math.round(x)];
    return column && column[Math.round(y)] || WindLayer.NULL_WIND_VECTOR;
};

WindLayer.floorMod = function (a, n) {
    var f = a - n * Math.floor(a / n);
    return f === n ? 0 : f;
};

WindLayer.isValue = function (x) {
    return x !== null && x !== undefined;
};

WindLayer.distort = function (wind, scale) {
    wind[0] = wind[0] * scale;
    wind[1] = wind[1] * scale * -1;
    return wind;
};

WindLayer.contains = function (arr, v) {
    if (arr.includes(v) > -1) {
        return true;
    }
    return false;
};