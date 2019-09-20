'use strict';

var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

const ALL_FIELDS = ['city', 'temp', 'humidity', 'wind'];

const PREFIX = `
query {
  weatherInfo {
`;

const SUFFIX = `

  }
}
`;

class Queries extends React.Component {
    constructor(props) {
        super(props);
        this.handleQueryChoices = this.handleQueryChoices.bind(this);
        this.doUpdateQuery = this.doUpdateQuery.bind(this);
    }

    handleQueryChoices(e) {
        AppActions.setLocalState(this.props.ctx, {queryChoices: e});
    }

    doUpdateQuery() {
        if (Array.isArray(this.props.queryChoices) &&
            (this.props.queryChoices.length > 0)) {
            let choices = this.props.queryChoices.map(x => ALL_FIELDS[x]);
            let res = PREFIX + choices.join(' \n') + SUFFIX;
            AppActions.setQuery(this.props.ctx, res);
        } else {
            let err = new Error('Invalid query options');
            AppActions.setError(this.props.ctx, err);
        }
    }

    render() {
        return  cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {
                      controlId: 'queryId'
                  },
                     cE(rB.Col, {sm:2, xs: 4},
                        cE(rB.ControlLabel, null, 'Choose')
                       ),
                     cE(rB.Col, {sm:6, xs: 8},
                        cE(rB.ToggleButtonGroup, {
                            type: 'checkbox',
                            value: this.props.queryChoices,
                            onChange: this.handleQueryChoices
                        },
                           cE(rB.ToggleButton, {value: 0}, 'City'),
                           cE(rB.ToggleButton, {value: 1}, 'Temp'),
                           cE(rB.ToggleButton, {value: 2}, 'Humidity'),
                           cE(rB.ToggleButton, {value: 3}, 'Wind')
                          )
                       ),
                     cE(rB.Col, {sm:4, xs: 8},
                        cE(rB.Button, {
                            bsStyle: 'danger',
                            onClick: this.doUpdateQuery
                        }, "Update")
                       )
                    ),
                   cE(rB.FormGroup, {
                       controlId: 'currentId'
                   },
                      cE(rB.Col, {sm:2, xs: 4},
                         cE(rB.ControlLabel, null, 'Current Query')
                        ),
                      cE(rB.Col, {sm:8, xs: 8},
                         cE(rB.FormControl, {
                             type: 'text',
                             readOnly: true,
                             value: this.props.query
                         })
                        )
                     ),
                   cE(rB.FormGroup, {
                       controlId: 'resultId'
                   },
                      cE(rB.Col, {sm:2, xs: 4},
                         cE(rB.ControlLabel, null, 'Results')
                        ),
                      cE(rB.Col, {sm:8, xs: 8},
                         cE(rB.FormControl, {
                             type: 'text',
                             readOnly: true,
                             value: this.props.queryResult
                         })
                        )
                     )
                  );
    }
}

module.exports = Queries;
