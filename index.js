
// const express = require('express');
// const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const OpenAI = require('openai');
// const cors = require('cors');


dotenv.config();

// const app = express();
// const port = 3000;
// app.use(cors());


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});



// // Endpoint to handle prompt generation
// app.get('/', (req, res) => {
//     res.send("Hello");
// })
// app.post('/generate', async (req, res) => {
//     const data = req.body;
//     const datastring = JSON.stringify(data);


//     const prompts = await generatePrompts(datastring);
//     console.log(prompts);
//     res.json({ prompts });
// });

const data = {
    framework: "R-T-F (Role, Task, Format)",
    Role: "Facebook ad marketer",
    Task: "Design a compelling Facebook ad compaign to promot a new line of fitness apparel for a sports brand.",

    Format: "Create a storyboard oulining the sequnece of ad creatives, including ad copy, visuals, and targeting strategy.",

}

console.log("Generating....");

async function f() {
    const prompts = await generatePromptFromAPI(data);
    console.log(prompts);

}
f();




async function generatePromptFromAPI(data) {
    try {

        const { framework } = data;

        let prompt = '';
        switch (framework) {
            case "R-T-F (Role, Task, Format)":
                var { Role, Task, Format } = data;
                prompt = `
            Role: ${Role}
            Task: ${Task}
            Format: ${Format}

            Given the role of ${Role}, your task is to ${Task}. This should be done in the following format: ${Format}. Now, optimize the provided prompt to elicit a more effective and relevant response from ChatGPT.
        `;
                break;
            case "T-A-G (Task, Action, Goal)":
                var { Task, Action, Goal } = data;
                prompt = `
                
                Task: ${Task}
                Action: ${Action}
                Goal: ${Goal}

                Given the goal ${Goal}, your task is to ${Task}. This should result in the following action: ${Action}. Now, optimize the provided prompt to elicit a more effective and relevant response from ChatGPT.
            `;
                break;
            case "B-A-B (Before After Bridge)":
                var { Before, After, Bridge } = data;
                prompt = `
                
            Before: ${Before}
            After: ${After}
            Bridge: ${Bridge}

            Before the ${Before}, after ${After}, use the bridge ${Bridge}. Now, optimize the provided prompt to elicit a more effective and relevant response from ChatGPT.
        `;
                break;
            case "C-A-R-E (Context, Action, Result, Example)":
                var { Context, Action, Result, Example } = data;
                prompt = `
                
            Context: ${Context}
            Action: ${Action}
            Result: ${Result}
            Example: ${Example}

            In ${Context}, take ${Action} which should result in ${Result}. For example, ${Example}. Now, optimize the provided prompt to elicit a more effective and relevant response from ChatGPT.
        `;
                break;
            case "R-I-S-E (Role Input Steps Expectation)":
                var { Role, Input, Steps, Expectation } = data;
                prompt = `
                
            Role: ${Role}
            Input: ${Input}
            Steps: ${Steps}
            Expectation:${Expectation}

            As a ${Role}, input ${Input}, then follow these steps: ${Steps}. Expect ${Expectation}. Now, optimize the provided prompt to elicit a more effective and relevant response from ChatGPT.
        `;
                break;

            // Add cases for other frameworks if needed

            default:
                // Handle unsupported frameworks
                prompt = `Unsupported framework: ${framework}`;
        }

        const initialPrompt = `
            Act as a prompt engineer. As an experienced and renowned prompt engineer, you possess the expertise to craft high-quality prompts that yield accurate and relevant responses from GPT. Your skills in promoting are unmatched, and I am excited to tap into your knowledge to further enhance the quality of my prompts. Objective: your task is to generate the set of suggestions on how to optimize the following prompt below in order to generate more effective and relevant response from chatGPT.

            This is the content given by user :  ${JSON.stringify(data)}.

            Create a prompt using prompt framework given by user keeping the other information related to that framework in mind to get a response and information to the best of your ability. 
          
          
        `;

        const suggestionsResponse = await openai.chat.completions.create({
            messages: [{
                role: "system",
                content: initialPrompt + prompt // Combine the initial and framework-specific prompts
            }],
            model: "gpt-3.5-turbo",
        });

        const optimizedPrompt = suggestionsResponse.choices[0].message.content;
        return optimizedPrompt;

    } catch (error) {
        console.error('Error generating prompt from API:', error);
        return '';
    }
}