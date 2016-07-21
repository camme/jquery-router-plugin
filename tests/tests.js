/*

    plugin name: router
    jquery plugin to handle routes with both hash and push state
    why? why another routing plugin? because i couldnt find one that handles both hash and pushstate
    created by 24hr // camilo.tapia
    author twitter: camilo.tapia

    Copyright 2011  camilo tapia // 24hr (email : camilo.tapia@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/

QUnit.config.requireExpects = true;
QUnit.config.testTimeout = 1000;

$(window).on('unload', function() {
	if (window.jscoverage_report) {
		jscoverage_report();
	}
});

QUnit.test("simple routing", function(assert) {
	var done = assert.async();
	assert.expect(1);
	$.router.add('/', function() {
		assert.ok(true, "root route invoked");
		done();
	});
	$.router.go('/', 'Home');
});

QUnit.test("simple routing with parameter", function(assert) {
	var done = assert.async();
	assert.expect(2);
	$.router.add('/v/show/:id', function(data) {
		assert.strictEqual(data.id, "42", "url argument parsed");
		assert.strictEqual($.router.currentParameters, data, "parameters available in $.router.currentParameters");
		done();
	});
	$.router.go('/v/show/42/', 'Item 42');
});

QUnit.test("regex routing with parameter", function(assert) {
	var done = assert.async();
	assert.expect(4);
	$.router.add(/\/v\/show\/(\d{4})\/([abc])_(\d)/, function(data) {
		assert.strictEqual(data.matches.length, 4, "regex argument result passed");
		assert.strictEqual(data.matches[1], "1337", "first capture");
		assert.strictEqual(data.matches[2], "b", "second capture");
		assert.strictEqual(data.matches[3], "9", "third capture");
		done();
	});
	$.router.go('/v/show/1337/b_9', 'Regexp URL test');
});

QUnit.test("route with id", function(assert) {
	var done = assert.async();
	assert.expect(3);
	$.router.add('/v/config', 'configPage', function(data) {
		assert.strictEqual(this.id, 'configPage', 'id of the route available');
		assert.strictEqual($.router.currentId, 'configPage', 'id of the route available in the $.router.currentId property');
		var p = $.router.parameters();
		assert.strictEqual($.isEmptyObject(p), true, "manually parsed parameters are empty");
		done();
	});
	$.router.go('/v/config', 'Configuration');
});

QUnit.test("routing call initiated through history.back", function(assert) {
	var index = 0, done = [assert.async(), assert.async(), assert.async()];
	assert.expect(3);
	$.router.add('/v/history/:id', function(data) {
		assert.strictEqual(data.id, "" + (index % 2), "url argument parsed");
		done[index]();
		++index;
		if (index < 2) {
			$.router.go('/v/history/' + index, 'History ' + index);
		}
		else {
			history.go(-1);
		}
	});
	$.router.go('/v/history/0', 'History 0');
});

QUnit.test("$.router.reset", function(assert) {
	var done = assert.async(), th, fn, routeCleared = true;
	assert.expect(1);
	$.router.add('/v/reset', function(data) {
		routeCleared = false;
	});
	fn = function() {
		assert.strictEqual(routeCleared, true, '$.router.reset cleared routes');
		done();
	};
	th = window.setTimeout(fn, 50);
	$.router.reset();
	$.router.go('/v/reset', 'reset');
});

QUnit.test("manual parameter parsing", function(assert) {
	var done = assert.async();
	assert.expect(6);
	$.router.add('/v/parameters/:category/:tag/', function(data) {
		var p = $.router.parameters();
		assert.strictEqual($.router.currentParameters, p, "$.router.currentParameters points to the same object");
		assert.strictEqual(p.category, "television", "manually parsed parameters (first)");
		assert.strictEqual(p.tag, "led", "manually parsed parameters (second)");
		var p2 = $.router.parameters('/v/parameters/printers/laser');
		assert.strictEqual(p2.category, "printers", "custom url manually parsed parameters (first)");
		assert.strictEqual(p2.tag, "laser", "custom url manually parsed parameters (second)");
		var p3 = $.router.parameters('/v/nowhere/42/1337/pi');
		assert.strictEqual($.isEmptyObject(p3), true, "nonexistent URL has no parameters");
		done();
	});
	$.router.go('/v/parameters/television/led', 'LED TVs');
});

QUnit.test("routes must match with all parts", function(assert) {
	var done = assert.async(), fn;
	assert.expect(1);
	fn = function(data) {
		assert.strictEqual(this.id, "categoryAndTag", "category and tag present, thus the route with both must match");
		done();
	};
	$.router.add('/v/parts/:category', 'categoryOnly', fn);
	$.router.add('/v/parts/:category/:tag', 'categoryAndTag', fn);
	$.router.go('/v/parts/phones/android', 'equal length route should match');
});

QUnit.test("routes must match with all parts (registration order should not affect result)", function(assert) {
	var done = assert.async(), fn;
	assert.expect(1);
	fn = function(data) {
		assert.strictEqual(this.id, "categoryAndTag", "category and tag present, thus the route with both must match");
		done();
	};
	$.router.add('/v/parts2/:category', 'categoryOnly', fn);
	$.router.add('/v/parts2/:category/:tag', 'categoryAndTag', fn);
	$.router.go('/v/parts2/phones/android', 'equal length route should match');
});

QUnit.test("$.router.check", function(assert) {
	var done = assert.async();
	assert.expect(1);
	$.router.add('/v/checked', function() {
		assert.ok(true, "route for checked url invoked");
		done();
	});
	history.pushState({}, 'Checked URL', '/v/checked');
	$.router.check();
});

