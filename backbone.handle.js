var delegateEventSplitter = /^(\S+)\s*(.*)$/;

/*
 * Backbone.Alias, v0.1
 * Copyright (c)2014 Rotunda Software, LLC.
 * Parts adapted from Backbone.Marionette, Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.handle
 */

( function( root, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define([ 'backbone', 'underscore' ], factory );
	} else if (typeof exports === 'object') {
		// Node
		module.exports = factory( require( 'backbone' ), require( 'underscore' ) );
	} else {
		// Browser globals
		root.returnExports = factory( root.Backbone, root._ );
	}
} ( this, function( Backbone, _ ) {
	Backbone.Handle = {};

	Backbone.Handle.add = function( view ) {
		var overriddenViewMethods = {
			render: view.render,
			delegateEvents : view.delegateEvents
		};

		view.render = function() {
			var _this = this;
			var args = Array.prototype.slice.call( arguments );

			var returnValue = overriddenViewMethods.render.apply( this, args );

			if( this.ui ) {
				if( ! this.uiBindings ) {
					// We want to store the ui hash in uiBindings, since afterwards the values 
					// in the ui hash will be overridden with jQuery selectors.
					this.uiBindings = _.result( this, "ui" );
				}

				// refreshing the associated selectors since they should point to the newly rendered elements.
				this.ui = {};
				_.each( _.keys( this.uiBindings ), function( key ) {
					var selector = _this.uiBindings[ key ];

					// if the selector ends with "!", we assert that there is exactly one DOM element that matches
					// the selector. That is, we through an error if the number of matches elements != 1.
					var assertOneAndOnlyOne = selector[ selector.length - 1 ] === "!";
					if( assertOneAndOnlyOne ) selector = selector.slice( 0, selector.length - 1 );
					_this.ui[ key ] = _this.$( selector );
					if( assertOneAndOnlyOne ) {
						if( _this.ui[ key ].length !== 1 )
							throw new Error( "Expected selector \"" + selector + "\" to match 1 element, but " + _this.ui[ key ].length + " found." );
						_this.uiBindings[ key ] = selector;
					}
				} );
			}

			return returnValue;
		};

		view.delegateEvents = function( events ) {
			var _this = this;

			if( _.isFunction( this.events ) ) this.events = this.events.call( this.events );
			events = events || _.clone( this.events ) || {};

			events = this._exapandUIHandlesInHash.call( this, events );

			return overriddenViewMethods.delegateEvents.call( this, events );
		};

		view._exapandUIHandlesInHash = function( events ) {
			var newEvents = {};

			var uiBindings = this.uiBindings || _.result( this, "ui" );
			if( ! uiBindings ) { return events; }

			_.each( events, function( value, key ) {
				var match = key.match( delegateEventSplitter );
				var eventName = match[ 1 ], uiElName = match[ 2 ];

				if( uiElName !== "" && ! _.isUndefined( uiBindings[ uiElName ] ) ) {
					var selector = uiBindings[ uiElName ];
					if( selector[ selector.length - 1 ] === "!" )
					selector = selector.slice( 0, selector.length - 1 );

					key = eventName + " " + selector;
				}

				newEvents[ key ] = value;
			} );

			return newEvents;
		};
	};

	return Backbone.Handle;

} ) );
