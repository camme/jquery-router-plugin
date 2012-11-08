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
 

(function($){
    
    var hasPushState = (history && history.pushState);    
    var hasHashState = !hasPushState && ("onhashchange" in window) && false;
    var router = {};
    var routeList = [];
    var eventAdded = false;
    var currentUsedUrl = location.href; //used for ie to hold the current url
    var firstRoute = true;
    
    // hold the latest route that was activated
    router.currentId = "";
    router.currentParameters = {};
    
    router.capabilities = {
        hash: hasHashState,
        pushState: hasPushState,
        timer: !hasHashState && !hasPushState
    };
    
    // reset all routes
    router.reset = function()
    {
        var router = {};
        var routeList = [];
        router.currentId = "";
        router.currentParameters = {};
    }
 
    router.add = function(route, id, callback)
    {
        // if we only get a route and a callback, we switch the arguments
        if (typeof id == "function")
        {
            callback = id;
            delete id;
        }
        
        var isRegExp = typeof route == "object";
        
        if (!isRegExp)
        {
            
            // remove the last slash to unifiy all routes
            if (route.lastIndexOf("/") == route.length - 1)
            {
                route = route.substring(0, route.length - 1);
            }
            
            // if the routes where created with an absolute url ,we have to remove the absolut part anyway, since we cant change that much
            route = route.replace(location.protocol + "//", "").replace(location.hostname, "");
        }

        var routeItem = {
            route: route,
            callback: callback,
            type: isRegExp ? "regexp" : "string",
            id: id
        }

        routeList.push(routeItem);
        
        // we add the event listener after the first route is added so that we dont need to listen to events in vain
        if (!eventAdded)
        {
            bindStateEvents();
        }
    };
    
    function bindStateEvents()
    {
        eventAdded = true;
        
        // default value telling router that we havent replaced the url from a hash. yet.
        router.fromHash = false;

        
        if (hasPushState)
        {
            // if we get a request with a qualified hash (ie it begins with #!)
            if (location.hash.indexOf("#!/") === 0)
            {
                // replace the state
                var url = location.pathname + location.hash.replace(/^#!\//gi, "");
                history.replaceState({}, "", url);
                
                // this flag tells router that the url was converted from hash to popstate
                router.fromHash = true;
            }
            
            $(window).bind("popstate", handleRoutes);
        }
        else if (hasHashState)
        {
            $(window).bind("hashchange.router", handleRoutes);
        }
        else
        {
            // if no events are available we use a timer to check periodically for changes in the url
            setInterval(
                function()
                {
                    if (location.href != currentUsedUrl)
                    {
                        handleRoutes();
                        currentUsedUrl = location.href;
                    }
                }, 500
            );
        }
       
    }
    
    bindStateEvents();
    
    router.go = function(url, title)
    {   
        if (hasPushState)
        {
            history.pushState({}, title, url);
            checkRoutes();
        }
        else
        {
            // remove part of url that we dont use
            url = url.replace(location.protocol + "//", "").replace(location.hostname, "");
            var hash = url.replace(location.pathname, "");
            
            if (hash.indexOf("!") < 0)
            {
                hash = "!/" + hash;
            }
            location.hash = hash;
        }
    };
    
    // do a check without affecting the history
    router.check = router.redo = function()
    {   
        checkRoutes(true);
    };
    
    // parse and wash the url to process
    function parseUrl(url)
    {
        var currentUrl = url ? url : location.pathname;
        
        currentUrl = decodeURI(currentUrl);
        
        // if no pushstate is availabe we have to use the hash
        if (!hasPushState)
        {   
            if (location.hash.indexOf("#!/") === 0)
            {
                currentUrl += location.hash.substring(3);
            }
            else
            {
                return '';
            }
        }
        
        // and if the last character is a slash, we just remove it
        currentUrl = currentUrl.replace(/\/$/, "");

        return currentUrl;
    }
    
    // get the current parameters for either a specified url or the current one if parameters is ommited
    router.parameters = function(url)
    {
        // parse the url so that we handle a unified url
        var currentUrl = parseUrl(url);
        
        // get the list of actions for the current url
        var list = getParameters(currentUrl);
        
        // if the list is empty, return an empty object
        if (list.length == 0)
        {
            router.currentParameters = {};
        }
        
        // if we got results, return the first one. at least for now
        else 
        {
            router.currentParameters = list[0].data;
        }
        
        return router.currentParameters;
    }
    
    function getParameters(url)
    {

        var dataList = [];
        
       // console.log("ROUTES:");

        for(var i = 0, ii = routeList.length; i < ii; i++)
        {
            var route = routeList[i];
            
            // check for mathing reg exp
            if (route.type == "regexp")
            {
                var result = url.match(route.route);
                if (result)
                {
                    var data = {};
                    data.matches = result;
                    
                    dataList.push(
                        {
                            route: route,
                            data: data
                        }
                    );
                    
                    // saves the current route id
                    router.currentId = route.id;
                    
                    // break after first hit
                    break;
                }
            }
            
            // check for mathing string routes
            else
            {
                var currentUrlParts = url.split("/");
                var routeParts = route.route.split("/");
                
                //console.log("matchCounter ", matchCounter, url, route.route)

                // first check so that they have the same amount of elements at least
                if (routeParts.length == currentUrlParts.length)
                {
                    var data = {};
                    var matched = true;
                    var matchCounter = 0;

                    for(var j = 0, jj = routeParts.length; j < jj; j++)
                    {
                        var isParam = routeParts[j].indexOf(":") === 0;
                        if (isParam)
                        {
                            data[routeParts[j].substring(1)] = decodeURI(currentUrlParts[j]);
                            matchCounter++;
                        }
                        else
                        {
                            if (routeParts[j] == currentUrlParts[j])
                            {
                                matchCounter++;
                            }
                        }
                    }

                    // break after first hit
                    if (routeParts.length == matchCounter)
                    {
                        dataList.push(
                            {
                                route: route,
                                data: data
                            }
                        );

                        // saved the current route id
                        router.currentId = route.id;
                        router.currentParameters = data;
                        
                        break; 
                    }
                    
                }
            }
            
        }
        
        return dataList;
    }
    
    function checkRoutes()
    {
        var currentUrl = parseUrl(location.pathname);

        // check if something is catched
        var actionList = getParameters(currentUrl);
        
        // ietrate trough result (but it will only kick in one)
        for(var i = 0, ii = actionList.length; i < ii; i++)
        {
            actionList[i].route.callback(actionList[i].data);
        }
    }
    

    function handleRoutes(e)
    {
        if (e != null && e.originalEvent && e.originalEvent.state)
        {
            checkRoutes();
        }
        else if (hasHashState)
        {
            checkRoutes();
        }
        else if (!hasHashState && !hasPushState)
        {
            checkRoutes();
        }
    }



    if (!$.router)
    {
        $.router = router;
    }
    else
    {
        if (window.console && window.console.warn)
        {
            console.warn("jQuery.status already defined. Something is using the same name.");
        }
    }
        
})( jQuery );
