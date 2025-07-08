
import express from "express";

const PORT = process.env.PORT || '80' ; 
const KEY = process.env.KEY || '123' ; 

const app = express();
app.use(express.json());
//Part 1: Basic Setup &amp; First Endpoint

//עד שאלה 6 זה ביצוע של קוד
//6
//ברעיון השאלה היא לראות פונקציות מסוימות של קוד - ראיתי /עברתי
//app.use: בעצם כל דבר שהוא מקבל לקריאה וטיפול במהלך האזנה נכנס דבר ראשון לשם

//7
app.get('/greet', (req, res) => {
    res.json({ msg: `hi from get endpoint ${new Date()} \n` });
})

//8
// >curl localhost:3005/greet
// {"msg":"hi from get endpoint Tue Jul 08 2025 12:30:21 GMT+0300 (שעון ישראל (קיץ))"}

// Part 2: Route Params &amp; Internal Requests
//1
//קראתי
//2
app.get('/greet/:name', (req, res) => {
    res.json({ msg: "i got name: " + req.params.name })
})
app.get('/test', async (req, res) => {
    try {
        const response = await fetch("http://localhost:3005/greet/shaul");
        const data = await response.json();
        console.log(data);
        // res.status(200).json(data);
        //אם לא אשים סימן שאלה התוכנית תיפול - לבדוק
        if (data.msg?.includes('shaul')) { //  אם הערך הזה קיים בתוך data
            res.status(200).json({ result: "OK", data: data });
        }
        else {
            res.status(400).json({ result: "field" });
        } // שימת לב דגש פה על else כי לא יהיה לי הזדמנות שנייה להחזיר ערך

    } catch (err) {
        res.json({ Err: err });
    }
    // finally {

    // }
})

// Part 3: Action-Based POST Endpoint
//3

// כדי לפתוח את ההרשאה יש להכניס API-KEY :
// API KEY לחתולים:
// "live_x6BDBCskee0sEyAiO1EwBK5O9qEJOxWJsEFrdzDHNlX6xh6YhnTzCpATq3BbgtiT"


app.post('/action', async (req, res) => {
    try {
        if ("action" in req.body) {
            if (req.body['action'] === "joke") {
                const response = await fetch("https://official-joke-api.appspot.com/random_joke");
                const data = await response.json();
                // console.log(data);
                res.status(200).json({ joke: data['setup'] });

            }
            else if (req.body['action'] === "cat fact") {
                const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=11" , {
                    headers:{
                        'x-api-key' : KEY
                    }
                });
                const data = await response.json();
                // console.log(data);
                if (Array.isArray(data)) {
                    res.status(200).json({ 'lengthOfData': data.length });
                }
                else { res.sendsStatus(502); }

            }
            else {
                res.status(422).json({ Err: 'Unprocessable content' })
            }
        }
        else {
            res.status(400).send("Error: request worng.")
        }

    } catch (err) {
        console.log("Error Server !!! ", err);
        res.sendStatus(500);
    }
})
// else if(a == 3){
//     const response = await fetch(`${URL}/`, {
//     headers: {
//         'Content-Type': 'application/json',

//     },
//     method: 'PUT',//or POST
//     body: JSON.stringify({obj:'obj'})

// }) //end response
// } // end if

app.listen(PORT, () => {
    console.log('server running .. ');
})