(function ($) {
    $.widget("roicp.treeview", {
        self: null,
        _treeViewDataSource: null,

        options: {
            //treeViewDataSource: null
        },

        _create: function () {
            self = this;
            self._initializeTreeViewBaseTag();
            self._getChildrenNodes(0, null, self._getRootNodesCompleted);
        },

        _initializeTreeViewBaseTag: function () {
            var baseTag = $("<ul />");
            baseTag.addClass("treeview");
            baseTag.appendTo(self.element);
        },


        _getChildrenNodes: function (itemId, currentItemDataSource, funcCallback) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Home/LongGetCategories",
                data: "{ 'upperId':'" + itemId + "' }",
                dataType: "json",
                success: function (data) {
                    funcCallback(currentItemDataSource, data);
                },
                error: function () {
                    alert("An error occurred when trying to obtain the children");
                }
            });
        },


        _getRootNodesCompleted: function (currentItemDataSource, data) {
            self._treeViewDataSource = data;
            var baseElement = self.element.children(".treeview").first();

            self._createNode(self._treeViewDataSource, baseElement);
        },

        _getChildrenNodesCompleted: function (currentItemDataSource, data) {
            currentItemDataSource.Children = data;
            if (currentItemDataSource.Children != null && currentItemDataSource.Children.length > 0) {
                var baseElement = self.element.find("li[id='" + currentItemDataSource.Id + "']").first();

                var childNodeTag = $("<ul />");

                self._createNode(currentItemDataSource.Children, childNodeTag);

                childNodeTag.appendTo(baseElement);
            }
        },


        _expandNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();

            self._switchCssClass(currentNode.children(".span-expand"));

            self._getChildrenNodes(currentItem.Id, currentItem, self._getChildrenNodesCompleted);
        },

        _collapseNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();

            self._switchCssClass(currentNode.children(".span-collapse"));

            currentNode.children("ul").remove();

            currentItem.Children = null;
        },

        _createNode: function (dataSource, baseElement) {
            for (var i = 0; i < dataSource.length; i++) {
                var item = dataSource[i];
                var hitPosition;

                if (dataSource.length == 1) {
                    hitPosition = "hit-single";
                } else {
                    switch (i) {
                        case 0:
                            hitPosition = "hit-first";
                            break;
                        case dataSource.length - 1:
                            hitPosition = "hit-last";
                            break;
                        default:
                            hitPosition = "";
                            break;
                    }
                }





                var nodeText = "";
                nodeText += ((item.HasChild) ? "&nbsp;<span id='" + item.Id + "' class='span-expand hit-area " + hitPosition + "'></span>" : "&nbsp;<span id='" + item.Id + "' class='no-hit-area " + hitPosition + "'></span>");
                nodeText += "&nbsp;<span class='span-node-text'>" + item.Name + "</span>";
                nodeText += ((item.Selectable) ? "&nbsp;<span id='" + item.Id + "' class='span-selectable'>Select</span>" : "");

                var nodeInnerTag = $("<li />");
                nodeInnerTag.html(nodeText).attr("id", item.Id);
                nodeInnerTag.addClass("node-bg-vimage");

                if (item.HasChild) {
                    nodeInnerTag.removeClass("without-child-node").addClass("with-child-node");
                } else {
                    nodeInnerTag.removeClass("with-child-node").addClass("without-child-node");
                }
                
                if (hitPosition == "hit-last" || hitPosition == "hit-single") {
                    nodeInnerTag.removeClass("node-bg-vimage");
                }

                nodeInnerTag.appendTo(baseElement);
            }

            baseElement.find(".span-expand").bind("click", function () {
                self._expandNode($(this).attr("id"));
            });

            baseElement.find(".span-selectable").bind("click", function () {
                self._selectNode($(this).attr("id"));
            });
        },

        _switchCssClass: function (workNode) {
            workNode.unbind('click');

            if (workNode.hasClass("span-collapse")) {
                workNode.removeClass("span-collapse").addClass("span-expand");

                workNode.bind("click", function () {
                    self._expandNode($(this).attr("id"));
                });
            } else {
                if (workNode.hasClass("span-expand")) {
                    workNode.removeClass("span-expand").addClass("span-collapse");

                    workNode.bind("click", function () {
                        self._collapseNode($(this).attr("id"));
                    });
                }
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
                    currentNode = self._findItemInDataSource(item.Children, itemId);

                    if (currentNode != null) {
                        break;
                    }
                }
            }

            return currentNode;
        },

        _selectNode: function (itemNodeId) {
            var item = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            alert(item.Description);
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