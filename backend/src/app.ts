import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import adminRoutes from './modules/admin/admin.routes';
import electionRoutes from './modules/elections/election.routes';
import candidateRoutes from './modules/candidates/candidate.routes';
import voteRoutes from './modules/votes/vote.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/elections', electionRoutes);
app.use('/candidates', candidateRoutes);
app.use('/votes', voteRoutes);

app.use(errorHandler);

export default app;


