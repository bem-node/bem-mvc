/**
 * trigger debounced
 */
(function ($) {
    var storageExpando = '__' + (Date.now()) + 'eventStorage';
    var ObservableAsync = {

        /**
         * debounce timeout
         * @type {Number}
         */
        OBSERVABLE_TRIGGER_TIMEOUT: 0,

        /**
         * trigger event
         * @param  {String|jQuery.Event} e
         * @param  {*} [data]
         * @return {jQuery.observableAsync}
         */
        trigger: function (e, data) {
            var __base,
                storage = this[storageExpando] || (this[storageExpando] = {}),
                rawType;

            if (typeof e === 'string') {
                rawType = e;
            } else {
                rawType = e.type;
            }

            if (!storage[rawType]) {
                __base = this.__base.bind(this);
                setTimeout(function () {
                    __base.apply(null, storage[rawType]);
                    storage[rawType] = null;
                }, this.OBSERVABLE_TRIGGER_TIMEOUT);
            }

            storage[rawType] = [e, data];

            return this;
        }
    };
    $.observableAsync = $.inherit($.observable, ObservableAsync, ObservableAsync);
}(jQuery));
