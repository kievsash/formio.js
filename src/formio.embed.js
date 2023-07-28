import { Formio } from './Embed';
const scripts = document.getElementsByTagName('script');
const config = window.FormioConfig || {};
let thisScript = null;
let i = scripts.length;
const scriptName = config.scriptName || 'formio.embed.';
while (i--) {
    if (
        scripts[i].src && (scripts[i].src.indexOf(scriptName) !== -1)
    ) {
        thisScript = scripts[i];
        break;
    }
}

if (thisScript) {
    const query = {};
    const queryString = thisScript.src.replace(/^[^?]+\??/, '');
    queryString.replace(/\?/g, '&').split('&').forEach((item) => {
        query[item.split('=')[0]] = item.split('=')[1] && decodeURIComponent(item.split('=')[1]);
    });

    let scriptSrc = thisScript.src.replace(/^([^?]+).*/, '$1').split('/');
    scriptSrc.pop();
    if (config.formioPath) {
        config.formioPath(scriptSrc);
    }
    scriptSrc = scriptSrc.join('/');
    Formio.config = Object.assign({
        script: query.script || (`${Formio.config.updatePath ? Formio.config.updatePath() : scriptSrc}/formio.form.min.js`),
        style: query.styles || (`${Formio.config.updatePath ? Formio.config.updatePath() : scriptSrc}/formio.form.min.css`),
        cdn: query.cdn,
        class: (query.class || 'formio-form-wrapper'),
        src: query.src,
        form: null,
        submission: null,
        project: query.project,
        base: query.base || 'https://api.form.io',
        submit: query.submit,
        includeLibs: (query.libs === 'true' || query.libs === '1'),
        template: query.template,
        debug: (query.debug === 'true' || query.debug === '1'),
        config: {},
        redirect: (query.return || query.redirect),
        embedCSS: (`${Formio.config.updatePath ? Formio.config.updatePath() : scriptSrc}/formio.embed.css`),
        before: null,
        after: null
    }, config);
    const form = (Formio.config.form || Formio.config.src);
    if (form) {
        Formio.debug('Embedding Configuration', config);
        if (Formio.config.addPremiumLib) {
            Formio.config.addPremiumLib(Formio.config, scriptSrc);
        }

        // The id for this embedded form.
        Formio.config.id = `formio-${Math.random().toString(36).substring(7)}`;
        Formio.debug('Creating form element');
        const element = Formio.createElement('div', {
            'id': Formio.config.id,
            class: Formio.config.class
        });

        // insertAfter doesn't exist, but effect is identical.
        thisScript.parentNode.insertBefore(element, thisScript.parentNode.firstElementChild.nextSibling);
        Formio.createForm(element, form, Formio.config.config);
    }
}
else {
    // Show an error if the script cannot be found.
    document.write('<span>Could not locate the Embedded form.</span>');
}

export { Formio };
