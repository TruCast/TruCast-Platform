import compression from 'compression';
import express from 'express';
import glob from 'glob';
import helmet from 'helmet';
import 'marko/express';
import path from 'path';
import R from 'ramda';
import uuid from 'uuid';

require('marko/node-require').install();

const views = R.fromPairs(R.map(file_path => {
  return [path.basename(file_path, '.marko'), require(file_path)];
}, glob.sync(path.join(__dirname, '../views/*.marko'))));


const port = process.env.PORT || 8000;
const channel_id = process.env.NODE_ENV === 'development' ? 'testabc123' : (process.env.CHANNEL_ID || uuid.v4());

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.static('public'));

app.get('/stream', (req, res) => res.marko(views.stream, {channel_id}));
app.get('/', (req, res) => res.marko(views.index, {channel_id}));

console.log(`Listening on port: ${port}`);
app.listen(port);
