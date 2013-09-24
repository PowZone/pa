/* app/views/showcaseviews.js
 * the many showcases of Peter Arnell */
'use strict';

define([
    'jquery',
    'backbone',
    'underscore',
    'tpl/jst',
    'utils/fbLoader',
    'isotope'
], function( $, Backbone, _, TPL, fbLoader ) {

    var showcases = {}

    // Thumb
    // Image Showcase thumbnail used in Isotope
    showcases.Thumb = Backbone.View.extend({
        tagName : "div",
        template : TPL.thumbTemplate,

        className : function() {
            if (this.options.cover) {
                var tags = []
                _.each( this.model.get('tags'), function(obj) {
                    tags.push( obj.className )
                }, this )
                return "thumb " + tags.join(' ') + (this.model.get('wide') ? " wide" : "")
            } else {
                return "thumb" + (this.model.get('wide') ? " wide" : "")
            }
        },

        render : function(){
            this.$el.html( this.template({
                url : this.options.path ? this.options.path + '/' + this.model.get('url') : this.model.get('url'),
                cover : this.options.cover,
                caption : this.model.get('caption'),
                year : this.options.path === 'projects' ? this.model.get('year') : '',
                thumb : this.model.get('thumb'),
                lg_thumb : this.model.get('lg_thumb'),
                large : this.options.large
            }) )
            return this.el
        }
    })

    // Image
    // Image Showcase container. controls Isotope
    showcases.Image = Backbone.View.extend({
        tagName : 'div',
        id : 'iso-grid',

        initialize : function() {
            _.bindAll(this, 'render', 'firstLoad', 'filter')

            this.collection.forEach(function(image) {
                var thumb = new showcases.Thumb({
                    model : image,
                    cover : this.options.cover ? true : false,
                    large : this.collection.length < 5 && !this.options.cover,
                    path : this.options.path
                })
                this.$el.append( thumb.render() )
            }, this)

        },

        className : function() {
            var classes = ['isotope-grid', 'showcase', 'image']
            if (this.options.cover) {
                return classes.concat(['fixed']).join(' ')
            } else if (this.collection.length < 5) {
                return classes.concat(['rtl']).join(' ')
            } else {
                return classes.join(' ')
            }
        },

        render : function(options){
            this.on('filter', this.filter)
            fbLoader()
            return this.el
        },

        firstLoad: function() {

            var $img = this.$('img'),
                rtl = this.$el.hasClass('rtl'),
                fixed = this.$el.hasClass('fixed'),
                $el = this.$el

            this.$el.imagesLoaded( function() {
                $el.isotope({
                    transformsEnabled: !rtl,
                    itemSelector: '.thumb',
                    layoutMode : fixed ? 'masonry' : 'fitRows',
                    masonry : {
                        gutterWidth: 7,
                        columnWidth: rtl ? 164*1.5 : 164
                    },
                    onLayout : function() {
                        $(this).css('overflow', 'visible')
                    }
                })

                $img.addClass('loaded')
            })
        },

        filter : function(filter) {
            this.$el.isotope({ filter : filter })
        }
    })

    // FilmThumb
    // Film grid thumbnail
    showcases.FilmThumb = Backbone.View.extend({
        tagName : 'div',
        template : TPL.filmThumb,
        render : function() {
            var html = this.template({
                url : this.model.url(),
                thumb : this.model.get('thumb'),
                title : this.model.get('title'),
                summary : this.model.get('summary')
            })
            this.$el.append( html )
            return this.el
        }
    })

    // FilmGrid
    // Loaded on /Films
    showcases.FilmGrid = Backbone.View.extend({
        tagName : 'div',
        className: 'film-container',
        rowTmpl : TPL.filmRow,
        $row : undefined,
        render : function() {

            this.collection.forEach( function(model, index){
                if (index % 4 === 0) {
                    this.$row = $( this.rowTmpl() )
                    this.$el.append(this.$row)
                }
                this.$row.append( new showcases.FilmThumb({ 
                    model : model
                }).render() )
            }, this )

            this.$('.film-row').imagesLoaded( function() {
                $(this).addClass('loaded')
            })

            return this.el
        }
    })

    // Video
    // Video showcase used on Single projects
    showcases.Video = Backbone.View.extend({
        tagname : 'div',
        className : 'showcase video',
        videoCaption : TPL.videoCaption,

        initialize : function() {
            this.videoTmpl = this.model.get('video_id') ? TPL.videoID : TPL.iframeVideo
            this.videoSrc = this.model.get('video_id') ? this.model.get('video_id') : this.model.get('video_src')
        },

        render : function() {
            var film = this.videoTmpl({
                videoSrc : this.videoSrc,
                youtube : this.model.get('youtube')
            })

            var caption = this.videoCaption({
                title : this.model.get('title'),
                content : this.model.get('caption'),
            })

            this.$el
                .append(film)
                .append(caption)

            return this.el
        }
    })

    // Text
    // Generic Text view with modular html components
    showcases.Text = Backbone.View.extend({
        tagName : 'div',
        className : 'showcase text',
        base : TPL.textTemplate,
        header : TPL.textTemplateHeader,
        bioImg : TPL.bioImage,
        gallery : TPL.textGallery,
        back : TPL.backButton,
        render : function() {
            return this.$el
        }
    })

    // Li
    // List Showcase LI element
    showcases.Li = Backbone.View.extend({
        tagName : 'li',
        template : TPL.listItemPartial,

        initialize : function(model, options) {
            _.bindAll( this, 'toggle' )
        },

        events : {
            'click a' : 'toggle'
        },

        toggle : function(e) {
            if ( !$(e.currentTarget).parents('.projects').length ) {
                e.preventDefault()
                this.model.activate()
            }
        },

        render : function() {
            this.$el.append( this.template({
                id : this.model.id,
                title : this.model.get('title'),
                summary : this.model.get('showcases') ? '' : this.model.get('summary'),
                url : this.options.url,
                path : this.options.path
            }) )
            return this.el
        }
    })

    // ListSect
    // List Showcase Section element container
    showcases.ListSect = Backbone.View.extend({
        tagName : 'section',
        header : TPL.listHeaderPartial,

        render : function() {
            var listItems = this.options.listItems,
                path = this.options.path,
                date = this.options.date,
                url = this.options.url === false ? false : true

            this.$el.append( '<ul />')
            this.$('ul').append( this.header({ 
                htmlDate : date,
                date : date 
            }) )

            _.each( listItems, function(listItem) {
                this.$('ul')
                    .append( new showcases.Li({
                        model : listItem,
                        path : path ? path : '',
                        url : url ? listItem.url() : false
                    }).render() )
            }, this )

            return this.el
        }

    })

    // List
    // Outer List showcase made up of ListSects that contain Li views
    showcases.List = Backbone.View.extend({
        tagName : 'div',
        className : 'showcase list',
        initialize : function() {
            var self = this

            var sorted = this.collection.sortBy('title')
            var dateObj = _.groupBy( sorted, function(model) {
                return model.get('date').year()
            })
            var dateArray = _.pairs( dateObj )
            this.byDate = _.sortBy(dateArray, function(item) { return item[0] } )

            this.byFirst = (function() {
                var sorted = self.collection.sortBy('title')
                return _.groupBy(sorted, function(model) {
                    var t = model.get('title')
                    return t[0]
                })
            }())

        },

        render : function(sort){
            console.log('List render')
            this.on('sort', this.render)
            this.on('jump', this.jump)

            var group = sort === 'date' ? this.byDate : this.byFirst

            this.$el.empty()
            _.each( group, function(v,k){
                var html = new showcases.ListSect({
                    id : sort === 'date' ? v[0] : k.toLowerCase(),
                    date : sort === 'date' ? v[0] : k,
                    listItems : sort === 'date' ? v[1] : v,
                    path : this.options.path,
                    url : this.options.url
                })
                this.$el.append( html.render() )
            }, this )

            return this.el
        },

        jump : function(jump) {
            $('html, body').animate({
                scrollTop : $('#' + jump).offset().top - 200
            })
        }
    })

    // SmallList
    // Stripped down variant of List
    showcases.SmallList = Backbone.View.extend({
        tagName : 'div',
        className : 'showcase list',
        initialize : function() {},
        render : function() {
            this.$el.append('<ul/>')
            _.each( this.collection, function(el, idx) {
                var li = document.createElement('li'),
                    a = document.createElement('a'),
                    h4 = document.createElement('h4')

                $(a).attr('href', el.url).text(el.title)
                $(a).appendTo(h4)
                $(h4).appendTo(li)
                this.$('ul').append(li)
            }, this )

            return this.el
        }

    })

    // Star
    // Starfield item
    showcases.Star = Backbone.View.extend({
        tagName : "a",
        initialize : function() {
            _.bindAll( this, 'render' )

            $('<img>').appendTo( this.$el )
                .attr( 'src', this.model.get('thumb') )

            this.$el.css({
                left : this.options.HALF_WIDTH + this.randomRange(-this.options.HALF_WIDTH, this.options.HALF_WIDTH),
                top : this.options.HALF_HEIGHT + this.randomRange(-this.options.HALF_HEIGHT, this.options.HALF_HEIGHT)
            })
        },

        render : function(instagram) {
            this.$el
                .addClass( 'star' )

            if ( !!instagram ) {
                this.$el
                .attr( 'target' , '_blank' )
                .attr( 'href', this.model.get('url') )
            } else {
                var caption = document.createElement('div'),
                    p = document.createElement('p'),
                    span = document.createElement('span')

                $(p).html( this.model.get('caption') )
                $(span).addClass('year').html( this.model.get('year') )
                $(caption).addClass('caption').append(p).append(span)

                this.$el
                .attr( 'href', '/projects/' + this.model.get('url') )
                .prepend(caption)
            }

            return this.el
        }
    })

    showcases.Star.prototype.randomRange = function (min, max) {
        return ((Math.random()*(max-min)) + min)
    }

    // Starfield
    // Zoom effect used on Projects landing page
    showcases.Starfield = Backbone.View.extend({
        tagName : 'div',
        className : 'starfield',
        id : 'starfield',
        initialize : function( collection, instagram ){
            var SCREEN_WIDTH = window.innerWidth,
                SCREEN_HEIGHT = window.innerHeight,
                HALF_WIDTH = window.innerWidth / 2,
                HALF_HEIGHT = window.innerHeight / 2
                //imageLimit = SCREEN_WIDTH < 320 ? 12 : 48

            this.stagger = function() {
                var i = 0,
                    self = this

                function go(){
                    self.$el.append(
                        new showcases.Star({
                            model : self.images.models[i],
                            HALF_HEIGHT : HALF_HEIGHT,
                            HALF_WIDTH : HALF_WIDTH
                        }).render(instagram) )
                    i++

                    // CHANGE TO IMAGELIMIT WHEN PROJECTS INCREASE
                    if ( i < self.images.length ) {
                        setTimeout(go, 550)
                    }
                }

                go()
            }

            this.starsRunning = false
        },

        destroy : function() {
            this.starsRunning = false
            this.$el.empty()
            this.remove()
            this.unbind()
        },

        render : function() {
            this.starsRunning = true
            this.$el.empty()
            this.images = new Backbone.Collection( this.collection.shuffle() )
            this.stagger()
            return this.el
        }
    })

    return showcases
})

