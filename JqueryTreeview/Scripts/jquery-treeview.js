(function ($) {
    // this.element -- a jQuery object of the element the widget was invoked on.
    // this.options -- the merged options hash.
    $.widget("roicp_js.treeview", {
        _thisWidget: null,
        _treeViewDataSource: null,
        
        options: {
            //treeViewDataSource: null
        },

        _create: function () {
            _thisWidget = this;
            _thisWidget._initializeTreeViewBaseTag();
            _thisWidget._initializeTreeViewDataSourceWithRoots();
        },

        _initializeTreeViewBaseTag: function () {
            var baseTag = $("<ul />");
            baseTag.addClass("base_tag");
            baseTag.appendTo(_thisWidget.element);
        },

        _initializeTreeViewDataSourceWithRoots: function () {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Home/GetCategories",
                data: "{ 'upperId':'0' }",
                dataType: "json",
                success: function (data) {
                    _thisWidget._treeViewDataSource = data;
                    _thisWidget._initializeTreeViewRootNodes();
                },
                error: function () {
                    alert("An error occurred when trying to obtain the roots");
                }
            });
        },

        _initializeTreeViewRootNodes: function () {
            $.each(_thisWidget._treeViewDataSource, function () {
                var nodeText = this.Name;
                nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
                nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='selectable'>Select</a></span>" : "");

                var rootNodeTag = $("<li />");
                rootNodeTag.html(nodeText);
                rootNodeTag.addClass("root_node").attr("id", this.Id).appendTo(_thisWidget.element.children(".base_tag").first());
            });
        },

        _getChildrenNodes: function (currentNode) {
            currentNode.Children = null;

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Home/GetCategories",
                data: "{ 'upperId':'" + currentNode.Id + "' }",
                dataType: "json",
                success: function (data) {
                    currentNode.Children = data;
                    _thisWidget._expandNodeGetNodeChildrenCompleted(currentNode);
                },
                error: function () {
                    alert("An error occurred when trying to obtain the children");
                }
            });
        },

        _expandNodeGetNodeChildrenCompleted: function (currentNode) {
            if (currentNode.Children != null && currentNode.Children.length > 0) {
                var childNodeTag = $("<ul />");
                childNodeTag.addClass("child_base_tag");

                $.each(currentNode.Children, function () {
                    var nodeText = this.Name;
                    nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
                    nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='select'>Select</a></span>" : "");

                    var childNodeInnerTag = $("<li />");
                    childNodeInnerTag.html(nodeText);
                    childNodeInnerTag.addClass("child_node").attr("id", this.Id).appendTo(childNodeTag);
                });
                
                childNodeTag.appendTo(_thisWidget.element.find("li[id='" + currentNode.Id + "']").first());
            }
        },

        _expandNode: function (itemNodeId) {
            var currentItem = _thisWidget._findItemInDataSource(_treeViewDataSource, itemNodeId);

            var currentNode = _thisWidget.element.find("li[id='" + currentItem.Id + "']").first();
            currentNode.children(".span_expand").html("<a href='javascript:collapseNode(" + currentItem.Id + ")' alt='collapsible'>Collapse</a>");

            _thisWidget._getChildrenNodes(currentItem);
        },

        _collapseNode: function (itemNodeId) {
            var currentItem = _thisWidget._findItemInDataSource(_treeViewDataSource, itemNodeId);

            var currentNode = _thisWidget.element.find("li[id='" + currentItem.Id + "']").first();
            currentNode.children(".span_expand").html("<a href='javascript:expandNode(" + currentItem.Id + ")' alt='expandable'>Expand</a>");
            currentNode.children("ul").remove();

            if (currentItem.Children != null && currentItem.Children.length > 0) {
                currentItem.Children = null;
            }
        },

        _findItemInDataSource: function (dataSource, itemId) {
            var currentNode = null;

            for (var i = 0; i < dataSource.length; i++) {
                var item = dataSource[i];

                if (item.Id == itemId) {
                    currentNode = item;
                    break;
                }

                if (item.Children != null && item.Children.length > 0) {
                    currentNode = _thisWidget._findItemInDataSource(item.Children, itemId);

                    if (currentNode != null) {
                        break;
                    }
                }
            }

            return currentNode;
        },

        _selectNode: function (itemNodeId) {
            return _thisWidget._findItemInDataSource(_treeViewDataSource, itemNodeId);
        },

        _setOption: function (key, value) {
            // Use the _setOption method to respond to changes to options
            switch (key) {
                case "length":
                    break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        destroy: function () {
            // Use the destroy method to reverse everything your plugin has applied
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);


//var treeViewDataSource;
//var treeViewContainer;

//$(document).ready(function () {
//    treeViewContainer = $(".build_tree_here");
//    initializeTreeViewBaseTag();
//    initializeTreeViewDataSourceWithRoots();
//});

//function initializeTreeViewBaseTag() {
//    var baseTag = $("<ul />");
//    baseTag.addClass("base_tag");
//    baseTag.appendTo(treeViewContainer);
//}

//function initializeTreeViewRootNodes() {
//    $.each(treeViewDataSource, function () {
//        var nodeText = this.Name;
//        nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
//        nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='selectable'>Select</a></span>" : "");

//        var rootNodeTag = $("<li />");
//        rootNodeTag.html(nodeText);
//        rootNodeTag.addClass("root_node").attr("id", this.Id).appendTo(treeViewContainer.children(".base_tag").first());
//    });
//}

//function expandNode(itemNodeId) {
//    var currentItem = findItemInDataSource(treeViewDataSource, itemNodeId);

//    var currentNode = treeViewContainer.find("li[id='" + currentItem.Id + "']").first();
//    currentNode.children(".span_expand").html("<a href='javascript:collapseNode(" + currentItem.Id + ")' alt='collapsible'>Collapse</a>");

//    getChildrenNodes(currentItem);
//}

//function collapseNode(itemNodeId) {
//    var currentItem = findItemInDataSource(treeViewDataSource, itemNodeId);

//    var currentNode = treeViewContainer.find("li[id='" + currentItem.Id + "']").first();
//    currentNode.children(".span_expand").html("<a href='javascript:expandNode(" + currentItem.Id + ")' alt='expandable'>Expand</a>");
//    currentNode.children("ul").remove();

//    if (currentItem.Children != null && currentItem.Children.length > 0) {
//        currentItem.Children = null;
//    }
//}

//function selectNode(itemNodeId) {
//    return findItemInDataSource(treeViewDataSource, itemNodeId);
//}

//function findItemInDataSource(dataSource, itemId) {
//    var currentNode = null;

//    for (var i = 0; i < dataSource.length; i++) {
//        var item = dataSource[i];

//        if (item.Id == itemId) {
//            currentNode = item;
//            break;
//        }

//        if (item.Children != null && item.Children.length > 0) {
//            currentNode = findItemInDataSource(item.Children, itemId);

//            if (currentNode != null) {
//                break;
//            }
//        }
//    }

//    return currentNode;
//}

//function expandNodeGetNodeChildrenCompleted(currentNode) {
//    if (currentNode.Children != null && currentNode.Children.length > 0) {
//        var childNodeTag = $("<ul />");
//        childNodeTag.addClass("child_base_tag");

//        $.each(currentNode.Children, function () {
//            var nodeText = this.Name;
//            nodeText += ((this.HasChild) ? "&nbsp;<span class='span_expand'><a href='javascript:expandNode(" + this.Id + ")' alt='expandable'>Expand</a></span>" : "");
//            nodeText += ((this.Selectable) ? "&nbsp;<span class='span_selectable'><a href='javascript:selectNode(" + this.Id + ")' alt='select'>Select</a></span>" : "");

//            var childNodeInnerTag = $("<li />");
//            childNodeInnerTag.html(nodeText);
//            childNodeInnerTag.addClass("child_node").attr("id", this.Id).appendTo(childNodeTag);
//        });

//        childNodeTag.appendTo(treeViewContainer.find("li[id='" + currentNode.Id + "']").first());
//    }
//}

//function initializeTreeViewDataSourceWithRoots() {
//    $.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: "/Home/GetCategories",
//        data: "{ 'upperId':'0' }",
//        dataType: "json",
//        success: function (data) {
//            treeViewDataSource = data;
//            initializeTreeViewRootNodes();
//        },
//        error: function () {
//            alert("an error ocurred");
//        }
//    });
//}

//function getChildrenNodes(currentNode) {
//    currentNode.Children = null;

//    $.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: "/Home/GetCategories",
//        data: "{ 'upperId':'" + currentNode.Id + "' }",
//        dataType: "json",
//        success: function (data) {
//            currentNode.Children = data;
//            expandNodeGetNodeChildrenCompleted(currentNode);
//        },
//        error: function () {
//            alert("an error ocurred");
//        }
//    });
//}