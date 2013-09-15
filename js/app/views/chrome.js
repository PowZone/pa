/* app/views/chrome.js
 * outer most appviews */
'use strict';

define([
    'require',
    'exports',
    'jquery',
    'backbone',
    'underscore',
    'app/views/showcaseviews',
    'bbq',
    'app/views/search',
    'app/router',
    'app/views/header',
    'app/views/page',
    'app/collections/covergallery',
    'app/views/projects',
    'app/views/singleviews'
], function( require, exports, $, Backbone, _, S ) {

    var App = Backbone.View.extend({
        initialize : function() {

            _.bindAll(this, 'render', 'routeHandler', 'projects', 'showSearch', 'singleProject' )

            this.model = new Backbone.Model()

            var Header = require('app/views/header')
            this.header = new Header({
                el : '.site-header',
                parent : this,
                model : this.model
            })

            var PageView = require('app/views/page')
            this.pageView = new PageView({
                el : '.page',
                parent : this,
                model : this.model
            })

            var Search = require('app/views/search')
            this.search = new Search.Form({
                el : '#searchForm',
                page : this.model
            })

            var r = require( 'app/router' )
            this.listenTo( r.router, 'route', this.routeHandler )

            this.listenTo( this.search, 'submit', function() {
                this.pageView.$el.empty()
            } )
        },

        home : function() {
        },

        projects : function(Projects) {
            this.model.set({
                className : 'projects',
                outlineTitle : 'Projects'
            })

            var S = require('app/views/showcaseviews'),
                CoverGallery = require('app/collections/covergallery'),
                ProjectLanding = require('app/views/projects')

            this.model.covers = new S.Image({
                cover : true,
                collection : new CoverGallery( Projects.pluck('coverImage') ),
                path : 'projects'
            })

            this.model.titles = new S.List({
                // refactor other lists so they don't use grouped Collection
                groupedCollection : Projects.groupBy('date'),
                collection : Projects,
                pageClass : 'projects',
                section : 'Projects'
            })

            this.model.random = new S.Starfield({
                collection : this.model.covers.collection
            })

            this.pageView.undelegateEvents()
            this.pageView.stopListening()

            this.model.set( 'page', new ProjectLanding({ model : this.model }) )


            if ( document.location.hash ) {
                var hashObj = $.deparam.fragment()
                if ( hashObj.filter || hashObj.view === 'covers' ) {
                    this.model.set( 'showcase' , this.model.covers )
                } else if ( hashObj.view === 'random' ) {
                    this.model.set( 'showcase', this.model.random )
                } else {
                    this.model.set( 'showcase', this.model.titles )
                }
            } else {
                $.bbq.pushState( { view : 'random' }, 2 )
            }
        },

        singleProject : function(Projects, project, urlTitle) {
            var model = Projects.findWhere({ url : project })

            if ( this.model.get('project') ) {
                model.get('showcases')
                    .findWhere({ url_title : urlTitle }).activate()
            } else {
                //define(function(require) {
                    var detailView = require('app/views/singleviews')
                    var view = new detailView.Project({ model : model })
                    this.model.set('project', view)

                    if (urlTitle) {
                        model.get('showcases')
                            .findWhere({ url_title : urlTitle }).activate()
                    } else {
                        model.get('showcases').first().activate(true)
                    }
                //})
            }

        },

        singleView : function(project, urlTitle) {
            //Projects.findWhere({ url : project }).get('showcases')
        },

        photoHomeInit : function( Albums ) {
            var CoverGallery = require('app/collections/covergallery')
            this.model.set( 'page', new S.Image({
                cover : true,
                collection : new CoverGallery( Albums.pluck('coverImage') ),
                path : 'photography'
            }) )
        },

        albumInit : function(Albums, urlTitle) {
            var views = require('app/views/singleviews')
            this.model.set( 'page', new views.Album({
                model : Albums.findWhere({ url : urlTitle })
            }) )
        },

        filmHomeInit : function( Films ) {
            this.model.set( 'page' , new S.FilmGrid({
                collection : Films
            }) )
        },

        singleFilmInit : function( Films, urlTitle ) {
            var views = require('app/views/singleviews')
            this.model.set( 'page', new views.Film({
                model : Films.findWhere({ url : urlTitle })
            }) )
        },

        streamInit : function( Instagrams ) {
            this.model.set( 'showcase', new S.Starfield({
                collection : Instagrams
            }, true ) )
        },

        events : {
            'click' : 'closeMenu',
            'click #searchIcon' : 'showSearch'
        },

        showSearch : function(e){
            e.preventDefault()
            this.search.render()
        },

        closeMenu : function(e) {
            this.header.$('.open').removeClass('open')
        },

        routeHandler : function(methodName, urlParam) {
            if (methodName !== 'projects'){
                try {
                    this.header.filterBar.remove()
                } catch(e) {}
            }
            try {
                this.page.$el.removeClass( this.last.pageClass )
            } catch(e) {}
        }
    })

    var app = new App({ el : document })
    exports.chrome = app
})
