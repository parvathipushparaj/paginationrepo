const express = require('express')
const app = express()
var request = require('request');

app.get('/',(req,res) => {
    res.sendFile('index.html', { root: __dirname });
})



app.get('/users', async (req, res) => {

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)


    var url = `https://api.github.com/search/code?q=addClass+user%3Amozilla`;

    let jsonObject =await getJsonData(url)

    let pagination = paginatedResults(jsonObject.items,page,limit)


    res.json(pagination)

})


function getJsonData(url) {

    return new Promise((resolve, reject) => {


        request.get({
            url: url,
            json: true,
            headers: { 'User-Agent': 'request' }
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
                reject(err)
                return
            }  else {
                // data is already parsed as JSON:
                console.log('Success');
                resolve(res.body)
                return 
            }
        });


    });


}

function paginatedResults(model,page,limit) {

        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        
        const results = {}
        console.log(model.length)

        if (endIndex < model.length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }

        }

       var withData = model.slice(startIndex, endIndex)

       var onlyRepo=[]
       withData.forEach(element => {
           onlyRepo.push(element.repository)
       });
       results.data=onlyRepo

       return results
       
}
app.listen(3000)