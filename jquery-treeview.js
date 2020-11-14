const Treeview = function (containerElement, settings) {
    'use strict';

    let options;
    let baseListElement;

    function _init() {
        options = settings;

        containerElement.classList.add('treeview');
        containerElement.dataset.treeview = 'container';

        baseListElement = document.createElement('ul');
        containerElement.append(baseListElement);

        _loadData();
    }

    function _loadData() {
        fetch(options.sourceUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response was not ok: ${response.status} (${response.statusText})`);
                }

                return response.json();
            })
            .then(data => {
                try {
                    _buildTreeNodes(data, baseListElement);
                } catch (error) {
                    console.error('Build treenode:', error);
                }
            })
            .catch(error => {
                console.error('Load Data Error:', error);
            });
    }

    function _buildTreeNodes(data, listElement) {
        if (Array.isArray(data)) {
            const dataLength = data.length;

            data.forEach((item, idx) => {
                let hitPosition;

                if (dataLength == 1) {
                    hitPosition = "hit-single";
                } else {
                    switch (idx) {
                        case 0:
                            hitPosition = "hit-first";
                            break;
                        case dataLength - 1:
                            hitPosition = "hit-last";
                            break;
                    }
                }

                _createNode(item, listElement, hitPosition);
            });
        } else {
            _createNode(data, listElement, "hit-single");
        }
    }

    function _createNode(value, parentNode, hitPosition) {
        const currentNode = document.createElement('li');
        currentNode.classList.add('node-bg-vimage');
        // currentNode.dataset.item = JSON.stringify(value);
        currentNode.dataset.treeviewNodeId = value.id;
        currentNode.dataset.treeview = 'node';
        currentNode.innerHTML = value.name;
        parentNode.append(currentNode);

        const nodeHitArea = document.createElement('span');
        currentNode.append(nodeHitArea);

        if (hitPosition) {
            nodeHitArea.classList.add(hitPosition);
        }

        if (hitPosition === "hit-last" || hitPosition === "hit-single") {
            currentNode.classList.remove('node-bg-vimage');
        }

        if (value.children && value.children.length > 0) {
            nodeHitArea.classList.add('hit-area');

            const childList = document.createElement('ul');
            currentNode.append(childList);

            _buildTreeNodes(value.children, childList);
        } else {
            nodeHitArea.classList.add('no-hit-area');
        }
    }

    _init();

    return {
    };
};
