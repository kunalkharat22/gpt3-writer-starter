import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  
  const [userInput, setUserInput] = useState('')
  const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)
const [userNumber, setUserNumber] = useState('');
const [userAnswer, setUserAnswer] = useState('')


const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log('usernumber:',userNumber)
  console.log('useranswer:',userAnswer)
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput, userAnswer, userNumber }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${output.text}`);
  setIsGenerating(false);
}

  const onUserChangedText = (event) => {
  // console.log(event.target.value);
  setUserInput(event.target.value);
};

const onUserChangedNumber = (event) => {
  const newValue = event.target.value;
  setUserNumber(newValue);
}

const onUserChangedAnswer = (event) => {
  const newValue = event.target.value;
  setUserAnswer(newValue);
}
  
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Science Based Workout Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Just fill in your preferences, and we'll do the rest!</h2>
          </div>
        </div>
        <div className="prompt-container">
          <h2>Enter your goal</h2>
          <input placeholder="eg. Muscle gain/lose fat/strength gain/etc." className="prompt-box" value={userInput} onChange={onUserChangedText}/>
          
          <h2>Do you want to include cardio?</h2>
          <div className="prompt-box-radio">
            <label>
              <input type="radio" name="yes-no" value="yes" checked={userAnswer === 'yes'} onChange={onUserChangedAnswer} />
              <span className="prompt-box-radio-label">Yes</span>
            </label>
            <label>
              <input type="radio" name="yes-no" value="no" checked={userAnswer === 'no'} onChange={onUserChangedAnswer} />
              <span className="prompt-box-radio-label">No</span>
            </label>
          </div>

          <h2>No. of training days?</h2>
          <input type="number" placeholder="eg. 3/5/7/etc." className="prompt-box-number" value={userNumber} onChange={onUserChangedNumber}/>
          <div className='prompt-buttons'>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className='generate'>
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className='output'>
              <div className='output-header-container'>
                <div className='output-header'>
                  <h3>Output</h3>
                </div>
              </div>
              <div className='output-content'>
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div> */}
    </div>
  );
};

export default Home;
