import React from 'react';
import { Node, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

import { mergeAttributes } from '@tiptap/core';

export default Node.create({
    name: 'variableComponent',
    group: 'inline',
    inline: true,
    content: 'text*',
    whitespace: 'pre',
    atom: true,
    addAttributes() {
        return {
            text: {
                default: '',
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'variable-component',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['variable-component', mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});

const Component = (props: {
    node: {
        attrs: {
            text: string;
        };
    };
}) => {
    return (
        <NodeViewWrapper contentEditable={false} className="variable-component inline font-semibold text-black">
            {'{'}
            <span contentEditable={false} className="content inline text-primary-600">
                {props.node.attrs.text}
            </span>
            {'}'}
        </NodeViewWrapper>
    );
};
