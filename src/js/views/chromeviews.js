"use strict";
var PA = PA || {}
PA.dispatcher = PA.dispatcher || _.extend({}, Backbone.Events)

PA.Header = Backbone.View.extend({
    initialize: function() {
        this.filterBar = new PA.FilterBar({ model : this.model })
    }
})

PA.PageView = Backbone.View.extend({
    initialize: function() {
        _.bindAll( this, 'render' )

        this.outlineTitle = $('<h2/>').addClass('visuallyhidden')
        this.$el.prepend(this.outlineTitle)

        this.listenTo( this.model, 'change:showcase', this.render )
    },

    semantics : function( className, outlineTitle ) {
        this.$el.addClass( className || '' )
        this.outlineTitle.html( outlineTitle || '' )
        this.$el.prepend( this.outlineTitle )
    },

    render : function(pageModel, pageView) {

        this.$el.html( pageView.render() )
        this.semantics( this.model.get('className'), this.model.get('outlineTitle') )

        if ( pageView instanceof PA.ImageShowcase ) {
            pageView.firstLoad()
            pageModel.set('filter', '*')
        } else if ( pageView instanceof PA.ListShowcase ) {
            pageModel.set( 'sort', 'alpha' )
        }

    },

})

PA.App = Backbone.View.extend({
    initialize : function() {
        _.bindAll(this, 'projectFilter', 'render', 'routeHandler', 'projects', 'hashHandler' )

        this.model = new PA.PageModel()
        this.header = new PA.Header({ 
            el : '.site-header',
            parent : this,
            model : this.model
        })
        this.page = new PA.PageView({ 
            el : '.page',
            parent : this,
            model : this.model
        })

        $(window).on('hashchange', this.hashHandler)
        this.listenTo( PA.router, 'route', this.routeHandler )

        this.listenTo( this.model, 'change:filter', this.projectFilter )
        this.listenTo( this.model, 'change:view', this.projectView )
        this.listenTo( this.model, 'change:sort', this.projectSort )
        this.listenTo( this.model, 'change:jump', this.projectJump )
    },

    hashHandler : function() {
        var hashObj = $.deparam.fragment()

        if ( hashObj.filter ) {
            this.model.unset('filter', {silent : true} )
            this.model.set( 'filter', hashObj.filter )
        } else if ( hashObj.view ) {
            this.model.unset('view', {silent : true} )
            this.model.set( 'view', hashObj.view )
        } else if ( hashObj.sort ) {
            console.log('hashchange handler')
            this.model.unset('sort', {silent : true} )
            this.model.set( 'sort', hashObj.sort )
        } else if ( hashObj.jump ) {
            this.model.unset('jump', {silent : true} )
            this.model.set( 'jump', hashObj.jump )
        }
    },

    projects : function() {
        // Init Projects page by caching showcase views

        this.model.covers = new PA.ImageShowcase({
            cover : true,
            collection : new PA.CoverGallery( PA.projects.pluck('coverImage') ),
            path : 'projects'
        })

        this.model.titles = new PA.ListShowcase({
            // refactor other lists so they don't use grouped Collection
            groupedCollection : PA.projects.groupBy('date'),
            collection : PA.projects,
            pageClass : 'projects',
            section : 'Projects' 
        })

        this.model.random = new PA.Starfield({
            collection : this.model.covers.collection
        })

        this.model.set({ className : 'projects', outlineTitle : 'Projects' })
        //this.model.set( 'showcase' , this.model.random )
        $.bbq.pushState( { view : 'random' }, 2 )
    },

    projectFilter : function( pageModel, filter ) {

        if ( !(pageModel.get('showcase') instanceof PA.ImageShowcase) ) {
            pageModel.get('showcase').destroy()
            pageModel.set( 'showcase' , this.model.covers )
        }

        pageModel.get('showcase').trigger('filter', filter)
    },

    projectView : function( pageModel, view ) {

        pageModel.set( 'showcase', this.model[view] )
        if ( pageModel.get('showcase') instanceof PA.ImageShowcase ) {
            pageModel.get('showcase').filter('*')
        } else if ( pageModel.get('showcase') instanceof PA.ListShowcase ) {
            pageModel.set('sort', 'alpha')
        }
    },

    projectSort : function( pageModel, sort ) {

        console.log('change:sort handler')
        if ( !(pageModel.get('showcase') instanceof PA.ListShowcase) ) {
            pageModel.get('showcase').destroy()
            pageModel.set( 'showcase' , this.model.titles )
        }

        pageModel.get('showcase').render(sort)
    },

    projectJump : function( pageModel, jump ) {

        if ( !(pageModel.get('showcase') instanceof PA.ListShowcase) ) {
            pageModel.get('showcase').destroy()
            pageModel.set( 'showcase', this.model.titles )
        }

        pageModel.get('showcase').trigger('jump', jump)
    },

    events : {
        'click' : 'closeMenu'
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
