# jQuery router plugin

This plugin handles routes for both hash and `pushState()`.

Why? Why another routing plugin? Because I couldn't find one that handles both hash and `pushState()`.

### How to add routes

To add route you simply call the `add()` function, providing it with the actual route string, an optional `id`, and the `callback`.

```js
$.router.add(route, [id], callback);
```
	
Example:

```js
// Adds a route for /items/:item and calls the callback when matched
$.router.add("/items/:item", function(data) {
    console.log(data.item);
});
```

or

```js
// Adds a route for /items/:item and calls the callback when matched, but also has
// a reference to the routes id in $.router.currentId
$.router.add("/items/:item", "foo", function(data) {
    console.log(data.item);
});
```

### How to change URLs and trigger routes

You can also change the current URL to a route, and thereby trigger the route by calling `go()`.

```js
$.router.go(url, title);
```

Example:

```js
// This will change the URL to http://www.foo.com/items/mycoolitem and set the title to
// "My cool item" without reloading the page. If using hashes instead, it will use the URL
// http://www.foo.com/#!items/mycoolitem.
// If a route has been set that matches it, it will be triggered.
$.router.go("/items/mycoolitem", "My cool item");
```
	
### Resetting all routes

If you need to remove all routes (which is good when testing) you just call:

```js
$.router.reset();
```

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
