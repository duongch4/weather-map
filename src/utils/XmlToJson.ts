import _ from "lodash";
// import Log from "./Log";

// flattens an object (recursively!), similarly to Array#flatten
// e.g. flatten({ a: { b: { c: "hello!" } } }); // => "hello!"
const flatten = (object: any): any => {
    const check = _.isPlainObject(object) && _.size(object) === 1;
    return check ? flatten(_.values(object)[0]) : object;
};

export const getJsonFromXml = (xml: XMLDocument | Element) => {
    const data: any = {};

    const isText: boolean = xml.nodeType === 3;
    const isElement: boolean = xml.nodeType === 1;
    const body = xml.textContent && xml.textContent.trim();
    const hasChildren = xml.children && xml.children.length;
    const hasAttributes = (xml as Element).attributes && (xml as Element).attributes.length;

    // if it's text just return it
    if (isText) {
        return xml.nodeValue?.trim();
    }

    // if it doesn't have any children or attributes, just return the contents
    if (!hasChildren && !hasAttributes) {
        return body;
    }

    // if it doesn't have children but _does_ have body content, we'll use that
    if (!hasChildren && body && body.length) {
        data.text = body;
    }

    // if it's an element with attributes, add them to data.attributes
    if (isElement && hasAttributes) {
        data.attributes = _.reduce((xml as Element).attributes, (obj: any, _name, id) => {
            const attr = (xml as Element).attributes.item(id);
            if (attr) {
                obj[attr.name] = attr.value;
            }
            return obj;
        }, {});
    }

    // recursively call over children, adding results to data
    _.each(xml.children, (child) => {
        const name = child.nodeName;

        // if we've not come across a child with this nodeType, add it as an object
        // and return here
        if (!_.has(data, name)) {
            data[name] = getJsonFromXml(child);
            return;
        }

        // if we've encountered a second instance of the same nodeType, make our
        // representation of it an array
        if (!_.isArray(data[name])) {
            data[name] = [data[name]];
        }

        // and finally, append the new child
        data[name].push(getJsonFromXml(child));
    });

    // if we can, let's fold some attributes into the body
    _.each(data.attributes, (value, key) => {
        if (data[key] !== null) {
            return;
        }
        data[key] = value;
        delete data.attributes[key];
    });

    // if data.attributes is now empty, get rid of it
    if (_.isEmpty(data.attributes)) {
        delete data.attributes;
    }

    // simplify to reduce number of final leaf nodes and return
    return flatten(data);
};
