# jquery router plugin
This plugin handles routes for both hash and push state.

Why? Why another routing plugin? Because i couldn't find one that handles both hash and pushstate.

### How to add routes

To add route you simply call the add function, providing it with the actual route string, an optional id, and the callback. 

$.router.add(*route*, *[id]*, *callback*);
	
Example:

	// Adds a route for /items/:item and calls the callback when matched
	$.router.add('/items/:item', function(data) {
		console.log(data.item);
	});

or

	// Adds a route for /items/:item and calls the callback when matched, but also has
	// a reference to the routes id in $.router.currentId
	$.router.add('/items/:item', 'foo', function(data) {
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
	$.router.go('/items/mycoolitem', 'My cool item');
	
### Reseting all routes

If you need to remove all routes (which is good when testing) you just call:

$.router.reset();

## License 

(The MIT License)

Copyright (c) 2011 Camilo Tapia &lt;camilo.tapia@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
