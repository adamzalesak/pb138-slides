module.exports = {
    allowLocalFiles: true,
    images: true,
    engine: ({ marp }) => marp
        .use(require('markdown-it-highlightjs'), {
            inline: true,
            auto: false
        }),
}