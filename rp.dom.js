'use strict';

var rp = rp || {};

rp.dom = class dom 
{
    static elementLocation(el) {
        if (typeof el == 'string') {
            el = document.getElementById(el);
        }

        if (!el) {
            throw new Error('Element not found.');
        }

        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset ||
                     document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset ||
                    document.documentElement.scrollTop;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }

    static clearElementChildren(parent) {
        let el;
        if (typeof parent == 'string') {
            el = document.getElementById(parent);
        }
        else {
            el = parent;
        }

        if (!el) {
            throw new Error('Element not found.');
        }
        
        let range = document.createRange();
        range.selectNodeContents(el);
        range.deleteContents();
    };

    static setObjectDefaultValue(obj, key, value) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    }

    static removeElement(el) {
        if (typeof el === 'string') {
            el = document.getElementById(el);
        }

        if (!el) {
            throw new Error('el value wasn\'t found in removeElement.');
        }
    
        el.parentElement.removeChild(el);
    }
}
