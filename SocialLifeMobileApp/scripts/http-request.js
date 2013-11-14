window.httpRequest = (function(){
    function getJSON(url){
        var promise = new RSVP.Promise(function(resolve, reject){
            $.ajax({
                url:url,
                type:"GET",
                dataType:"json",
                contentType:"application/json",
                timeout:5000,
                success:function(data){
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Get query failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function postJSON(url, postdata) {
        var promise = new RSVP.Promise(function(resolve, reject){
            $.ajax({
                url:url,
                type:"POST",
                data: postdata,
                dataType:"json",
                contentType:"application/json",
                timeout:5000,
                success:function(data){
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Post query failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    
    return {
        getJSON:getJSON,
        postJSON:postJSON
    };    
}());