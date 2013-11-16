(function (global) {
    var EventViewModel,
    app = global.app = global.app || {};

    EventViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isAttending: false,
        isEventFound: false,
        eventId: 0,
        eventName: "",
        content: "",
        users: [],
        creator: "",
        date: "",
        status: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.eventService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var eventId = e.view.params.eventId;
            
            if (eventId != "" && eventId != undefined) {
                that.onGetEventInfo(eventId);
            }
            else {
                that.set("eventId", "");
                that.set("isEventFound", false);
                that.set("eventName", "");
                that.set("content", "");
                that.set("creator", "");
                that.set("users", "");
                that.set("date", "");
                that.set("status", "");
            }
        },
        
        onGetEventInfo: function (eventId) {
            var that = global.app.eventService.viewModel;
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.events + "get/" + eventId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (event) {
                    that.set("eventId", eventId);
                    that.set("eventName", event.Name);
                    that.set("content", event.Content);
                    that.set("creator", event.CreatorName);
                    that.set("users", event.UsersList);
                    var dateString = new Date(event.Date).toDateString();
                    that.set("date", dateString);
                    that.set("status", event.Status);
                    
                    var usersLen = that.users.length;
                    
                    if (usersLen > 0) {
                        for (var i = 0; i < usersLen; i++) {
                            if (that.users[i].DisplayName == global.app.displayName) {
                                that.set("isAttending", true)
                            }
                        }
                    }
                    that.set("isEventFound", true);
                    kendo.bind($("#update-event-btn"), app.eventService.viewModel);
                });
            }
        },
        
        onAttendButton: function () {
            var that = global.app.eventService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.events + "add/" + 
                                that.eventId + "?sessionKey=" + global.app.sessionKey + "&userId=0")
            .then(function (data) {
                that.set("isAttending", true);
                
                that.onGetEventInfo(that.eventId);
            });
        },
        
        onNotAttendButton: function () {
            var that = global.app.eventService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.events + "remove/" + 
                                that.eventId + "?sessionKey=" + global.app.sessionKey + "&userId=" + global.app.userId)
            .then(function (data) {
                that.set("isAttending", false);
                
                that.onGetEventInfo(that.eventId);
            });
        },
        
        onSeeMessages: function () {
            global.app.application.navigate("views/messages-view.html#messages-view?eventId=" + this.eventId, 'slide:left');
        },
        
        onSeeUsers: function () {
            global.app.application.navigate("views/lists-view.html#lists-view?type=" + "2", 'slide:left');
        },
        
        navigateToUser: function () {
        },
        
        onUpdateEvent: function () {
            if (this.creator == global.app.displayName) {
                global.app.application.navigate("views/edit-event-view.html#event-edit?eventId=" + this.eventId, 'slide:left');
            }
            else {
                navigator.notification.alert("You have to be the creator of the event if you want to update!",
                                             function () {
                                             }, "Update failed", 'OK');

                return;
            }
        },
        
        onSubmitEventData: function () {
            var that = global.app.eventService.viewModel;
            
            var status = $('input[name=status-radio]:checked', '#event-form').val();
            //LOCATION!!!!
            var contentInfo = {"Content": that.content, "Name": that.eventName, "Status": status, "Date": that.date, Longitude: "asd", Latitude: "asd" };
            
            var contentJSON = JSON.stringify(contentInfo);
            
            var serviceUrl = "";
            if (that.eventId != "") {
                serviceUrl = global.app.serviceUrl + global.app.events + "update/" + 
                             that.eventId + "?sessionKey=" + global.app.sessionKey;
                that.onUpdateEventQuery(serviceUrl, contentJSON);
            }
            else {
                serviceUrl = global.app.serviceUrl + global.app.events + "create" + 
                             "?sessionKey=" + global.app.sessionKey;
                that.onCreateEventQuery(serviceUrl, contentJSON);
            }
        },
        
        onUpdateEventQuery: function(serviceUrl, contentJSON) {
            var that = global.app.eventService.viewModel;
            
            httpRequest.putJSON(serviceUrl, contentJSON)
            .then(function (event) {
                global.app.application.navigate("views/event-view.html#event-view?eventId=" + that.eventId, 'slide:left');
            });
        },
        
        onCreateEventQuery: function(serviceUrl, contentJSON) {
            httpRequest.postJSON(serviceUrl, contentJSON)
            .then(function (event) {
                global.app.application.navigate("views/event-view.html#event-view?eventId=" + event.EventId, 'slide:left');
            });
        },
        
        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.eventService = {
        viewModel: new EventViewModel(),
    };
})(window);