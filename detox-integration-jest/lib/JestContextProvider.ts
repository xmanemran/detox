function proxy_it(it: Function, callback: Function) {
    return function proxied_it(this: any) {
        let suite: any;

        const args = [];
        for (const arg of arguments) {
            if (typeof arg === 'function') {
                args.push(function (this: any) {
                    callback(suite);
                    return arg.apply(this, arguments);
                });
            } else {
                args.push(arg);
            }
        }

        suite = it.apply(this, args);
        return suite;
    };
}

function init(_global: any) {
    const __log__ = (s: any) => console.log('BLA, BLA', s.result.fullName);

    _global.test = Object.assign(proxy_it(_global.test, __log__), {
        only: proxy_it(_global.test.only, __log__),
        skip: proxy_it(_global.test.skip, __log__),
    });

    _global.it = Object.assign(proxy_it(_global.it, __log__), {
        only: proxy_it(_global.it.only, __log__),
        skip: proxy_it(_global.it.skip, __log__),
    });

    _global.xit = proxy_it(_global.xit, __log__);
    _global.fit = proxy_it(_global.fit, __log__);
}

