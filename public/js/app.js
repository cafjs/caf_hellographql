"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var ReactServer = require('react-dom/server');
var AppSession = require('./session/AppSession');
var MyApp = require('./components/MyApp');
var redux = require('redux');
var AppReducer = require('./reducers/AppReducer');
var AppActions = require('./actions/AppActions');

var cE = React.createElement;

var main = exports.main = function(data) {
    var ctx =  {
        store: redux.createStore(AppReducer)
    };

    if (typeof window !== 'undefined') {
        return (async function() {
            try {
                await AppSession.connect(ctx);
                ReactDOM.hydrate(cE(MyApp, {ctx: ctx}),
                                 document.getElementById('content'));
            } catch (err) {
                console.log('Cannot connect:' + err);
            }
        })();
    } else {
        // server side rendering
        AppActions.initServer(ctx, data);
        return ReactServer.renderToString(cE(MyApp, {ctx: ctx}));
    }
};
