/**
 * Created by chiichuy on 5/19/16.
 */
$(document).ready(function () {
    init()
})


function init() {
    Backbone.app = new router()
}

//Router
var router = Backbone.Router.extend({
    initialize: function() {
        Backbone.history.start();
    },
    routes: {
        "(/)": "index",
        "otra(/)": "otra"
    },
    index: function() {
        console.log("pagina index")
        //
        var view = new IndexView()
        view.render()
    },
    otra: function() {
        console.log("pagina otra")
    }
})

//View
var IndexView = Backbone.View.extend({
    el: "#mainContainer",
    collection: null,
    initialize: function() {
        //var model = new GeofenceModel({geoFenceId: "6860d166-fe9c-44c9-90c8-3296b53ae50c"})
        //model.fetch({
        //    success: function(data) {
        //        console.log(data.toJSON())
        //}})

        this.collection = new GeofenceCollection()
        this.collection.fetch({success: function(data){
            console.log(data.toJSON())
        }})

        var self = this
        this.collection.on("add", function(model) {
            //console.log("se agrego un modelo: ", model.toJSON())

            console.log(model.get("info"))
            self.$el.append("<h1>" + model.toJSON().info.name + "</h1><BR/> <BR/>")
        })
    },
    addModelCollection: function () {

    },
    events: {
      "click h1": "onClickH1"
    },
    render: function() {
        this.$el.append("<h1>Soy index</h1>")
    },
    onClickH1: function(e) {
        console.log(e.toElement.innerHTML)

        this.collection.find()
        var model = this.collection.at(0)
        //console.log(model)
        var cinfo = model.get("info")
        cinfo.iconos = "Hola mundo"

        model.set({info: cinfo})
        //model.save()

        this.collection.add(new GeofenceModel({name: "nuevo", info: {name: "HOLA!!!!"}}))
    }
})

//Model
var GeofenceModel = Backbone.Model.extend({
    idAttribute: "geoFenceId",
    urlRoot: "http://tracklabs.chiichuy.com:9000/api/1/alert/geofence/027042339903",
    initialize: function() {

    },
    parse: function(response) {
        if (!response.status) {
            return response
        }

        if (response.status != "ok"){
            return {}
        }

        return response.data
    }
})

//Collection
var GeofenceCollection = Backbone.Collection.extend({
    model: GeofenceModel,
    url: "http://tracklabs.chiichuy.com:9000/api/1/alert/geofence/027042339903",
    parse: function(response) {
        if (response.status != "ok"){
            return []
        }

        return response.data.alerts
    }
})