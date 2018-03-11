'use strict';

let stateListOptions = {
    itemInputId: 'state',        
    url: 'json/short-states.json?search=',
    textField: 'name',
    valueField: 'value',
    size: 6,
    display: 'text',  
    divClass: 'autocompleter',

    onChange: function(value) {
        console.log(`on change; value is ${value}`);
    },
    onBlur: function(sel) {
        console.log(`on blur; value is ${sel.value}, text is ${sel.text}`);
    }
}

let stateList = new rp.AutoComplete(stateListOptions);

document.getElementById('cascadeTest').addEventListener('blur', function(e) {
    stateList.getList(stateList.getOptions(), 'd');    
});

document.getElementById('testbutton').addEventListener('click', function(e) {
    //stateList.getList(null, 'd');    
});