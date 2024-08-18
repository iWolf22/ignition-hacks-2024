# Mobility+

https://github.com/user-attachments/assets/79006ee7-85aa-4780-9f67-011e8fa38380

## 💡 Inspiration
If you've ever been to a physiotherapist's office, you know that the bulk of your time with the physiotherapist is spent correcting your bad form and relearning proper form. At Mobility+, our aim is to drastically reduce the mundane work of physiotherapists like correcting posture, giving generally accepted medical advice, and coaching through exercises by delegating it to technology. We want to free physiotherapists to be able to take more patients, operate more efficiently, and focus on higher level tasks - all while saving patients time and money to live their lives freely.

## 🐐 What it does
Our product is a virtual, AI-powered, physiotherapy assistant. Through a combination of computer vision and large language models, our assistant is able to accurately assess a patient for correct or incorrect form, all while providing them with live feedback through verbal communication.

Motion+ makes physiotherapy much more exciting with a built-in reward system, spicing up mundane and boring exercises, making them fun!

Moreover, if a user is confused about an exercise or wants to learn more, we've provided a real-time voice assistant that you can talk to and ask questions! This aims to emulate the experience of talking to a real physiotherapist.

## 🚧 How we built it
The Frontend is built with Next.js and MaterialUI, using Auth.js for authentication.

The Backend is built with Tensorflow to detect key points on the hands and body for their corresponding mobility exercises. Additionally, the voice assistant was built with the OpenAI API for speech-to-text, text-to-speech, and context-based text generation.

## ⚔️ Challenges we ran into
We had many issues trying to make a minimum viable product as polished as we could. This meant reducing the latency of the on-screen visual aids and increasing accuracy, but also making the voice assistant feel like it works smoothly with everything else. This was a real challenge with the amount of asynchronous dependencies and CPU-heavy computations. Another concern was the possibility of malicious use of our voice assistant, a concern that we resolved through adding user authentication.

## 🏆 Accomplishments that we're proud of
Despite what seemed like an overly-ambitious backlog of crazy features, we're proud of how we were able to organize our time and resources efficiently to rise above the challenge. We organized hourly scrum meetings where we collaborated and assisted each other with mental roadblocks and encouraged each other throughout the hackathon. As a result, we were able to churn out all of the key features we set out to add to the project.

## 📚 What we learned
We learned about the importance of prompt communication and open dialogue with teammates. In order to work efficiently, we divided up all of our tasks into separate domains for each of our team members, and oftentimes each of us would encounter huge problems that we didn't know how to solve. Something that really helped us to move through each challenge we encountered was the willingness to swallow our pride and seek help for roadblocks, allowing us to move faster as a team.

## ⏭️ What's next for Mobility+
Our vision for mobility+ is to be a real asset to the average physiotherapist. As such, we would've liked to add more features that made it easier for physiotherapists to do their jobs, such as a catalogue from which physiotherapists could build exercise routines and tailor a routine to patients, a daily tracker/daily goal panel for patients, and a channel through which patients could directly communicate with their health professionals.

## Built With
- auth.js
- b.lendr
- next.js
- openai
- react
- speech-to-text
- tailwind
- tensorflow
- text-to-speech
- three.js

## Try it out
https://ignition-hacks-2024.vercel.app/
