(function ($) {
    $.widget("roicp.treeview", {
        self: null,
        _treeViewDataSource: null,

        options: {
            source: null
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
            if (typeof this.options.source === "string") {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: self.options.source,
                    data: "{ 'upperId':'" + itemId + "' }",
                    dataType: "json",
                    success: function (data) {
                        funcCallback(currentItemDataSource, data);
                    },
                    error: function () {
                        alert("An error occurred when trying to obtain the nodes");
                    }
                });
            };
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

                var nodeInnerTag = $("<li />");
                nodeInnerTag.attr("id", item.Id);
                nodeInnerTag.addClass("node-bg-vimage");
                nodeInnerTag.addClass("without-child-node");

                if (item.HasChild) {
                    nodeInnerTag.removeClass("without-child-node").addClass("with-child-node");
                }

                if (hitPosition == "hit-last" || hitPosition == "hit-single") {
                    nodeInnerTag.removeClass("node-bg-vimage");
                }


                var nodeSpanHit = $("<span />");
                nodeSpanHit.attr("id", item.Id);
                nodeSpanHit.addClass("no-hit-area");

                if (item.HasChild) {
                    nodeSpanHit.removeClass("no-hit-area").addClass("span-expand").addClass("hit-area");
                }
                
                nodeSpanHit.addClass(hitPosition);
                nodeSpanHit.appendTo(nodeInnerTag);

                var spanText = $("<span />");
                spanText.data("roicp-treeview-item", item);
                self._renderItem(spanText, item);
                spanText.appendTo(nodeInnerTag);

                nodeInnerTag.appendTo(baseElement);
            }

            baseElement.find(".span-expand").bind("click", function () {
                self._expandNode($(this).attr("id"));
            });

            baseElement.find(".span-selectable").bind("click", function () {
                self._selectNode($(this).attr("id"));
            });
        },

        _renderItem: function (spanText, item) {
            var spanName = $("<span />");
            spanName.addClass("span-node-text");
            spanName.html(item.Name);
            spanName.appendTo(spanText);
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

        _setOption: function (key, value) {
            self._super(key, value);
            if (key === "source") {
                self._getChildrenNodes(0, null, self._getRootNodesCompleted);
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);