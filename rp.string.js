'use strict';

var rp = rp || {};

rp.string = rp.string || {};

rp.string.StringBuilder = class StringBuilder 
{
    constructor() {
        this.buffer = [];
    }

    append(str) {
        this.buffer.push(str);
    }

    clear() {
        this.buffer = [];
    }

    toString(delimiter = '') {
        return this.buffer.join(delimiter);
    }
}