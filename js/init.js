/* init.js */
'use strict';

require.config({
    paths : {
        jquery : 'lib/jquery/jquery',
        underscore : 'lib/underscore/underscore-amd.min',
        // using extend backbone
        backbone : 'utils/backbone',
        moment : 'lib/moment/moment.min',
        isotope : 'utils/iso',
        bbq : 'lib/bbq/jquery.ba-bbq.no-legacy',
        foundation : 'lib/foundation/foundation',
        tooltips : 'lib/foundation/foundation.tooltips',
        fancybox : 'lib/fancybox/jquery.fancybox.pack',
        json : 'lib/json/json2',
        'app/router' : 'app/router.1379973692019742139',
        'app/collections/covergallery' : 'app/collections/covergallery.1379973692019742139',
        'app/collections/films' : 'app/collections/films.1379973692019742139',
        'app/collections/instagrams' : 'app/collections/instagrams.1379973692019742139',
        'app/collections/photography' : 'app/collections/photography.1379973692019742139',
        'app/collections/profile' : 'app/collections/profile.1379973692019742139',
        'app/collections/projects' : 'app/collections/projects.1379973692019742139',
        'app/collections/showcases' : 'app/collections/showcases.1379973692019742139',
        'app/models/album' : 'app/models/album.1379973692019742139',
        'app/models/cover' : 'app/models/cover.1379973692019742139',
        'app/models/film' : 'app/models/film.1379973692019742139',
        'app/models/profilesection' : 'app/models/profilesection.1379973692019742139',
        'app/models/project' : 'app/models/project.1379973692019742139',
        'app/models/searchQuery' : 'app/models/searchQuery.1379973692019742139',
        'app/models/showcase' : 'app/models/showcase.1379973692019742139',
        'app/views/chrome' : 'app/views/chrome.1379973692019742139',
        'app/views/filterviews' : 'app/views/filterviews.1379973692019742139',
        'app/views/header' : 'app/views/header.1379973692019742139',
        'app/views/home' : 'app/views/home.1379973692019742139',
        'app/views/page' : 'app/views/page.1379973692019742139',
        'app/views/profileviews' : 'app/views/profileviews.1379973692019742139',
        'app/views/projects' : 'app/views/projects.1379973692019742139',
        'app/views/search' : 'app/views/search.1379973692019742139',
        'app/views/showcaseviews' : 'app/views/showcaseviews.1379973692019742139',
        'app/views/singleviews' : 'app/views/singleviews.1379973692019742139',
        'utils/spinner' : 'utils/spinner.1379973692019742139',
        'tpl/jst' : 'tpl/jst.1379973692019742139'
    },
    shim : {
        'jquery': {
            exports: '$'
        },
        'isotope' : ['jquery'],
        'bbq' : {
            deps : ['jquery']
        },
        'foundation' : {
            deps : ['jquery']
        },
        'tooltips' : {
            deps : ['jquery', 'foundation']
        },
        'fancybox' : {
            deps : ['jquery']
        },
        'json' : {
            deps : ['jquery']
        }
    },
    waitSeconds : 20
})

require( ['jquery', 'underscore', 'backbone', 'app/router', 'app/views/chrome'],
function( $, _, Backbone, Router ){
    Backbone.history.start({ pushState : true, root : '/' })
} )
