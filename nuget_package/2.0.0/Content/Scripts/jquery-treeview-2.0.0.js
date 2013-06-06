var Treeview = (function () {
    function treeview(element, options) {
        this.myObject = $(element);
        this.options = options;

        this.myObject.empty();

        this.renderItem = this.options.renderItem || this.renderItem;
        this.getChildrenNodes = this.options.getChildrenNodes || this.getChildrenNodes;
        this.getChildrenNodes(0, this.myObject, $.proxy(this.getChildrenNodesCompleted, this));
    }

    treeview.prototype = {
        getChildrenNodes: function (itemId, baseElement, funcCallback) {
            if (typeof this.options.sourceUrl === "string") {
                $.ajax({
                    type: this.options.ajaxVerb,
                    contentType: "application/json; charset=utf-8",
                    url: this.options.sourceUrl,
                    data: "{ 'upperId':'" + itemId + "' }",
                    dataType: "json",
                    success: function (data) {
                        funcCallback(itemId, baseElement, data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        console("An error occurred when trying to obtain the nodes\n\njqXhr>" + jqXhr + "\n\ntextStatus>" + textStatus + "\n\nerrorThrown>" + errorThrown);
                    }
                });
            };
        },

        getChildrenNodesCompleted: function (itemId, parentElement, data) {
            if (data != null && data.length > 0) {
                var childTreeTag = $("<ul />").addClass("treeview").appendTo(parentElement);

                this.createNode(data, childTreeTag);

                if (this.options.onCompleted)
                    this.options.onCompleted(childTreeTag, this.myObject);
            }
        },

        expandNode: function (itemNodeId) {
            var currentNode = this.myObject.find("li[id='" + itemNodeId + "']").first();

            this.switchCssClass(currentNode.children(".scontainer-expand"));

            this.getChildrenNodes(itemNodeId, currentNode, $.proxy(this.getChildrenNodesCompleted, this));

            if (this.options.onNodeExpanded)
                this.options.onNodeExpanded(this.myObject);
        },

        collapseNode: function (itemNodeId) {
            var currentNode = this.myObject.find("li[id='" + itemNodeId + "']").first();

            this.switchCssClass(currentNode.children(".scontainer-collapse"));

            currentNode.children("ul").remove();

            if (this.options.onNodeColapsed)
                this.options.onNodeColapsed(this.myObject);
        },

        renderItem: function (spanText, item) {
            var spanName = $("<span />");
            spanName.addClass("scontainer-node-text");
            spanName.html(item.Name);
            spanName.appendTo(spanText);
        },

        switchCssClass: function (workNode) {
            workNode.off('click');

            var mySelf = this;
            if (workNode.hasClass("scontainer-collapse")) {
                workNode.removeClass("scontainer-collapse").addClass("scontainer-expand");

                workNode.click(function () {
                    mySelf.expandNode($(this).attr("id"));
                });
            } else {
                if (workNode.hasClass("scontainer-expand")) {
                    workNode.removeClass("scontainer-expand").addClass("scontainer-collapse");

                    workNode.click(function () {
                        mySelf.collapseNode($(this).attr("id"));
                    });
                }
            }
        },

        createNode: function (dataSource, parentElement) {
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
                    nodeSpanHit.removeClass("no-hit-area").addClass("scontainer-expand").addClass("hit-area");

                    var mySelf = this;
                    nodeSpanHit.click(function () {
                        mySelf.expandNode($(this).attr("id"));
                    });
                }

                nodeSpanHit.addClass(hitPosition);
                nodeSpanHit.appendTo(nodeInnerTag);

                // Create a span to be used as a render node container.
                // The content of this container could be overridden by a custom _renderItem method.
                var spanText = $("<span />");
                spanText.addClass("scontainer-node-render-container");
                spanText.data("treeview-render-container-item", item);
                this.renderItem(spanText, item);
                spanText.appendTo(nodeInnerTag);

                // Attaching the new node to the parent element
                nodeInnerTag.appendTo(parentElement);

                if (this.options.onNodeCreated)
                    this.options.onNodeCreated(nodeInnerTag, parentElement, this.myObject);
            }
        }
    };

    return treeview;
})();

(function ($) {
    $.fn.treeview = function (options) {
        var opts = $.extend({
            sourceUrl: "",
            ajaxVerb: "GET",
            onCompleted: null,
            onNodeExpanded: null,
            onNodeColapsed: null,
            onNodeCreated: null,
            renderItem: null,
            getChildrenNodes: null
        }, options);

        this.each(function () {
            return new Treeview(this, opts);
        });
    };
})(jQuery);