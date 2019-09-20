'use strict';

var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;

class Cities extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var self = this;
        var renderOneRow = function() {
            const i = 72727;
            let {city = '', temp = '',  humidity = '', wind = ''} =
                    self.props.weatherInfo || {};
            temp = (typeof temp === 'number' ? temp.toFixed(2) : temp);
            wind = (typeof wind === 'number' ? wind.toFixed(2) : wind);
            return  cE('tr', {key:10*i},
                       cE('td', {key:10*i+1}, city),
                       cE('td', {key:10*i+4}, temp),
                       cE('td', {key:10*i+5}, humidity),
                       cE('td', {key:10*i+6}, wind)
                      );
        };

        return cE(rB.Table, {striped: true, responsive: true, bordered: true,
                             condensed: true, hover: true},
                  cE('thead', {key:0},
                     cE('tr', {key:1},
                        cE('th', {key:2}, 'City'),
                        cE('th', {key:5}, 'Temp (F)'),
                        cE('th', {key:6}, 'Humidity (%)'),
                        cE('th', {key:7}, 'Wind (mph)')
                       )
                    ),
                  cE('tbody', {key:8}, renderOneRow())
                 );
    }
}

module.exports = Cities;
