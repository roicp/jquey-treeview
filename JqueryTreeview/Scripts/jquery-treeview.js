var treeViewDataSource;
var treeViewContainer;

$(document).ready(function () {
    treeViewContainer = $(".build_tree_here");
    initializeTreeViewBaseTag();
    initializeTreeViewDataSourceWithRoots();
});

function initializeTreeViewBaseTag() {
    var baseTag = $("<ul />");
    baseTag.addClass("base_tag");
    baseTag.appendTo(treeViewContainer);
}

function initializeTreeViewRootNodes() {
    $.each(treeViewDataSource, function (index) {
        var nodeText = this.Name;
        nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
        nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='select'>Select</a></span>" : "");

        var rootNodeTag = $("<li />");
        rootNodeTag.html(nodeText);
        rootNodeTag.addClass("root_node").attr("id", this.Id).appendTo(treeViewContainer.children(".base_tag").first());
    });
}

function expandNode(itemNodeId) {
    var currentItem = findItemInDataSource(treeViewDataSource, itemNodeId);
    
    var currentNode = treeViewContainer.find("li[id='" + currentItem.Id + "']").first();
    currentNode.children(".span_expand").html("<a href='javascript:collapseNode(" + currentItem.Id + ")' alt='collapsible'>Collapse</a>");
    
    getNodeChildren(currentItem);
}

function findItemInDataSource(dataSource, itemId) {
    var currentNode = null;

    for (var i = 0; i < dataSource.length; i++) {
        var item = dataSource[i];
        
        if (item.Id == itemId) {
            currentNode = item;
            break;
        }

        if (item.Children != null && item.Children.length > 0) {
            currentNode = findItemInDataSource(item.Children, itemId);
            
            if (currentNode != null) {
                break;
            }
        }
    }

    return currentNode;
}

function expandNodeGetNodeChildrenCompleted(currentNode) {
    if (currentNode.Children != null && currentNode.Children.length > 0) {
        var childNodeTag = $("<ul />");
        childNodeTag.addClass("child_base_tag");

        $.each(currentNode.Children, function (index) {
            var nodeText = this.Name;
            nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
            nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='select'>Select</a></span>" : "");

            var childNodeInnerTag = $("<li />");
            childNodeInnerTag.html(nodeText);
            childNodeInnerTag.addClass("child_node").attr("id", this.Id).appendTo(childNodeTag);
        });

        childNodeTag.appendTo(treeViewContainer.find("li[id='" + currentNode.Id + "']").first());
    }
}

function initializeTreeViewDataSourceWithRoots() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/GetCategories",
        data: "{ 'upperId':'0' }",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            treeViewDataSource = data;
            initializeTreeViewRootNodes();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("an error ocurred");
        }
    });
}

function getNodeChildren(currentNode) {
    currentNode.Children = null;

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/GetCategories",
        data: "{ 'upperId':'" + currentNode.Id + "' }",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            currentNode.Children = data;
            expandNodeGetNodeChildrenCompleted(currentNode);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("an error ocurred");
        }
    });
}