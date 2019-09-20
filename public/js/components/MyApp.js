"use strict";

var React = require('react');
var rB = require('react-bootstrap');
var AppStatus = require('./AppStatus');
var DisplayError = require('./DisplayError');
var Cities = require('./Cities');
var Manage = require('./Manage');
var Queries = require('./Queries');

var cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, "Weather GraphQL"),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Manage")
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Manage, {
                                  ctx: this.props.ctx,
                                  city: this.state.localCity,
                                  defaultCity: this.state.city,
                                  keyAPI: this.state.localKeyAPI,
                                  defaultKeyAPI: this.state.keyAPI,
                                  pinNumber: this.state.localPinNumber,
                                  defaultPinNumber: this.state.pinNumber
                              }))),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Cities")
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Cities, {
                                  ctx: this.props.ctx,
                                  weatherInfo: this.state.city &&
                                      this.state.weatherInfo
                              }))),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Query")
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Queries, {
                                  ctx: this.props.ctx,
                                  queryChoices: this.state.queryChoices,
                                  query: this.state.query,
                                  queryResult: this.state.queryResult
                              }))
                          )
                       )
                    )
                 );
    }
};

module.exports = MyApp;
