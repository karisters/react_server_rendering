var React = require('react'),
    _ = require('lodash'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

    // We initialise its state by using the `props` that were passed in when it
    // was first rendered. We also want the button to be disabled until the
    // component has fully mounted on the DOM
    getInitialState: function () {
        return {items: this.items, disabled: true}
    },

    // Once the component has been mounted, we can enable the button
    componentDidMount: function () {
        this.setState({disabled: false})
    },

    children: function () {
        return (
            _.map(this.props.children, function (child, index) {
                return React.createElement(child.name, _.merge(child.props, {key: index}));
            })
        );
    },


    // For ease of illustration, we just use the React JS methods directly
    // (no JSX compilation needed)
    // Note that we allow the button to be disabled initially, and then enable it
    // when everything has loaded
    render: function () {

        return div(null)
    },
})


var loadRemoteComponent = function(component) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        request.onload = function() {
            if(request.status >= 200 && request.status < 400) {
                var remoteComponentSrc = request.responseText;
                window.eval(remoteComponentSrc);
                return resolve({name: eval(component.name), props: component.props || {}});
            } else {
                return reject();
            }
        };

        request.open('GET', component.src);
        request.send();
    });
};

var loadRemoteComponents = function(components) {
    return Promise.all(
        _.map(components, function(component) {
            console.log(component.name, component.src);
            return loadRemoteComponent(component);
        })
    );
};

var loadApp = function(children) {
    React.render(
        React.createElement(MainComponent, {children: children}),
        document.getElementById('main')
    );
};

loadRemoteComponents(remoteComponents)
    .then(loadApp)
    .catch(function(err) {
        console.log("Something went wrong: " + err);
    });