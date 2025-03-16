
import express from 'express'; 
import redis from 'redis';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const client = redis.createClient(); 

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})
// Route to generate sharing code
app.post('/start', async (req, res) => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    await client.setEx(code, 1800, uuidv4());  // Store for 30 mins
    res.render('share', { code });
});

// Route to join session
app.post('/join-session', async (req, res) => {
    const { code } = req.body;
    const session = await client.get(code);
    
    if (session) {
        res.send('Connected to screen share!');
    } else {
        res.send('Invalid or expired code.');
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
