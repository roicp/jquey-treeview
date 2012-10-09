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
            self._initializeTreeViewDataSourceWithRoots();
        },

        _initializeTreeViewBaseTag: function () {
            var baseTag = $("<ul />");
            baseTag.addClass("roicp-treeview-base-tag");
            baseTag.appendTo(self.element);
        },

        _initializeTreeViewDataSourceWithRoots: function () {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/Home/GetCategories",
                data: "{ 'upperId':'0' }",
                dataType: "json",
                success: function (data) {
                    self._treeViewDataSource = data;
                    self._initializeTreeViewRootNodes();
                },
                error: function () {
                    alert("An error occurred when trying to obtain the roots");
                }
            });
        },

        _initializeTreeViewRootNodes: function () {
            var baseElement = self.element.children(".roicp-treeview-base-tag").first();

            $.each(self._treeViewDataSource, function () {
                var nodeText = this.Name;
                nodeText += ((this.HasChild) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-expand'>Expand</span>" : "");
                nodeText += ((this.Selectable) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-selectable'>Select</span>" : "");

                var rootNodeTag = $("<li />");
                rootNodeTag.html(nodeText);
                rootNodeTag.addClass("roicp-treeview-root-node").attr("id", this.Id).appendTo(baseElement);
            });

            baseElement.find(".roicp-treeview-span-expand").bind("click", function () {
                self._expandNode($(this).attr("id"));
            });

            baseElement.find(".roicp-treeview-span-selectable").bind("click", function () {
                self._selectNode($(this).attr("id"));
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
                    self._expandNodeGetNodeChildrenCompleted(currentNode);
                },
                error: function () {
                    alert("An error occurred when trying to obtain the children");
                }
            });
        },

        _expandNodeGetNodeChildrenCompleted: function (currentNode) {
            if (currentNode.Children != null && currentNode.Children.length > 0) {
                var baseElement = self.element.find("li[id='" + currentNode.Id + "']").first();


                var childNodeTag = $("<ul />");
                childNodeTag.addClass("roicp-treeview-child-base-tag");

                $.each(currentNode.Children, function () {
                    var nodeText = this.Name;
                    nodeText += ((this.HasChild) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-expand'>Expand</span>" : "");
                    nodeText += ((this.Selectable) ? "&nbsp;<span id='" + this.Id + "' class='roicp-treeview-span-selectable'>Select</span>" : "");

                    var childNodeInnerTag = $("<li />");
                    childNodeInnerTag.html(nodeText);
                    childNodeInnerTag.addClass("roicp-treeview-child-node").attr("id", this.Id).appendTo(childNodeTag);
                });

                childNodeTag.appendTo(baseElement);


                baseElement.find(".roicp-treeview-span-expand").bind("click", function () {
                    self._expandNode($(this).attr("id"));
                });

                baseElement.find(".roicp-treeview-span-selectable").bind("click", function () {
                    self._selectNode($(this).attr("id"));
                });
            }
        },

        _expandNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();
            

            currentNode.children(".roicp-treeview-span-expand").unbind('click');

            currentNode.children(".roicp-treeview-span-expand").removeClass("roicp-treeview-span-expand").addClass("roicp-treeview-span-collapse").html("Collapse");

            currentNode.children(".roicp-treeview-span-collapse").bind("click", function () {
                self._collapseNode($(this).attr("id"));
            });


            self._getChildrenNodes(currentItem);
        },

        _collapseNode: function (itemNodeId) {
            var currentItem = self._findItemInDataSource(self._treeViewDataSource, itemNodeId);
            var currentNode = self.element.find("li[id='" + currentItem.Id + "']").first();

            currentNode.children(".roicp-treeview-span-collapse").unbind('click');

            currentNode.children(".roicp-treeview-span-collapse").removeClass("roicp-treeview-span-collapse").addClass("roicp-treeview-span-expand").html("Expand");
            currentNode.children("ul").remove();

            currentItem.Children = null;
            

            currentNode.children(".roicp-treeview-span-expand").bind("click", function () {
                self._expandNode($(this).attr("id"));
            });
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
            return self._findItemInDataSource(_treeViewDataSource, itemNodeId);
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