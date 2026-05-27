import dotenv from "dotenv";
import app from "./app";

dotenv.config();

app.listen(2000, () => {
    console.log("API running on port 2000");
});
