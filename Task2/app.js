//Task 2: Products and Orders with Status Tracking
const express = require('express')
const app = express()
const fs = require('fs')

const body_parser = require('body-parser')

app.use(body_parser.json())

function prodCounter() {
    const products = fs.readFileSync("products.json")
    const result = JSON.parse(products)

    return result.length > 0 ? Math.max(...result.map(product => product.id)) + 1 : 0
}
function orderCounter() {
    const orders = fs.readFileSync("orders.json")
    const result = JSON.parse(orders)

    return result.length > 0 ? Math.max(...result.map(order => order.orderId)) + 1 : 0
}


//CRUD Operations for Products
app.get('/products', (req, res) => {

    try {
        const products = fs.readFileSync("products.json")
        const result = JSON.parse(products)
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})
app.get('/products/:id', (req, res) => {
    try {
        const products = fs.readFileSync('products.json')
        const result = JSON.parse(products)
        let found = result.find(prod => prod.id == req.params.id)
        if (found) {
            res.status(200).send(found)
        } else {
            res.status(401).send('not valid ID')
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})
app.post('/products', (req, res) => {
    if (!req.body.name || !req.body.desc || !req.body.price) {
        return res.status(400).send('Please, Provide full information')
    }

    const products = fs.readFileSync('products.json')
    const updatedProducts = JSON.parse(products)

    let product = {
        id: prodCounter(),
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price

    }
    updatedProducts.push(product)
    fs.writeFileSync('products.json', JSON.stringify(updatedProducts))
    res.status(200).send(product)
})

app.put('/products/:id', (req, res) => {
    if (!req.body.name || !req.body.desc || !req.body.price) {
        return res.status(400).send('Please, Provide full information')
    }

    const products = fs.readFileSync('products.json')
    const updatedProducts = JSON.parse(products)

    let found = updatedProducts.find(prod => prod.id == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }

    let product = {
        id: req.params.id,
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price
    }
    const updatedList = updatedProducts.filter(prod => prod.id != req.params.id)
    updatedList.push(product)
    fs.writeFileSync('products.json', JSON.stringify(updatedList))
    res.status(200).send(product)
})

app.delete('/products/:id', (req, res) => {
    const products = fs.readFileSync('products.json')
    const updatedProducts = JSON.parse(products)

    let found = updatedProducts.find(prod => prod.id == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }
    const updatedList = updatedProducts.filter(prod => prod.id != req.params.id)

    fs.writeFileSync('products.json', JSON.stringify(updatedList))
    res.status(200).send("Product Successfully deleted")

})
//CRUD Operations for Orders
app.get('/orders', (req, res) => {

    try {
        const orders = fs.readFileSync("orders.json")
        const result = JSON.parse(orders)
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})
app.get('/orders/:id', (req, res) => {
    try {
        const orders = fs.readFileSync('orders.json')
        const result = JSON.parse(orders)
        let found = result.find(order => order.orderId == req.params.id)
        if (found) {
            res.status(200).send(found)
        } else {
            res.status(401).send('not valid ID')
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})
app.post('/orders', (req, res) => {
    if (!req.body.item || !req.body.date) {
        return res.status(400).send('Please, Provide full information')
    }

    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)

    const products = fs.readFileSync('products.json')
    const productsList = JSON.parse(products)

    let selectedItem = productsList.find(item => item.id == req.body.item)
    if (!selectedItem) {
        return res.status(400).send("Not an available product")
    }
    let order = {
        orderId: orderCounter(),
        item: [selectedItem],
        date: req.body.date,
        status: "pending"

    }
    updatedOrders.push(order)
    fs.writeFileSync('orders.json', JSON.stringify(updatedOrders))
    res.status(200).send(order)
})

app.put('/orders/:id', (req, res) => {
    if (!req.body.item || !req.body.date) {
        return res.status(400).send('Please, Provide full information')
    }

    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)


    let found = updatedOrders.find(order => order.orderId == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }
    const products = fs.readFileSync('products.json')
    const productsList = JSON.parse(products)

    let selectedItem = productsList.find(item => item.id == req.body.item)
    if (!selectedItem) {
        return res.status(400).send("Not an available product")
    }
    let order = {
        orderId: req.params.id,
        item: [selectedItem],
        date: req.body.date,
        status: "pending"
    }
    const updatedList = updatedOrders.filter(order => order.orderId != req.params.id)
    updatedList.push(order)
    fs.writeFileSync('orders.json', JSON.stringify(updatedList))
    res.status(200).send(order)
})

app.delete('/orders/:id', (req, res) => {
    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)

    let found = updatedOrders.find(order => order.orderId == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }
    const updatedList = updatedOrders.filter(order => order.orderId != req.params.id)

    fs.writeFileSync('orders.json', JSON.stringify(updatedList))
    res.status(200).send("Order Successfully deleted")

})
//Order Items
app.post('/orders/:id/items', (req, res) => {
    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)

    let found = updatedOrders.find(order => order.orderId == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }
    const products = fs.readFileSync('products.json')
    const productsList = JSON.parse(products)

    let selectedItem = productsList.find(item => item.id == req.body.item)
    if (!selectedItem) {
        return res.status(400).send("Not an available product")
    }
    updatedOrders.map(elm => {
        if (elm.orderId == found.orderId) {
            elm.item.push(selectedItem)
        }
    })

    fs.writeFileSync('orders.json', JSON.stringify(updatedOrders))

    res.status(200).send(selectedItem)
})
app.get('/orders/:id/items', (req, res) => {
    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)

    let found = updatedOrders.find(order => order.orderId == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }

    res.status(200).send(found.item)

})

//Order Status Tracking:
app.put('/orders/:id/status', (req, res)=>{
    const orders = fs.readFileSync('orders.json')
    const updatedOrders = JSON.parse(orders)

    let found = updatedOrders.find(order => order.orderId == req.params.id)
    if (!found) {
        return res.status(401).send('not valid ID')
    }
    updatedOrders.map(order=>{
        if(order.orderId == found.orderId) {

            order.status = req.body.status
          
        }
    })
    fs.writeFileSync("orders.json", JSON.stringify(updatedOrders))
    res.status(200).send(found)
})
app.listen(3000)
