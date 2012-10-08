var treeViewDataSource;
var treeViewContainer;

$(document).ready(function () {
    treeViewContainer = $(".build_tree_here");
    initializeTreeViewDataSource();
    initializeTreeViewBaseTag();
    initializeTreeViewRootNodes();
});

function initializeTreeViewBaseTag() {
    var baseTag = $("<ul />");
    baseTag.addClass("base_tag");
    baseTag.appendTo(treeViewContainer);
}

function initializeTreeViewRootNodes() {
    var rootNodeTag = $("<li />");
    rootNodeTag.addClass("root_node").appendTo(treeViewContainer);
}

function initializeTreeViewDataSource() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/GetCategories",
        data: "{ 'upperId':'0' }",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            treeViewDataSource = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("an error ocurred");
        }
    });
}