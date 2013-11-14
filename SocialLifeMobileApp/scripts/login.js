(function (global) {
    var LoginViewModel,
    app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isRegisterPressed: false,
        username: "",
        password: "",
        displayName: "",
        passwordRepeat: "",

        onLogin: function () {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();
            
            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }
            
            var shaPassword = CryptoJS.SHA1(that.password);
            
            var passToSha = shaPassword.toString();
            
            var loginInfo = {"Username": that.username, "AuthCode": passToSha};
            
            var jsonData = JSON.stringify(loginInfo);
            
            httpRequest.postJSON("http://localhost:22757/api/users/login", jsonData)
            .then(function (data) {
                that.set("displayName", data.DisplayName);
                that.set("isLoggedIn", true);
            });
        },
        onRegister: function () {
            if (this.isRegisterPressed) {
                var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim(),
                passwordRepeat = that.get("passwordRepeat").trim(),
                displayName = that.get("displayName").trim();

                if (username === "" 
                    || password === "" 
                    || displayName === ""
                    || passwordRepeat != password) {
                    navigator.notification.alert("All fields are required and passwords must match!",
                                                 function () {
                                                 }, "Registration failed", 'OK');

                    return;
                }
                
                if (username.length < 6 || password.length < 6) {
                    navigator.notification.alert("Username & passwords must have at least 6 symbols." +
                                                 "\nValid username characters: letters, numbers and dot.",
                                                 function () {
                                                 }, "Registration failed", 'OK');

                    return;
                }
                
                var shaPassword = CryptoJS.SHA1(that.password);
                
                var passToSha = shaPassword.toString();
            
                var loginInfo = {"Username": that.username, "AuthCode": passToSha, "DisplayName": that.displayName};
            
                var jsonData = JSON.stringify(loginInfo);
            
                httpRequest.postJSON("http://localhost:22757/api/users/register", jsonData)
                .then(function (data) {
                    that.set("displayName", data.DisplayName);
                    that.set("isRegisterPressed", false);
                    that.set("isLoggedIn", true);
                });
            }
            else {
                this.set("isRegisterPressed", true);
            }
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
            that.set("displayName", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);