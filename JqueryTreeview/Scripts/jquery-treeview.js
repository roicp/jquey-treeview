(function ($) {
    // this.element -- a jQuery object of the element the widget was invoked on.
    // this.options -- the merged options hash.
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
            baseTag.addClass("roicp-treeview-base-tag");
            baseTag.appendTo(self.element);
        },


        _getChildrenNodes: function (itemId, currentItemDataSource, funcCallback) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Home/GetCategories",
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
            var baseElement = self.element.children(".roicp-treeview-base-tag").first();

            self._createNode(self._treeViewDataSource, baseElement);
        },

        _getChildrenNodesCompleted: function (currentItemDataSource, data) {
            currentItemDataSource.Children = data;
            if (currentItemDataSource.Children != null && currentItemDataSource.Children.length > 0) {
                var baseElement = self.element.find("li[id='" + currentItemDataSource.Id + "']").first();

                var childNodeTag = $("<ul />");
                childNodeTag.addClass("roicp-treeview-child-base-tag");

                self._createNode(currentItemDataSource.Children, childNodeTag);

                childNodeTag.appendTo(baseElement);
            }
        },


        _expandNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();

            self._switchCssClass(currentNode.children(".roicp-treeview-span-expand"));

            self._getChildrenNodes(currentItem.Id, currentItem, self._getChildrenNodesCompleted);
        },

        _collapseNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();

            self._switchCssClass(currentNode.children(".roicp-treeview-span-collapse"));

            currentNode.children("ul").remove();

            currentItem.Children = null;
        },

        _createNode: function (dataSource, baseElement) {
            $.each(dataSource, function () {
                var nodeText = this.Name;
                nodeText += ((this.HasChild) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-expand'>Expand</span>" : "");
                nodeText += ((this.Selectable) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-selectable'>Select</span>" : "");

                var nodeInnerTag = $("<li />");
                nodeInnerTag.html(nodeText).attr("id", this.Id);

                if (this.HasChild) {
                    nodeInnerTag.removeClass("roicp-treeview-nochild-node").addClass("roicp-treeview-expandable-node");
                } else {
                    nodeInnerTag.removeClass("roicp-treeview-expandable-node").addClass("roicp-treeview-nochild-node");
                }

                nodeInnerTag.appendTo(baseElement);
            });

            baseElement.find(".roicp-treeview-span-expand").bind("click", function () {
                self._expandNode($(this).attr("id"));
            });

            baseElement.find(".roicp-treeview-span-selectable").bind("click", function () {
                self._selectNode($(this).attr("id"));
            });
        },

        _switchCssClass: function (workNode) {
            workNode.unbind('click');

            if (workNode.hasClass("roicp-treeview-span-collapse")) {
                workNode.parent().removeClass("roicp-treeview-collapsible-node").addClass("roicp-treeview-expandable-node");
                workNode.removeClass("roicp-treeview-span-collapse").addClass("roicp-treeview-span-expand").html("Expand");

                workNode.bind("click", function () {
                    self._expandNode($(this).attr("id"));
                });
            } else {
                if (workNode.hasClass("roicp-treeview-span-expand")) {
                    workNode.parent().removeClass("roicp-treeview-expandable-node").addClass("roicp-treeview-collapsible-node");
                    workNode.removeClass("roicp-treeview-span-expand").addClass("roicp-treeview-span-collapse").html("Collapse");

                    workNode.bind("click", function() {
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
            return self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
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