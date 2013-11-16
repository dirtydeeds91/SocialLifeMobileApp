(function (global) {
    var MessagesViewModel,
    app = global.app = global.app || {};

    MessagesViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        areMessagesReceived: false,
        isEventMessages: false,
        otherUser: "",
        userEventId: "",
        messages: [],
        messageToSend: "",

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.messagesService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var userId = e.view.params.userId;
            if (userId != "") {
                that.set("userEventId", userId);
                that.onGetUserMessages(userId);
            }
            else {
                //EVENT MESSAGES!!!
                that.set("isEventMessages", true);
                //onGetEventMessages(eventId);
            }
        },
        
        onGetUserMessages: function (userId) {
            var that = global.app.messagesService.viewModel;
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.messages + "getpm/" + userId +
                                    "?sessionKey=" + global.app.sessionKey)
                .then(function (messages) {
                    if (messages.length != 0) {
                        that.set("isEventMessages", false);
                        that.set("areMessagesReceived", true);
                        that.set("messages", messages);
                        if (messages[0].Sender == global.app.displayName) {
                            that.set("otherUser", messages[0].Receiver);
                        }
                        else {
                            that.set("otherUser", messages[0].Sender);
                        }
                        //$('.km-scroll-wrapper').scrollTo($('#write-message'), 0);
                    }
                });
            }
        },
        
        onSendUserMessage: function() {
            var that = global.app.messagesService.viewModel;
            
            if (that.messageToSend === "") {
                navigator.notification.alert("Can't send empty message!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }
            
            var dateNow = new Date();
            var date = dateNow.toLocaleDateString() + " " + dateNow.toLocaleTimeString();
            var messageInfo = {
                Content: that.messageToSend,
                Date: date,
                ReceiverId: that.userEventId
            };
            
            var msgJSON = JSON.stringify(messageInfo);
            
            httpRequest.postJSON(global.app.serviceUrl + global.app.messages + "postpm" +
                                 "?sessionKey=" + global.app.sessionKey, msgJSON)
                .then(function (data) {
                    that.onGetUserMessages(that.userEventId);
                });
        }
    });

    app.messagesService = {
        viewModel: new MessagesViewModel(),
    };
})(window);