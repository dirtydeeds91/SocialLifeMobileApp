(function (global) {
    var ProfileViewModel,
    app = global.app = global.app || {};

    ProfileViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
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
            
            if(userId == undefined) {
                userId = global.app.userId;
            }
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.profiles + "user/" + userId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (user) {
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
                    var x = 5;
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
            else if(gender == "Female") {
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
                var x = 5;
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

    app.profileService = {
        viewModel: new ProfileViewModel(),
    };
})(window);