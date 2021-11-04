const ReactDom = {
    render: (reactElement, container)=>{
        // Check if reactElement is string or number (leaf element with simple text as children)
        if (typeof reactElement === 'number' || typeof reactElement === 'string') {
            container.appendChild(document.createTextNode(String(reactElement)));
            return;
        }
        const domElement = document.createElement(reactElement.tag);
        // fulfill element with props
        if (reactElement.props) Object.keys(reactElement.props).filter((p)=>p !== 'children'
        ).forEach((p)=>domElement[p] = reactElement.props[p]
        );
        // recursivly render each child element in parent
        if (reactElement.props.children) reactElement.props.children.forEach((child)=>ReactDom.render(child, domElement)
        );
        container.appendChild(domElement);
    }
};
const React = {
    createElement: (tag, props, ...children)=>{
        if (typeof tag === 'function') {
            const component = tag(props);
            return component;
        }
        const element = {
            tag,
            props: {
                ...props,
                children
            }
        };
        console.log('ELEM', element);
        return element;
    }
};
const App = ()=>/*#__PURE__*/ React.createElement("div", {
        className: "react-hehehe",
        __source: {
            fileName: "index.tsx",
            lineNumber: 46
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("h1", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 47
        },
        __self: this
    }, "Hello, world!"), /*#__PURE__*/ React.createElement("p", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 48
        },
        __self: this
    }, "Lorem ipsum dolor sit amet."), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "name",
        __source: {
            fileName: "index.tsx",
            lineNumber: 49
        },
        __self: this
    }))
;
ReactDom.render(/*#__PURE__*/ React.createElement(App, {
    __source: {
        fileName: "index.tsx",
        lineNumber: 53
    },
    __self: this
}), document.getElementById('root'));

//# sourceMappingURL=index.fe4db618.js.map
