/*jshint esversion: 6 */
var twitterMode=false;
var $characterCounter;
var counterSpan;
var curMessageKey;
var messages = {};
var $contentPane;
let messageChanged = false;

const setMessageChanged = function(){messageChanged=true;};

function messagesPageSetup(){
    $characterCounter = $("#characterCounter");
    counterSpan = $characterCounter.find("span")[0];
    $contentPane = $("#content");

    $contentPane.on("keypress",setMessageChanged);
    messageSelectionChanged();
    loadMessages();
}

function save( messageKey, content ) {
    messages[keyToString(messageKey)] =  {
        platform:messageKey.platform,
        gender:messageKey.gender,
        position:messageKey.position,
        camId:campaignId,
        text:content
    };
    messageChanged = false;
    ["male", "female"].forEach( function(g){
       ["Email", "Twitter", "WhatsApp"].forEach( function(platform){
           positions.forEach(function(pos){
               const key = {
                 gender:g,
                 platform:platform,
                 position:pos
               };
               const hasData = (load(key).trim().length > 0);
               const $cell = $("#"+g+"_"+platform+"_"+pos);
               if ( hasData ) {
                   $cell.removeClass("noMessage");
                   $cell.addClass("hasMessage");
               } else {
                   $cell.removeClass("hasMessage");
                   $cell.addClass("noMessage");
               }
           });
       });
    });


}

function load( messageKey ) {
    const message = messages[keyToString(messageKey)];
    return message ? message.text : "";
}

let lastClass="bg-success";
function updateCharacterCount() {
    const charLen = $contentPane.val().length;
    const left = 280-charLen;
    counterSpan.textContent=String(left);
    let curClass = "bg-success";
    if ( left < 100 ) {
        curClass = "bg-warning";
    } else if ( left < 0 ) {
        curClass = "bg-danger";
    }

    if ( lastClass !== curClass ) {
        $characterCounter.removeClass(lastClass);
        $characterCounter.addClass(curClass);
        lastClass = curClass;
    }
}
//
function keyToString( aKey ) {
    return aKey.platform + "/" + aKey.gender + "/" + aKey.position;
}

function getMessageKey() {
 const retVal = {};
 const checkedIds = $( "input:checked" ).map(function() {
            return this.id;
        }).get();

 const platform = checkedIds.filter(e=>e.indexOf("platform")===0)[0];

 retVal.platform = platform.replace("platform","");
 retVal.gender = (checkedIds.indexOf("male")>-1) ? "male" : "female";
 for ( var itm in checkedIds ) {
     if ( checkedIds[itm]!==retVal.gender && checkedIds[itm]!==retVal.media ) {
         retVal.position = checkedIds[itm];
     }
 }

 return retVal;
}

function saveMessages() {
    const msgDiv = Informationals.showBackgroundProcess(polyglot.t("update.messages"));

    const curContent = $contentPane.val();
    if ( curContent.trim().length > 0 ) {
        const msgKey = getMessageKey();
        save( msgKey, curContent );
    }

    const arr = [];
    for ( const k in messages ) {
        arr.push( messages[k] );
    }
    new Playjax(beRoutes)
        .using(function (c) {
            return c.CampaignMgrCtrl.updateMessages(campaignId);
        }).fetch(arr)
        .then( function (res) {
            if (res.ok) {
                msgDiv.success();
                messageChanged = false;
                return true;
            } else {
                msgDiv.dismiss();
                Informationals.makeDanger(polyglot.t("update.failed"), "", 2500).show();
                res.json().then(function(body){
                    console.log(body);
                });
                return false;
            }
        });
}

function parseLoadedData( json ){
    json.forEach( function(msg){
        save( msg, msg.text );
    });
    $contentPane.val( load(getMessageKey()) );
    updateCharacterCount();
}

function loadMessages(){
    Informationals.loader(polyglot.t("loading.messages"));
    new Playjax(beRoutes).using( function(c){
        return c.CampaignMgrCtrl.getMessages(campaignId);

    }).fetch().then( function( res){
        if (res.ok) {
            return res.json();
        } else {
            console.log( res );
            throw new Error(polyglot.t("loading.failed") + ":" + res.status);
        }

    }).then( function(json){
        parseLoadedData(json);

    }).catch( function(err){
        console.log( err );
        Informationals.makeDanger(polyglot.t("loading.failed") + ":" + err, "", 2000).show();

    }).finally( function(){
        Informationals.loader.dismiss();
    });
}

function messageSelectionChanged() {
    const key = getMessageKey();
    twitterMode = (key.platform==="Twitter");
    if ( twitterMode ) {
        $characterCounter.slideDown();
    } else {
        $characterCounter.slideUp();
    }

    if ( curMessageKey ) {
        save( curMessageKey, $contentPane.val() );
    }
    curMessageKey = key;
    $contentPane.val( load(curMessageKey) );
    messageChanged = false;
    updateCharacterCount();
}


window.addEventListener('beforeunload', function (e) {
    if (messageChanged) {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = '';
    }
});

window.onload = function() {
    Promise.prototype.finally = Promise.prototype.finally || {
        finally (fn) {
            const onFinally = cb => Promise.resolve(fn()).then(cb);
            return this.then(
                result => onFinally(() => result),
                reason => onFinally(() => Promise.reject(reason))
            );
        }
    }.finally;
};

const tour = {
    id:"tour",
    steps:[
        {
            "title":polyglot.t("tour.messagesPage.section.title"),
            "content":polyglot.t("tour.messagesPage.section.content"),
            "target":"pageSection_Messages",
            placement:"bottom"
        },
        {
            "title":polyglot.t("tour.messagesPage.messageDestinationSelectors.title"),
            "content":polyglot.t("tour.messagesPage.messageDestinationSelectors.content"),
            "target":"messageDestinationSelectors",
            placement:"left"
        },
        {
            "title":polyglot.t("tour.messagesPage.messageTable.title"),
            "content":polyglot.t("tour.messagesPage.messageTable.content"),
            "target":"messageTable",
            placement:"right"
        },
        {
            "title":polyglot.t("tour.messagesPage.content.title"),
            "content":polyglot.t("tour.messagesPage.content.content"),
            "target":"content",
            placement:"top"
        }
    ],
    showPrevButton: true,
    i18n:{
        nextBtn: polyglot.t("next"),
        prevBtn: polyglot.t("prev"),
        doneBtn: polyglot.t("done")
    }
};