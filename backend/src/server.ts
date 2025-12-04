import app from './app';
import { ENV } from './config/env';

const PORT = parseInt(ENV.PORT, 10);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});

