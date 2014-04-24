# Backbone.Handle

Put down your jquery selectors and get a handle on your views' DOM elements.

Create reusable handles to represent particular DOM elements in your views.

## Example

```javascript
MyView = Backbone.View.extend( {
	ui : {
		"inputFld" : "input[type='text']",
		"okButton" : "button.ok!" // assert there is exactly one button in this view with class "ok"
	},

	events : {
		"click okButton" : "_okButton_onClick" // you can use handles here to avoid redundant selectors
	},

	initialize : function() {
		Backbone.Handle.add( this ); // dd backbone.handle functionality to this view.
	},

	render : function() {
		this.resolveHandles(); // resolve the selectors in the ui hash to actual jquery objects 
	},

	_okButton_onClick : function() {
		console.log( this.ui.inputFld.val() ); // after resolveHandles() is called, elements are available in this.ui
	},

	...
} );
```

## Notes

Inspired directly by the `ui` hash in Derick Baily's Backbone.Marionette. You may use this mixin in conjunction with Backbone.Marionette, and enjoy the extra `!` selector modifier to asset that there is exactly one element.