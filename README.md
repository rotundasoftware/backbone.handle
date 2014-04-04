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
		Backbone.Handle.add( this ); // Add backbone.handle functionality to this view.
	},

	_okButton_onClick : function() {
		console.log( this.ui.inputFld.val() ); // after render, elements are available in this.ui
	},

	...
} );
```

## Notes

Inspired directly by the `ui` hash in Derick Baily's Backbone.Marionette. You may use this mixin in conjunction with Backbone.Marionette, and enjoy the extra bells and whistles.

If you use Backbone.Courier in conjunction with this mixin, handles in Courier's `spawnMessages` hash will also be resolved.