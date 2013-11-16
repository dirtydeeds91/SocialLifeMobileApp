(function (global) {
    var EventViewModel,
    app = global.app = global.app || {};

    EventViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isAttending: false,
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
                    
                    kendo.bind($("#update-event-btn"), app.eventService.viewModel);
                });
            }
        },
        /*        onUpdate: function () {
        var that = global.app.profileService.viewModel,
        password = that.get("password"),
        displayName = that.get("displayName"),
        about = that.get("about"),
        avatar = that.get("avatar"),
        birthdate = that.get("birthdate"),
        city = that.get("city"),
        country = that.get("country"),
        gender = $('input[name=gender-radio]:checked', '#update-form').val(),
        mood = that.get("mood"),
        status = $('input[name=status-radio]:checked', '#update-form').val(),
        phone = that.get("phone");
            
        if (password === "") {
        navigator.notification.alert("Please enter your password!",
        function () {
        }, "Update failed", 'OK');

        return;
        }
            
        if (gender == "Male") {
        gender = "true";
        }
        else if (gender == "Female") {
        gender = "false";
        }
            
        var data = {
        "About": about,
        "Avatar": avatar,
        "BirthDate": birthdate,
        "City": city,
        "Country": country,
        "Gender": gender,
        "Mood": mood,
        "Status": status,
        "PhoneNumber": phone,
        "AuthCode": CryptoJS.SHA1(password).toString(),
        "DisplayName": displayName
        };
            
        var jsonData = JSON.stringify(data);
            
        httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "update?sessionKey=" + global.app.sessionKey, jsonData)
        .then(function (data) {
        global.application.navigate("#:back");
        });
        },
        
        onAddAsFriend: function () {
        var that = global.app.profileService.viewModel;
            
        httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "add/" + 
        that.userId + "?sessionKey=" + global.app.sessionKey)
        .then(function (data) {
        that.set("isOtherUserFriend", true);
                
        var friendsString = global.app.userFriends;
        if(friendsString == "") {
        friendsString = that.userId.toString();
        }
        else {
        friendsString = friendsString + ' ' + that.userId.toString();
        }
                
        global.app.userFriends = friendsString;
        });
        },
        */
        
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
                //global.app.application.navigate("views/lists-view.html#lists-view?type=" + "2", 'slide:left');
            }
            else {
                navigator.notification.alert("You have to be the creator of the event if you want to update!",
                                             function () {
                                             }, "Update failed", 'OK');

                return;
            }
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