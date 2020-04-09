import express, { Response } from 'express';
import cors from 'cors';
import { uuid } from 'uuidv4';

import IRepository from './interfaces/IRepository';
import IRequest from './interfaces/IRequest';

const app = express();

app.use(express.json());
app.use(cors());

const repositories: IRepository[] = [];

app.get('/repositories', (req: IRequest<IRepository>, res: Response) => {
  return res.status(200).json(repositories);
});

app.post('/repositories', (req: IRequest<IRepository>, res: Response) => {
  const { title, url, techs } = req.body;
  const id = uuid();
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put('/repositories/:id', (req: IRequest<IRepository>, res: Response) => {
  const { id } = req.params;
  const { title, url, techs, likes } = req.body;

  const respository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return res.status(400).json({ error: 'Repository not found!😢' });
  }

  repositories[index] = respository;

  return res.status(200).json(respository);
});

app.delete('/repositories/:id', (req: IRequest<IRepository>, res: Response) => {
  const { id } = req.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return res.status(400).json({ error: 'Repository not found!😢' });
  }

  repositories.splice(index, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req: IRequest<IRepository>, res: Response) => {
  const { id } = req.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return res.status(400).json({ error: 'Repository not found!😢' });
  }

  repository.likes += 1;

  return res.status(200).json(repository);
});

export default app;
