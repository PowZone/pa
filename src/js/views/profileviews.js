/* views/profileviews.js - Profile Page Views and Section Views */

'use strict';
var PA = PA || {}
PA.dispatcher = PA.dispatcher || _.extend({}, Backbone.Events)

PA.ProfileContent = Backbone.View.extend({
    initialize : function() {
        _.bindAll( this, 'render', 'contentController' )
        this.listenTo( PA.dispatcher, 'profile:sectionActivate', this.render )
        this.listenTo( PA.dispatcher, 'profile:listItemActivate', this.contentController )
    },

    render : function(model){

        var showcase

        switch(model.section) {

            case 'bio':
                showcase = new PA.TextShowcase()
                var $layout = showcase.render(),
                    $base = $( showcase.base({
                        type : 'bio',
                        content : model.get('content')
                    }) )
                    .prepend( showcase.bioImg({
                        bioImg : model.get('bioImg')
                    }) )
                $layout.append($base)
                this.$el.html($layout)
                break;

            case 'press':
                showcase = new PA.ListShowcase({
                    groupedCollection : model.groupBy( function(e) {
                        return e.get('date').year()
                    } ),
                    path : '/profile/press/'
                })
                this.$el.html( showcase.render() )
                break;

            case 'awards':
                showcase = new PA.ListShowcase({
                    groupedCollection : model.groupBy( function(e) {
                        return e.get('date').year()
                    } ),
                    path : false,
                    url : false
                })
                this.$el.html( showcase.render() )
                break;

            case 'photos-of-pa':
                var album = new PA.PhotoAlbum( model.attributes )
                showcase = new PA.ImageShowcase({
                    collection : album.get('photos')
                })
                this.$el.html( showcase.render() )
                showcase.firstLoad()
                break;

            default:
                break;
        }
    },

    contentController : function(model){
        var layout = new PA.TextShowcase(),
            $layout = layout.render(),
            $base

        $base = $( layout.base({
            type : 'press',
            content : model.get('content')
        }) )
        .prepend( layout.header({
            title : model.get('title'),
            htmlDate : model.get('htmlDate'),
            date : model.get('date').format('MMMM DD, YYYY')
        }) )
        .append( layout.gallery({
            images : model.get('gallery'),
            imageTemplate : PA.jst.textGalleryImage
        }) )
        .append( layout.back({
            url : '/profile/' + model.collection.section,
            buttonText : 'See All Items'
        }) ).appendTo( $layout )

        this.$el.html( $layout )
    },

})

PA.ProfileLink = Backbone.View.extend({

    initialize : function() {
        _.bindAll( this, 'toggleSection', 'toggleView' )
        this.listenTo( PA.dispatcher, 'profile:sectionActivate', this.toggleView )
    },

    events : {
        'click' : 'toggleSection'
    },

    toggleSection : function(e) {
        e.preventDefault()
        PA.dispatcher.trigger( 'profile:swap', this.model || this.collection )
    },

    toggleView : function() {
        this.$el.toggleClass('active', this.model.active )
    }

})

PA.ProfileViewer = Backbone.View.extend({

    initialize : function() {
        _.bindAll( this, 'swap', 'back' )
        this.bio = new PA.Bio() // model
        this.press = new PA.Press()
        this.awards = new PA.Awards()
        this.photosOf = new PA.PhotosOf() // model
        this.articlesBy = new PA.ArticlesBy()
        this.articlesAbout = new PA.ArticlesAbout()
        this.interviews = new PA.Interviews()
        this.transcripts = new PA.Transcripts()
        this.acknowledgements = new PA.Acknowledgements() // model

        this.sections = []
        this.sections.push(
            this.bio
            , this.press
            , this.awards
            , this.photosOf
            , this.articlesBy
            , this.articlesAbout
            , this.interviews
            , this.transcripts
            , this.acknowledgements
        )

        this.listenTo( PA.dispatcher, 'profile:swap', this.swap )

        this.links = this.$('#profileLinks a')
    },

    events : {
        'click #back' : 'back'
    },

    back : function(e) {
        e.preventDefault()
        var sectionName = e.currentTarget.pathname
        var section = this[sectionName.slice(9)]
        section.activate()
    },

    swap : function(section) {

        // there are some situations where there isn't a disabled section
        try {
            _.findWhere( this.sections, { active : true }).deactivate()
        } catch(err) {}

        section.activate()
    },

    render : function() {

        _.each( this.links, function(aTag, index) {
            new PA.ProfileLink({
                el : '#' + aTag.id,
                model : this.sections[index] // IMPORTANT: these rely on the profile page links being in a specific order
            })
        }, this )

        this.viewer = new PA.ProfileContent({
            el : this.$('#showcaseContainer')
        })
    }
})
