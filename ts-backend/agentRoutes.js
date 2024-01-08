const actuator = require('express-actuator')
const express =  require("express")
const dotenv =  require("dotenv")
const cors =  require("cors")

const Routes =  require("./routes")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(actuator());

app.use("/api/agent", Routes);

app.listen(PORT, () => console.log(`🔥  server running on port ${PORT}`));
