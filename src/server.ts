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

app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: 'asc',
        },
        include: {
            genres: true,
            languages: true,
        }
    });

    res.json(movies);
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
