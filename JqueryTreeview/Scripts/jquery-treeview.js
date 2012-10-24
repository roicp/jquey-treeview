(function ($) {
    $.widget("roicp.treeview", {
        mySelf: null,
        executeExpandPaths: false,
        countExpandPaths: 0,

        options: {
            source: null,
            pathsToExpand: null,

            // callbacks
            onCompleted: null,
            onNodeExpanded: null,
            onNodeColapsed: null,
            onNodeCreated: null
        },

        _create: function () {
            executeExpandPaths = true;
            mySelf = this;

            mySelf._getChildrenNodes(0, mySelf.element, mySelf._getChildrenNodesCompleted);
        },

        _getChildrenNodes: function (itemId, baseElement, funcCallback) {
            if (typeof mySelf.options.source === "string") {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: mySelf.options.source,
                    data: "{ 'upperId':'" + itemId + "' }",
                    dataType: "json",
                    success: function (data) {
                        funcCallback(itemId, baseElement, data);
                    },
                    error: function () {
                        alert("An error occurred when trying to obtain the nodes");
                    }
                });
            };
        },

        _getChildrenNodesCompleted: function (itemId, parentElement, data) {
            if (data != null && data.length > 0) {
                var childTreeTag = $("<ul />");
                childTreeTag.addClass("treeview");

                mySelf._createNode(data, childTreeTag);

                childTreeTag.appendTo(parentElement);

                mySelf._trigger("onCompleted", null, {});

                if (executeExpandPaths) {
                    mySelf._expandNodesInExpandPaths(mySelf.options.pathsToExpand);
                }
            }
        },

        _expandNode: function (itemNodeId) {
            var currentNode = mySelf.element.find("li[id='" + itemNodeId + "']").first();

            mySelf._switchCssClass(currentNode.children(".span-expand"));

            mySelf._getChildrenNodes(itemNodeId, currentNode, mySelf._getChildrenNodesCompleted);

            mySelf._trigger("onNodeExpanded", null, {});
        },

        _collapseNode: function (itemNodeId) {
            var currentNode = mySelf.element.find("li[id='" + itemNodeId + "']").first();

            mySelf._switchCssClass(currentNode.children(".span-collapse"));

            currentNode.children("ul").remove();

            mySelf._trigger("onNodeColapsed", null, {});
        },

        _createNode: function (dataSource, parentElement) {
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

                // Create the base node li tag
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

                // Create the span hit area (where the plus and minus sign appears)
                var nodeSpanHit = $("<span />");
                nodeSpanHit.attr("id", item.Id);
                nodeSpanHit.addClass("no-hit-area");

                if (item.HasChild) {
                    nodeSpanHit.removeClass("no-hit-area").addClass("span-expand").addClass("hit-area");

                    nodeSpanHit.bind("click", function () {
                        executeExpandPaths = false;
                        mySelf._expandNode($(this).attr("id"));
                    });
                }

                nodeSpanHit.addClass(hitPosition);
                nodeSpanHit.appendTo(nodeInnerTag);

                // Create a span to be used as a render node container.
                // The content of this container could be overridden by a custom _renderItem method.
                var spanText = $("<span />");
                spanText.addClass("span-node-render-container");
                spanText.data("treeview-render-container-item", item);
                mySelf._renderItem(spanText, item);
                spanText.appendTo(nodeInnerTag);

                // Attaching the new node to the parent element
                nodeInnerTag.appendTo(parentElement);

                mySelf._trigger("onNodeCreated", null, {});
            }
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
                    executeExpandPaths = false;
                    mySelf._expandNode($(this).attr("id"));
                });
            } else {
                if (workNode.hasClass("span-expand")) {
                    workNode.removeClass("span-expand").addClass("span-collapse");

                    workNode.bind("click", function () {
                        mySelf._collapseNode($(this).attr("id"));
                    });
                }
            }
        },

        _expandNodesInExpandPaths: function (itens) {
            if ($.isArray(itens)) {
                for (var i = 0; i < itens.length; i++) {
                    if ($.isArray(itens[i])) {
                        mySelf._expandNodesInExpandPaths(itens[i]);
                    } else {
                        var currentNode = mySelf.element.find("li[id='" + itens[i] + "']").first();

                        if ($(itens).last()[0] != itens[i]) {
                            if (currentNode.children(".span-expand").length > 0) {
                                mySelf._expandNode(itens[i]);
                            }
                        } else {
                            $(currentNode.children(".span-node-render-container")[0]).effect("highlight", {}, 1500);
                        }
                    }
                };

                //$(itens).each(function () {
                //    if ($.isArray(this)) {
                //        mySelf._expandNodesInExpandPaths(this);
                //    } else {
                //        var currentNode = mySelf.element.find("li[id='" + this + "']").first();

                //        if ($(itens).last()[0] != this) {
                //            if (currentNode.children(".span-expand").length > 0) {
                //                mySelf._expandNode(this);
                //            }
                //        } else {
                //            $(currentNode.children(".span-node-render-container")[0]).effect("highlight", {}, 1500);
                //            mySelf.countExpandPaths++;
                //            alert(mySelf.countExpandPaths);
                //        }
                //    }
                //});
            }
        },

        _setOption: function (key, value) {
            mySelf._super(key, value);

            if (key === "source") {
                mySelf._getChildrenNodes(0, mySelf.element, mySelf._getChildrenNodesCompleted);
            }

            if (key === "expandPaths") {
                mySelf._expandNodesInExpandPaths(mySelf.options.expandPaths);
            }
        },

        destroy: function () {
            mySelf.element.html("");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);