"use strict";

var rp = rp || {};

rp.ajax = {}

rp.ajax.HTTPRequest = class HTTPRequest {
    constructor() {
    }

    submit(options) {
        let fn = null;
        let startTime = performance.now();
        if (options.hasOwnProperty('action')) {
            fn = options.action;
            delete options.action;
        }
        fetch(options.url, options)
        .then(this.checkHTTPStatus)
        .then((response) => {
            if (options.dataType === 'json') return response.json();
            if (options.dataType === 'text') return response.text();
            if (options.dataType === 'formData') return response.formData();
            if (options.dataType === 'arrayBuffer') return response.arrayBuffer();
        })
        .then(data => {
            if (typeof fn === 'function') {
                data.__startTime = startTime;
                if (options.hasOwnProperty('context')) {
                    fn.call(options.context, data)
                }
                else {
                    fn(data);
                }
            }
        })
        .catch((error) => {
            console.log('There was an HTTP fetch error', error);
        });
    };

    checkHTTPStatus(response) {
        if (response.ok) {
            return response;
        }
        let error = new Error(response.statusText);
        error.response = response;
        return Promise.reject(error);
    };
}
