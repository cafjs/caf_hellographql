// Modifications copyright 2020 Caf.js Labs and contributors
/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';
const assert = require('assert');
const caf = require('caf_core');
const app = require('../public/js/app.js');
const caf_comp = caf.caf_components;
const myUtils = caf_comp.myUtils;
const APP_SESSION = 'default';
const IOT_SESSION = 'iot';

const notifyIoT = function(self, msg) {
    self.$.session.notify([msg], IOT_SESSION);
};

const notifyWebApp = function(self, msg) {
    self.$.session.notify([msg], APP_SESSION);
};

const scheduleBundle = function(self, result) {
    var bundle = self.$.iot.newBundle(self.$.props.margin);
    bundle.setPin(0, [self.state.pinNumber, true])
        .setPin(3000, [self.state.pinNumber, false]);
    notifyIoT(self, result);
    return self.$.iot.sendBundle(bundle);
};

const evalQuery = async function(self) {
    let res = await self.$.graphql.dirtyEvalQuery(self);
    if (res) {
        // Query result changed from last time
        let resStr = JSON.stringify(res);
        self.state.queryResult = resStr;
        scheduleBundle(self, resStr);
        self.$.log && self.$.log.debug('EvalQuery: ' + resStr);
    }
    return res;
};

exports.methods = {

    // Called by the framework

    async __ca_init__() {
        this.state.city = '';
        this.state.weatherInfo = {};
        this.state.query = '';
        this.state.queryResult = '';
        this.state.keyAPI = '';
        this.state.counter = 0;
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.$.session.limitQueue(1, IOT_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.pinNumber = this.$.props.pinNumber;
        this.$.weather.setHandleReplyMethod('__ca_handleWeather__');
        this.$.graphql.setResolverMethod('__ca_resolver__');
        return [];
    },

    async __ca_pulse__() {
        this.$.log && this.$.log.debug('calling PULSE!!!');
        this.state.counter = this.state.counter + 1;
        if (this.state.counter % this.$.props.pulsesBetweenChecks === 0) {
             this.updateWeather();
        }
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async __ca_resolver__() {
        return [null, {
            Query: {
                weatherInfo(obj, args, ctx, info) {
                    return ctx.self.state.weatherInfo;
                }
            }
        }];
    },

    async __ca_handleWeather__(reqId, response) {
        let [error, info] = response;
        if (error) {
            this.$.log && this.$.log.warn(myUtils.errToPrettyStr(error));
        } else {
            if (info && !myUtils.deepEqual(info, this.state.weatherInfo)) {
                this.state.weatherInfo = info;
                await evalQuery(this);
                notifyWebApp(this, 'New weather info.');
            }
        }
        return [];
    },

    // Called by the web app

    async hello(key, tokenStr) {
        this.$.react.setCacheKey(key);
        this.$.iot.registerToken(tokenStr);
        return this.getState();
    },

    async setQuery(query) {
        this.state.query = query;
        this.$.graphql.setQuery(query);
        await evalQuery(this);
        return this.getState();
    },

    async changePinNumber(pin) {
        try {
            const $$ = this.$.sharing.$;
            this.state.pinNumber = pin;
            let res = {};
            res[pin] = {input: false};
            $$.fromCloud.set('meta', res);
            notifyIoT(this, 'Changed pin mode');
            return this.getState();
        } catch (err) {
            return [err];
        }
    },

    async chooseCity(city) {
        this.state.city = city;
        this.updateWeather();
        return this.getState();
    },

    async setWeatherKeyAPI(key) {
        this.state.keyAPI = key;
        this.$.weather.setKeyAPI(key);
        this.updateWeather();
        return this.getState();
    },

    async jitter() {
        if (this.state.weatherInfo.temp) {
            // Don't change humidity !
            let weatherInfo = {
                ...this.state.weatherInfo,
                temp: this.state.weatherInfo.temp + 1,
                wind: this.state.weatherInfo.wind + 1
            };
            // ugly, simulate a weather query response
            await this.__ca_handleWeather__(myUtils.uniqueId(),
                                            [null, weatherInfo]);
        }
        return this.getState();
    },

    async updateWeather() {
        this.state.city && this.$.weather.query(this.state.city);
        return [];
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
