var AppConstants = require('../constants/AppConstants');

var AppReducer = function(state, action) {
    if (typeof state === 'undefined') {
        return  {
            isClosed: false, fullName: '',
            query: '', queryChoices : [], queryResult: '',
            error: null,
            localCity: '', localKeyAPI: '', localPinNumber: '',
            city: '', keyAPI: '', pinNumber: '', weatherInfo: {}
        };
    } else {
        switch(action.type) {
        case AppConstants.APP_UPDATE:
        case AppConstants.APP_NOTIFICATION:
            return Object.assign({}, state, action.state);
        case AppConstants.APP_ERROR:
            return Object.assign({}, state, {error: action.error});
        case AppConstants.WS_STATUS:
            return Object.assign({}, state, {isClosed: action.isClosed});
        default:
            return state;
        }
    };
};

module.exports = AppReducer;
