(function (global) {
    var mobileSkin = "",
    app = global.app = global.app || {},
    os = kendo.support.mobileOS,
    statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

    app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout", statusBarStyle: statusBarStyle });
    app.sessionKey = "";
    app.userId = "";
    app.serviceUrl = "http://localhost:22757/api/";
    app.users = "users/";
    app.profiles = "profiles/";
    app.messages = "messages/";
    app.events = "events/";
    app.isLoggedIn = false;
    
    app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };
})(window);