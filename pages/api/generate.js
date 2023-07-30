import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)



const generateAction = async (req, res) => {
  // console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const basePromptPrefix =
  `
  You're a fitness expert and coach, with expertise in muscle growth and bodybuilding. You have 15 years of experience of working with thousands of clients, helping them to achieve their fitness goals. 
  Write a gym workout Split (excluding exercises but including muscles trained) for a week, for the mentioned goals and number of training days. 
  You can refer to the following workout splits and modify/mix/change them to your liking: push-pull-legs, push-pull, upper-lower, full body (it varies for more no. of training days to less no. of training days from left to right)
  If possible, the workout split should be structured such that the bigger muscle groups should have room to be trained atleast twice a week.

  Include cardio: ${req.body.userAnswer}
  
  Goals: ${req.body.userInput}
  
  number of training days: ${req.body.userNumber}
  
  Workout split:
  `

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 650,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `
  For the training split given below, write a gym workout program by following the rules mentioned.

  Training split:${basePromptOutput.text}

  Rules: 
  -A training day should not have more than 8 exercises
  -The workout split should train the following muscle groups: Back, chest, front delts, lateral & side delts, Traps, Quads, hamstrings, calves, glutes.
  -No. of times back should be trained in a week (2-4 times/week), chest(2-3 times /week), triceps(2-4 times/week), front delts(1-2 times/week), rear/side delts(2-6 times/week), traps(2-3 times/week), quads(1.5-3 times/week), hamstrings(2-3 times/week), calves(2-6 times/week), glutes(1-2 sets times/week)
  -Minimum volume for back(9 sets/week), chest(9 sets/week), triceps(3-6 sets/week), front delts(3 sets/week), rear/side delts(6-9 sets/week), traps(3 sets/week), quads(8 sets/week), hamstrings(6 sets/week), calves(6 sets/week), glutes(no direct work needed)
  -Maximum adaptive volume for back(15-20 sets/week), chest(12-18 sets/week), triceps(9-12 sets/week), front delts(12 sets/week), rear/side delts(16-22 sets/week), traps(4-8 sets/week), quads(12-18 sets/week), hamstrings(9-15 sets/week), calves(12-15 sets/week), glutes(4-8 sets/week)
  -On a day when training back, program should contain atleast 1 horizontal and 1 vertical pulling movement, for chest 1 pushing and 1 horizontal abduction movement.

  Program:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.75,
		// I also increase max_tokens.
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
}

export default generateAction;