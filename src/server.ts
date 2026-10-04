import 'dotenv/config';
import express from 'express';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const port = 3000;

const app = express();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

app.use(express.json());

app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: 'asc',
        },
        include: {
            genres: true,
            languages: true,
        },
    });
    res.json(movies);
});

 app.post('/movies', async (req, res) => {
        const { title, genre_id, language_id, oscar_count, release_date } = req.body;

        try {
        // case insensitive - se a busca for feita com letras maiúsculas ou minúsculas, o resultado será o mesmo   

        // verificar no banco se ja existe um filme com o nome que está sendo enviado

        const movieWithSameTitle =  await prisma.movie.findFirst({
            where: { title: { equals: title, mode: 'insensitive' } },
            
        });
        if(movieWithSameTitle) {
            return res.status(409).send({message: 'Já existe um filme com esse nome'});
        }
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            },
        });
    } catch (error) {
        return res.status(500).send({message: 'Falha ao cadastrar um filme'});
    }
        res.status(201).send();
 });


app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
