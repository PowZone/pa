/* app/views/chrome.js
 * outer most appviews */
'use strict';

define([
    'require',
    'exports',
    'jquery',
    'backbone',
    'underscore',
    //'app/views/header',
    'app/views/page',
    'app/views/search',
    'bbq'
    //'app/router',
    //'app/collections/covergallery',
    //'app/views/projects',
    //'app/views/profileviews',
    //'app/views/singleviews'
], function( require, exports, $, Backbone, _, PageView, Search ) {

    var App = Backbone.View.extend({
        initialize : function() {

            _.bindAll(this, 'render', 'routeHandler', 'projects', 'showSearch', 'singleProject' )

            this.model = new Backbone.Model()

            this.pageView = new PageView({
                el : '.page',
                parent : this,
                model : this.model
            })

            this.search = new Search.Form({
                el : '#searchForm',
                page : this.model
            })

            this.listenTo( this.search, 'submit', function() {
                this.pageView.$el.empty()
            } )
        },

        home : function() {
            var self = this

            this.model.set({
                outlineTitle : 'Home'
            })

            require(['app/views/home'], function( Home ) {
                self.model.set( 'page', new Home() )
            })
        },

        projects : function(Projects) {
            var self = this
            this.model.set({
                outlineTitle : 'Projects'
            })

            require(['app/views/showcaseviews', 'app/collections/covergallery', 'app/views/projects'],
            function( S, CoverGallery, ProjectLanding ) {

                self.model.covers = new S.Image({
                    cover : true,
                    collection : new CoverGallery( Projects.pluck('coverImage') ),
                    path : 'projects'
                })

                self.model.titles = new S.List({
                    collection : Projects,
                    pageClass : 'projects',
                    section : 'Projects'
                })

                self.model.random = new S.Starfield({
                    collection : self.model.covers.collection
                })

                self.pageView.undelegateEvents()
                self.pageView.stopListening()

                self.model.set( 'page', new ProjectLanding({ model : self.model }) )

                if ( document.location.hash ) {
                    var hashObj = $.deparam.fragment()
                    if ( hashObj.filter || hashObj.view === 'covers' ) {
                        self.model.set( 'showcase' , self.model.covers )
                    } else if ( hashObj.view === 'random' ) {
                    self.model.set( 'showcase', self.model.random )
                    } else {
                        self.model.set( 'showcase', self.model.titles )
                    }
                } else {
                    $.bbq.pushState( { view : 'random' }, 2 )
                }
            })
        },

        singleProject : function(Projects, project, urlTitle) {
            $('.page').removeClass('projects')
            var model = Projects.findWhere({ url : project })

            if ( this.model.get('project') ) {
                model.get('showcases')
                    .findWhere({ url_title : urlTitle }).activate()
            } else {
                //var detailView = require('app/views/singleviews')
                var self = this
                require(['app/views/singleviews'],
                function(detailView) {
                    var view = new detailView.Project({ model : model })
                    self.model.set('page', view)

                    if (urlTitle) {
                        model.get('showcases')
                            .findWhere({ url_title : urlTitle }).activate()
                    } else {
                        model.get('showcases').first().activate(true)
                    }
                })
            }

        },

        photoHomeInit : function( Albums ) {
            var self = this

            require(['app/views/showcaseviews', 'app/collections/covergallery'],
            function( S, CoverGallery ) {
            //var CoverGallery = require('app/collections/covergallery'),
            //    S = require('app/views/showcaseviews')

                self.model.set( 'page', new S.Image({
                    cover : true,
                    collection : new CoverGallery( Albums.pluck('coverImage') ),
                    path : 'photography'
                }) )
            })
        },

        albumInit : function(Albums, urlTitle) {
            //var views = require('app/views/singleviews')
            var self = this
            require(['app/views/singleviews'],
            function( views ) {
                self.model.set( 'page', new views.Album({
                    model : Albums.findWhere({ url : urlTitle })
                }) )
            })
        },

        filmHomeInit : function( Films ) {
            //var S = require('app/views/showcaseviews')
            var self = this
            require(['app/views/showcaseviews'],
            function( S ) {
                self.model.set( 'page' , new S.FilmGrid({
                    collection : Films
                }) )
            })
        },

        singleFilmInit : function( Films, urlTitle ) {
            //var views = require('app/views/singleviews')
            var self = this
            require(['app/views/singleviews'],
            function( views ) {
                self.model.set( 'page', new views.Film({
                    model : Films.findWhere({ url : urlTitle })
                }) )
            })
        },

        profileInit : function( Profile, Page ) {
            //var Page = require('app/views/profileviews')
            //var self = this
            //require(['app/views/profileviews'],
            //function( Page ) {
                this.model.set( 'page', new Page({
                    el : '#profileViewer',
                    sections : Profile
                }) )
            //})
        },

        streamInit : function( Instagrams ) {
            //var S = require('app/views/showcaseviews')
            var self = this
            require(['app/views/showcaseviews'],
            function( S ) {
                self.model.set( 'page', new S.Starfield({
                    collection : Instagrams
                }, true ) )
            })
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
            $('#filter-bar .open').removeClass('open')
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

    return new App({ el : document })
})
