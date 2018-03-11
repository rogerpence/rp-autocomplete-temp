'use strict';

var rp = rp || {};

rp.AutoComplete = class AutoComplete 
{
    constructor(options) 
    {
        rp.dom.setObjectDefaultValue(options, 'size', 12);
        rp.dom.setObjectDefaultValue(options, 'wait', 300);
        rp.dom.setObjectDefaultValue(options, 'display', 'text');
        rp.dom.setObjectDefaultValue(options, 'textField', 'text');
        rp.dom.setObjectDefaultValue(options, 'valueField', 'value');
        rp.dom.setObjectDefaultValue(options, 'selectClass', '');
        rp.dom.setObjectDefaultValue(options, 'divClass', '');

        options.selectId = options.itemInputId + '_select';

        this.options = options;
        this.options.ajaxAction = this.showList;

        let selectTag = document.getElementById(this.options.selectId)
        if (!selectTag) {
            let sb = new rp.string.StringBuilder();
            sb.append(`<div class="${options.divClass}">`);            
            sb.append(`<select class="${options.selectClass}"`);
            sb.append(' style="position:absolute;display:none;"');
            sb.append(` data-input="${options.itemInputId}"`);
            sb.append(` id="${options.selectId}" size="${options.size}" />`);
            sb.append('</div');
            document.body.insertAdjacentHTML('afterbegin', sb.toString());
        }

        this.itemInput = document.getElementById(options.itemInputId);
        this.itemInput.setAttribute('data-value', '');

        this.itemList = document.getElementById(options.selectId);
        this.timer = null;
        this.value = null;
        this.handlers = {}

        this.assignEventhandlers();
    }

    showList(json) 
    {
        let list = [];

        let getOptionHTML = function (text, value) {
            return `<option data-value="${value}">${text}</option>`;
        }

        let textField = this.options.textField;
        let valueField = this.options.valueField;
        
        for (var i = 0; i < json.length; i++) {
            list.push(getOptionHTML(json[i][textField], json[i][valueField]));
        }

        rp.dom.clearElementChildren(this.itemList);
        this.itemList.insertAdjacentHTML('afterbegin', list.join(''));

        let inputElementLocation = rp.dom.elementLocation(this.itemInput);

        this.itemList.style.left = inputElementLocation.left + 'px';
        this.itemList.style.top = inputElementLocation.top +
                                     inputElementLocation.height + 'px';
        this.itemList.style.width = inputElementLocation.width + 'px';
        this.itemList.style.display = 'inline';
        this.itemList.selectedIndex = 0;
        this.itemList.focus();
    }

    getList(searchValue) 
    {
        let opts = {
            url: this.options.url + searchValue,
            method: 'GET',
            headers: new Headers({
                'content-type': 'application/json',
                'x-requested-with': 'XMLHttpRequest'
            }),
            credentials: 'same-origin',
            dataType: 'json',
            action: this.options.ajaxAction,
            context: this
        };

        let httpReq = new rp.ajax.HTTPRequest();
        httpReq.submit(opts);
    }

    destroy() 
    {        
        this.itemInput.removeEventListener('keyup', this.handlers.onItemKeyUp);
        this.itemList.removeEventListener('click', this.handlers.onItemListClick);
        this.itemList.removeEventListener('change', this.handlers.onItemListChange);
        this.itemList.removeEventListener('keyup', this.handlers.onItemListKeyUp);
        this.itemList.removeEventListener('blur', this.handlers.onItemListBlur);

        rp.dom.removeElement(this.itemList);         
    }

    assignEventhandlers() 
    {
        let that = this;

        let getSelectedItem = function (el) {
            let inputItemId = el.getAttribute('data-input');
            let inputElement = document.getElementById(inputItemId);
            let index = el.selectedIndex;
            let opt = el.options[index];
            let value = opt.dataset.value;
            let text = opt.value;

            return {
                inputElement: inputElement,
                text: text,
                value: value
            }
        };

        this.handlers.onItemKeyUp = function(e) 
        {
            const TAB_KEY = 9;

            if (e.keyCode == TAB_KEY && e.target.value == '') {
                return;
            }

            if (this.timer) {
                clearInterval(this.timer);
            }

            this.timer = setTimeout(function () {
                that.getList(e.target.value);
            }, that.options.wait)
        };

        this.handlers.onItemListClick = function(e) 
        {
            e.currentTarget.style.display = 'none';
        };

        this.handlers.onItemListChange = function(e) 
        {
            let sel = getSelectedItem(e.target);

            if (typeof that.options.onDisplay == 'function') {
                sel.inputElement.value = 
                    that.options.onDisplay(sel.text, sel.value);
            }
            else {
                if (that.options.display == 'text') {
                    sel.inputElement.value = sel.text;
                }
                else {
                    sel.inputElement.value = sel.value;
                }
            }                
            sel.inputElement.setAttribute('data-value', sel.value);
            if (typeof that.options.onChange === 'function') {
                that.options.onChange(sel.value);
            }
        };

        this.handlers.onItemListKeyUp = function(e) 
        {
            const ESCAPE_KEY = 27;
            const BACKSPACE = 8;
            let sel = getSelectedItem(e.target);
            
            if (e.keyCode == ESCAPE_KEY) {
                e.target.style.display = 'none';
                sel.inputElement.value = '';
                sel.inputElement.focus();
            }
            if (e.keyCode == BACKSPACE) {
                // Todo: The intent was to allow the user to 
                // backspace into the search value to remove 
                // characters from the right.
                // Alas, this doesn't work. :( I need to think
                // about this a little.
                //let len = sel.inputElement.value.length;
                //sel.inputElement.value = sel.inputElement.value.substring(0, len - 1);                                 
            }                    
        };

        this.handlers.onItemListBlur = function(e) 
        {
            e.target.style.display = 'none';
            if (typeof that.options.onBlur === 'function') {
                let sel = getSelectedItem(e.target);
                that.options.onBlur(sel);
            }            
        };
        
        // 'keyup' event on search input element.            
        this.itemInput.addEventListener('keyup', this.handlers.onItemKeyUp);

        // Click event on list presented. 
        // 'change' has already fired and set the selected 
        // value so just make the list go away. 
        this.itemList.addEventListener('click', this.handlers.onItemListClick);

        // 'change' event on list presented. 
        // governs what's displayed in search input element
        // and optionally calls custom onChange event.
        this.itemList.addEventListener('change', this.handlers.onItemListChange);

        // 'keyup' event on list presented. 
        // Governs behavior when escape or backspace is pressed
        // when list is presented. This is probably desktop-only 
        // behavior.                    
        this.itemList.addEventListener('keyup', this.handlers.onItemListKeyUp);

        // 'blur' event on list presented.
        // Governs behavior when list presented loses focus.
        this.itemList.addEventListener('blur', this.handlers.onItemListBlur);
    }
}