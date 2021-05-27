const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let DB = {
    games: [
        {
            id: 1,
            title: "Call of duty MW",
            ano: 2014,
            preco: 60
        },
        {
            id: 2,
            title: "Sea of thieves",
            ano: 2015,
            preco: 60
        },
        {
            id: 3,
            title: "MInecraft",
            ano: 2002,
            preco: 30
        },
        {
            id: 4,
            title: "Battlefield",
            ano: 2010,
            preco: 80
        }
    ]
}

app.get("/games", (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) res.sendStatus(400);
    else {
        const gameId = DB.games.find(gm => gm.id == id);
        if(gameId){
            res.statusCode = 200;
            res.json(gameId);

        } else {
            res.sendStatus(404);
        }
    }
});

app.post("/game", (req, res) => {
    const { title, price, year }  = req.body;

    DB.games.push({ id: 60,title, price, year });
    res.sendStatus(200);
});

app.delete("/game/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) res.sendStatus(400);
    else {
        const gameIndex = DB.games.findIndex(gm => gm.id == id);
        if(gameIndex == -1) res.sendStatus(404);
        else {
            DB.games.splice(gameIndex, 1);
            res.sendStatus(200);
        }
    }
});

app.put("/game/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) res.sendStatus(400);
    else {
        const gameId = DB.games.find(gm => gm.id == id);
        if(gameId){
            const { title, price, year } = req.body;

            if(title) gameId.title = title;
            if(price) gameId.price = price;
            if(year) gameId.year = year;

            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})