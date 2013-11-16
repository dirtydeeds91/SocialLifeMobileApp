(function (global) {
    var ProfileViewModel,
    app = global.app = global.app || {};

    ProfileViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isOtherUser: true,
        isOtherUserFriend: false,
        userId: "",
        displayName: "",
        about: "",
        avatar: "",
        birthdate: "",
        city: "",
        country: "",
        gender: "",
        mood: "",
        status: "",
        phone: "",
        friends: [],
        password: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        load: function (e) {
            var that = global.app.profileService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var userId = e.view.params.userId;
            
            if (userId == undefined) {
                userId = global.app.userId;
                that.set("isOtherUser", false);
            }
            else {
                that.set("isOtherUser", true);
                
                var userFriends = global.app.userFriends.toString().split(" ");
                var friendsLen = userFriends.length;
                
                for (var i = 0; i < friendsLen; i++) {
                    if (userFriends[i] == userId) {
                        that.set("isOtherUserFriend", true);
                    }
                }
            }
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.profiles + "user/" + userId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (user) {
                    that.set("userId", user.UserId);
                    that.set("displayName", user.DisplayName);
                    that.set("about", user.About);
                    that.set("avatar", user.Avatar);
                    var dateString = new Date(user.BirthDate).toDateString();
                    that.set("birthdate", dateString);
                    that.set("city", user.City);
                    that.set("country", user.Country);
                    if (user.Gender == true) {
                        that.set("gender", "Male");
                    }
                    else {
                        that.set("gender", "Female");
                    }
                    that.set("mood", user.Mood);
                    that.set("status", user.Status);
                    that.set("phone", user.PhoneNumber);
                    that.set("friends", user.FriendsList);
                });
            }
        },
        
        takePicture: function () {
        },
        
        onUpdate: function () {
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
        
        onRemoveFriend: function () {
            var that = global.app.profileService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "remove/" + 
                                that.userId + "?sessionKey=" + global.app.sessionKey)
            .then(function (data) {
                that.set("isOtherUserFriend", false);
                
                var userFriends = global.app.userFriends.toString().split(" ");
                var friendsLen = userFriends.length;
                global.app.userFriends = "";
                for (var i = 0; i < friendsLen; i++) {
                    if (userFriends[i] != that.userId) {
                        if (global.app.userFriends == undefined || global.app.userFriends == "") {
                            global.app.userFriends = userFriends[i].toString();
                        }
                        else {
                            global.app.userFriends = global.app.userFriend + ' ' + userFriends[i].Id.toString();
                        }
                    }
                }
            });
        },
        
        onOpenMessages: function () {
            global.app.application.navigate("views/messages-view.html#messages-view?userId=" + this.userId, 'slide:left');
        },
        
        onSeeFriends: function () {
            global.app.application.navigate("views/lists-view.html#lists-view?user=" + "1", 'slide:left');
        },
        
        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.profileService = {
        viewModel: new ProfileViewModel(),
    };
})(window);