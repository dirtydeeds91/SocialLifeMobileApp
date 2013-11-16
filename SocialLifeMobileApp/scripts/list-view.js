(function (global) {
    var ListViewModel,
    app = global.app = global.app || {};

    ListViewModel = kendo.data.ObservableObject.extend({
        friends: [],
        areUsersFound: false,
        events: [],
        areEventsFound: false,
        isLoggedIn: false,

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.listService.viewModel;
            
            var user = e.view.params.user;
            if(user) {
                var users = global.app.profileService.viewModel;
                if(users.friends.length != 0) {
                    that.set("areUsersFound", true);
                    that.set("friends", users.friends);
                }
                else {
                    that.set("areUsersFound", false);
                    that.set("friends", []);
                }
            }
            else {
                var events = 5;
                //check events
            }
            that.set("isLoggedIn", global.app.isLoggedIn);
        },

        navigateToUser: function (e) {
            global.app.application.navigate("views/profile-view.html#profile-view?userId=" + e.data.Id, 'slide:left');
        },
    });

    app.listService = {
        viewModel: new ListViewModel(),
    };
})(window);