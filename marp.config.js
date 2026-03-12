module.exports = {
    allowLocalFiles: true,
    images: true,
    themeSet: './themes',
    engine: ({ marp }) => marp
        .use(require('markdown-it-highlightjs'), {
            inline: true,
            auto: false
        }),
}