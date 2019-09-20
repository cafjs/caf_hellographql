var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

class Manage extends React.Component {

     constructor(props) {
         super(props);
         this.handleName = this.handleName.bind(this);
         this.handleKeyAPI = this.handleKeyAPI.bind(this);
         this.handlePin = this.handlePin.bind(this);
         this.doCity = this.doCity.bind(this);
         this.doKeyAPI = this.doKeyAPI.bind(this);
         this.doPin = this.doPin.bind(this);
         this.doJitter = this.doJitter.bind(this);
         this.doDelete = this.doDelete.bind(this);
     }

    handleName(e) {
        AppActions.setLocalState(this.props.ctx, {localCity: e.target.value});
     }

    handleKeyAPI(e) {
        AppActions.setLocalState(this.props.ctx, {localKeyAPI: e.target.value});
    }

    handlePin(e) {
        AppActions.setLocalState(this.props.ctx,
                                 {localPinNumber: e.target.value});
    }

    doCity() {
        if (!this.props.city) {
            let err = new Error('Missing city');
            AppActions.setError(this.props.ctx, err);
        } else {
            AppActions.chooseCity(this.props.ctx, this.props.city);
        }
    }

    doDelete() {
        AppActions.chooseCity(this.props.ctx, '');
        AppActions.setLocalState(this.props.ctx, {localCity: ''});
    }

    doKeyAPI() {
        if (!this.props.keyAPI) {
            let err = new Error('Missing key');
            AppActions.setError(this.props.ctx, err);
        } else {
            AppActions.setWeatherKeyAPI(this.props.ctx, this.props.keyAPI);
        }
    }

    doPin() {
        let pinNumber = parseInt(this.props.pinNumber);
        if (isNaN(pinNumber)) {
            let err = new Error('Pin is not a number');
            AppActions.setError(this.props.ctx, err);
        } else {
            AppActions.changePinNumber(this.props.ctx, pinNumber);
        }
    }

    doJitter() {
        AppActions.jitter(this.props.ctx);
    }

    render() {
        let keyPlaceholder = (this.props.defaultKeyAPI ? 'API Key OK' : '');
        let pinPlaceholder = (typeof this.props.defaultPinNumber === 'number' ?
                              '' + this.props.defaultPinNumber : '');
        let cityPlaceholder = this.props.defaultCity || '';
        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {
                      controlId: 'cityId'
                  },
                     cE(rB.Col, {sm:2, xs: 4},
                        cE(rB.ControlLabel, null, 'City')
                       ),
                     cE(rB.Col, {sm:6, xs: 8},
                        cE(rB.FormControl, {
                            type: 'text',
                            value: this.props.city,
                            placeholder: cityPlaceholder,
                            onChange: this.handleName
                        })
                       ),
                     cE(rB.Col, {sm:4, xs: 8},
                        cE(rB.ButtonGroup, null,
                           cE(rB.Button, {
                               bsStyle: 'primary',
                               onClick: this.doCity
                           }, "Update"),
                           cE(rB.Button, {
                               bsStyle: 'danger',
                               onClick: this.doJitter
                           }, "Jitter"),
                            cE(rB.Button, {
                               bsStyle: 'danger',
                               onClick: this.doDelete
                           }, "Delete")
                          )
                       )
                    ),
                  cE(rB.FormGroup, {
                      controlId: 'keyId'
                  },
                     cE(rB.Col, {sm:2, xs: 4},
                        cE(rB.ControlLabel, null, 'API Key')
                       ),
                     cE(rB.Col, {sm:6, xs: 8},
                        cE(rB.FormControl, {
                            type: 'password',
                            value: this.props.keyAPI,
                            placeholder: keyPlaceholder,
                            onChange: this.handleKeyAPI
                        })
                       ),
                     cE(rB.Col, {sm:4, xs: 8},
                        cE(rB.Button, {
                            bsStyle: 'primary',
                            onClick: this.doKeyAPI
                        }, "Register")
                       )
                    ),
                  cE(rB.FormGroup, {
                      controlId: 'pinId'
                  },
                     cE(rB.Col, {sm:2, xs: 4},
                        cE(rB.ControlLabel, null, 'LED Pin#')
                       ),
                     cE(rB.Col, {sm:6, xs: 8},
                        cE(rB.FormControl, {
                            type: 'text',
                            value: this.props.pinNumber,
                            placeholder: pinPlaceholder,
                            onChange: this.handlePin
                        })
                       ),
                     cE(rB.Col, {sm:4, xs: 8},
                        cE(rB.Button, {
                            bsStyle: 'primary',
                            onClick: this.doPin
                        }, "New Pin")
                       )
                    )
                 );

    }
};

module.exports = Manage;
