const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const PORT = 3000;

const JWTSecret = "tokenSecreto";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
    const authToken = req.headers['authorization'];
    if(authToken){
        const bearer = authToken.split(' ');
        const token = bearer[0];

        jwt.verify(token, JWTSecret, ( err, data ) => {
            if(err){
                res.status(401);
                res.json({ err :"Token inválido "});
            } else {
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email };
                next();
            }
        });

    } else {
        res.status(401);
        res.json({ err:"Token inválido "});
    }
}

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
    ],
    users: [
        {
            id: 1,
            name: "Gustavo Valente",
            email: "gvn@gvn.com",
            password: "123"
        },
        {
            id: 2,
            name: "Nego Hugo",
            email: "nego@hugo.com",
            password: "321"
        }
    ]
}

app.get("/games",auth, (req, res) => {
    const HATEOAS = [
        { 
            href: `http://localhost:${PORT}/game/0`,
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: `http://localhost:${PORT}/game/0`,
            method: "PUT",
            rel: "edit_game"
        },
        {
            href: `http://localhost:${PORT}/game/0`,
            method: "GET",
            rel: "get_game"
        },
        {
            href: `http://localhost:${PORT}auth`,
            method: "POST",
            rel: "login"
        }
    ]

    res.statusCode = 200;
    res.json({ games: DB.games, _links: HATEOAS })
});

app.get("/game/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) res.sendStatus(400);
    else {
        const HATEOAS = [
            { 
                href: `http://localhost:${PORT}/game/0`,
                method: "DELETE",
                rel: "delete_game"
            },
            {
                href: `http://localhost:${PORT}/game/0`,
                method: "PUT",
                rel: "edit_game"
            },
            {
                href: `http://localhost:${PORT}/game/0`,
                method: "GET",
                rel: "get_game"
            },
            {
                href: `http://localhost:${PORT}/games`,
                method: "GET",
                rel: "get_all_games"
            }
        ]
        const gameId = DB.games.find(gm => gm.id == id);
        console.log(gameId);
        if(gameId){
            res.statusCode = 200;
            res.json({ gameId, _links: HATEOAS });

        } else {
            res.sendStatus(404);
        }
    }
});

app.post("/game", (req, res) => {
    const { title, preco , year }  = req.body;

    DB.games.push({ id: 60,title, preco, year });
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

app.post("/auth", (req, res) => {
    const { email, password } = req.body;

    if(email){

        const user = DB.users.find( u => u.email == email);
        if(user){
            if(user.password == password){

                jwt.sign({ id: user.id, email: user.email },
                    JWTSecret, { expiresIn: '48h' },
                    (err, token) => {
                        if(err){
                            res.status(400);
                            res.json({ err:"Falha Interna"});
                        } else {
                            res.status(200);
                            res.json({ token: token });
                        }
                });

            } else {
                res.status(401);
                res.json({ err: "Credenciais inválidas "});
            }

        } else {
            res.status(404);
            res.json({ err: "E-mail ou senha inválido 2" });
        }

    } else {
        res.status(400);
        res.json({ err: "E-mail ou senha é inválido" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})