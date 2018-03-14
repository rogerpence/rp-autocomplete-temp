'use strict';

let stateListOptionsAdvanced = {
    itemInputId: 'state',        
    url: 'states?startswith=',
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

let stateListOptions = {
    itemInputId: 'state',        
    url: 'api/states?startswith=',
    size: 16,
    onItemListBlur: function(text, value) {
        let selectedValue = document.getElementById('state').getAttribute('data-value');   
        cityList.getList(selectedValue);
        document.getElementById('city').focus();        
    },
    onItemListChange: function(value) {
        console.log(`on change; value is ${value}`);
    },    
    onItemFocus: function() {
        console.log('states textbox focused');
    }
}

let stateList = new rp.AutoComplete(stateListOptions);

let cityListOptions = {
    itemInputId: 'city',        
    url: 'api/cities?state=',
    size: 16,
    onItemListBlur: function(sel) {
        console.log(sel);
        document.getElementById('rate').focus();
    },
    onItemFocus: function() {
        console.log('cities textbox focused');
        document.getElementById('state').focus();
        
    }
    
}

let cityList = new rp.AutoComplete(cityListOptions);


// document.getElementById('cascadeTest').addEventListener('blur', function(e) {
//     stateList.getList(stateList.getOptions(), 'd');    
// });

// document.getElementById('testbutton').addEventListener('click', function(e) {
//     //stateList.getList(null, 'd');    
// });