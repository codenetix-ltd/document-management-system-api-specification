const http = require('http')
const finalhandler = require('finalhandler')
const mock = require('osprey-mock-service')
const Router = require('osprey').Router

let options = {
    cors: true
}

mock.setExampleProvider(function(body, req){
    let example = Object.assign({}, body.example);
    example.data = [];

    if (!example.data || !example.meta || !example.links) {
        return Object.assign(example, {id: req.params.id})
    }

    let perPage = req.query.perPage || 15
    let page = req.query.page || 1
    let objCount = parseInt(process.env.MOCK_ARRAY_SIZE) || 1007
    let lastPage = parseInt((objCount + perPage - 1) / perPage)
    let from = 1 + (page - 1) * perPage
    let to = page * perPage

    for (let i=from-1, j=0;i<to && i<objCount;++i,++j) {
        if (body.example.data[i]) {
            example.data[j] = body.example.data[i]
        } else {
            let rIndex = i % body.example.data.length
            example.data[j] = Object.assign({},body.example.data[rIndex], {id:i+1})
        }
    }
    example.meta = {
        currentPage: page,
        lastPage: lastPage,
        perPage: perPage,
        total: objCount,
        path: body.example.meta.path,
        from: from,
        to: to
    }

    return example
})

mock.loadFile('./api_mock.raml', options)
    .then(function (app) {
        let router = new Router()
        router.use(app)
        let server = http.createServer(function (req, res) {
            router(req, res, finalhandler(req, res))
        })

        server.listen(80, function () {
        })
    })
    .catch(function (err) {
        console.log(err && err.stack || err.message)
        process.exit(1)
    })