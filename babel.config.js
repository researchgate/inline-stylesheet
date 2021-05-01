module.exports = (api) => {
    api.cache.using(() => process.env.BABEL_ENV || process.env.NODE_ENV || 'development');

    const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    loose: true,
                    modules: env !== 'production_es' ? 'commonjs' : false,
                },
            ],
        ],
        plugins: [
            ["@babel/plugin-proposal-class-properties", { "loose": true }],
            ["@babel/plugin-proposal-private-methods", { "loose": true }],
            ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
        ],
    };
};
