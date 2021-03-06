/* jshint esversion:6 */
var partiesList;

var prevPartyData = {};

// returns party data from an
// li element in a jquery.
function getPartyData( $li ) {
    return {
        id: Number($li.find("[name=id]").val()),
        name: $li.find(".partyName")[0].innerText,
        webPage: $li.find(".partyWebPage")[0].innerText,
        isActive: Boolean($li.find("[name=isActive]").val())
    };
}

function setPartyData( $li, data ){
    $li.find("[name=id]")[0].value=data.id;
    $li.find(".partyName")[0].innerText = data.name;
    $li.find(".partyWebPage")[0].innerText = data.webPage;
    $li.find(".partyWebPage").attr("href", data.webPage );
}

function setEditable( $li, shouldBeEditable ) {
    $li.find("div.partyWebPage").attr("contentEditable", shouldBeEditable);
    $li.find("div.partyName").attr("contentEditable", shouldBeEditable);

    if ( shouldBeEditable ) {
        $li.find("[name=saveBtn]").removeClass("hidden");
        $li.find("[name=cancelEditBtn]").removeClass("hidden");
        $li.find("[name=editBtn]").addClass("hidden");

    } else {
        $li.find("[name=saveBtn]").addClass("hidden");
        $li.find("[name=cancelEditBtn]").addClass("hidden");
        $li.find("[name=editBtn]").removeClass("hidden");
    }
}

function editParty(sender) {
    var $parent = $(sender.parentNode);
    var partyData = getPartyData($parent);
    prevPartyData[partyData.id] = partyData;
    setEditable( $parent, true );
}

function visitPartyWebsite(sender) {
    const $parent = $(sender.parentNode);
    const partyData = getPartyData($parent);
    if ( partyData.webPage && partyData.webPage.trim().length > 0  ) {
        window.open( partyData.webPage.trim() );
    } else {
        swal({
            title:polyglot.t("party.noWebsite"),
            icon:"warning",
            buttons: {
                cancel: polyglot.t("cancel"),
                confirm: polyglot.t("party.editData")
            }
        }).then(function(shouldEdit){
            if ( shouldEdit ) {
                editParty(sender);
            }
        });
    }
}

function cancelEdit(sender) {
    var $parent = $(sender.parentNode);
    var partyId = getPartyData($parent).id;
    setEditable( $parent, false );
    if ( prevPartyData[partyId] ) {
        // restore old state
        setPartyData( $parent, prevPartyData[partyId] );

    } else {
        // remove <li>, it's a new party that was never saved.
        sender.parentNode.remove();
    }
}

function deleteParty(id) {
    swal({
        title:polyglot.t("party.delete"),
        icon:"warning",
        buttons: {
            cancel:polyglot.t("cancel"),
            confirm:polyglot.t("confirm")
        }
    }).then( function(willDelete){
        if(willDelete) {
            new Playjax(beRoutes)
                .using(function(c){
                    return c.KnessetMemberCtrl.deleteParty(id);}).fetch()
                .then( function(res){
                    if (res.ok) {
                        document.location.reload();
                    } else {
                        Informationals.makeDanger(polyglot.t("party.failed"), polyglot.t("party.link"), 3000).show();
                    }
                });
        }
    });
}

function addRow(){
    if(!partiesList){
        partiesList = document.createElement('ul');
        partiesList.setAttribute('id', 'partiesList');
        partiesList.classList.add('editableList');
        var div = document.getElementById('partiesCtnr');
        div.appendChild(partiesList);

        $(".card.noData").slideUp();
    }
    var idHidden = createElementWithAttr("input", {"type":"hidden", "name":"id"});
    var isActive = createElementWithAttr("input", {"type":"hidden", "name":"isActive", "value":"true"});
    var partyName = createElementWithAttr("div", {"class":"partyName"});
    var webLink = createElementWithAttr("a", {"href":"", "class":"partyWebPage", "target":"_blank"});
    var cancelIcon = createElementWithAttr("i", {"class": "fa fa-close"});
    var cancelEditButton = createElementWithAttr("button",
        {"type":"button", "name":"cancelEditBtn", "class":"btn btn-sm btn-secondary", "onclick":"cancelEdit(this);"});
    cancelEditButton.appendChild(cancelIcon);

    var saveIcon = createElementWithAttr("i", {"class": "fa fa-save"});
    var saveButton = createElementWithAttr("button",
        {"type":"button", "name":"saveBtn", "class":"btn btn-sm btn-primary", "onclick":"saveParty(this);"});
    saveButton.appendChild(saveIcon);

    var editIcon = createElementWithAttr("i", {"class": "fa fa-edit"});
    var editButton = createElementWithAttr("button",
        {"type":"button", "name":"editBtn", "class":"btn btn-sm btn-default hidden", "onclick":"editParty(this);"});
    editButton.appendChild(editIcon);

    var deleteIcon = createElementWithAttr("i", {"class": "fa fa-trash"});
    var deleteButton = createElementWithAttr("button",
        {"type":"button", "name":"deleteBtn", "class":"btn btn-sm btn-danger hidden"});
    deleteButton.appendChild(deleteIcon);

    var liElements = [idHidden, isActive, partyName, webLink, editButton, cancelEditButton, saveButton, deleteButton];
    var li = document.createElement("li");
    for (var i = 0; i < liElements.length; i++) {
        li.appendChild(liElements[i]);
        li.appendChild(createFiller());
    }
    partiesList.appendChild(li);
    setPartyData($(li), {id:0, name:"name", webPage:"http://party.org.il"});
    setEditable($(li),true);
}
function createFiller() {
    return document.createTextNode("\n                 ");
}
function createElementWithAttr(name, attr) {
    var emt = document.createElement(name);
    Object.keys(attr).forEach(function(key) {
        emt.setAttribute(key, attr[key]);
    });
    return emt;
}

function saveParty(sender) {
    var $parentLi = $(sender.parentNode);
    var data = getPartyData($parentLi);
    setEditable($parentLi, false);
    patch(data, sender);
}

function patch(data, sender) {
    var msgDiv = Informationals.showBackgroundProcess(polyglot.t("update.party"));
    var $parent = $(sender.parentNode);
    new Playjax(beRoutes)
        .using(function (c) {
            return c.KnessetMemberCtrl.updateParty();
        })
        .fetch(data)
        .then( function (res) {
            if (res.ok) {
                msgDiv.success();
                res.json().then(function (json){
                    setPartyData($parent, json);
                    prevPartyData[json.id]=undefined;
                    $parent.find("[name=deleteBtn]").slideDown();
                });

            } else {
                msgDiv.dismiss();
                Informationals.makeWarning(polyglot.t("update.failed"), "", 1500);
                setPartyData($parent, prevPartyData[data.id]);
            }
        });
}

$(document).ready( function() {
    partiesList = document.getElementById("partiesList");
});