var Treeview = function () {
    'use strict';

    var _privateProperty = 'Hello World';

    function _privateMethod() {
        console.log(_privateProperty);
    }

    function publicMethod() {
        _privateMethod();
    }

    return {
        publicMethod: publicMethod
    };
};
