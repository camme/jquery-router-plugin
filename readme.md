# jquery router plugin
This plugin handles routes for both hash and push state.

Why? Why another routing plugin? Because i couldn't find one that handles both hash and pushstate.

### How to add routes

To add route you simply call the add function, providing it with the actual route string, an optional id, and the callback. 

$.router.add(*route*, *[id]*, *callback*);
	
Example:

	// Adds a route for /items/:item and calls the callback when matched
	$.router.add(/items/:item", function(data) {
		console.log(data.item);
	});

or

	// Adds a route for /items/:item and calls the callback when matched, but also has
	// a reference to the routes id in $.router.currentId
	$.router.add(/items/:item", "foo", function(data) {
		console.log(data.item);
	});

### How to change urls and trigger routes
You can also change the current url to a route, and thereby triggering the route by calling *go*.

$.router.go(url, title);

Example:
	
	// This will change the url to http://www.foo.com/items/mycoolitem and set the title to
	// "My cool item" without reloading the page. If using hashes instead, it will use the url
	// http://www.foo.com/#!items/mycoolitem.
	// If a route has been set that matches it, it will be triggered.
	$.router.go("/items/mycoolitem", "My cool item");
	
### Reseting all routes

If you need to remove all routes (which is good when testing) you just call:

$.router.reset();