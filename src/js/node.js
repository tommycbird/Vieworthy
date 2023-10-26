
const express = require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAIApi = require('openai');
const app = express();
const port = 3000;

//API Key for OpenAI
process.env.OPENAI_API_KEY = 'aaaaaaa';
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });

//Hardcoded transcript for testing GPT
timestamps_and_text = {
    "0:01": "All right, so today I got a hold of",
    "0:04": "and got to poke around the new iPhone 15",
    "0:05": "and the iPhone 15 Pros.",
    "0:07": "I do remember flying here and I'm thinking",
    "0:09": "what could Apple possibly do?",
    "0:11": "Like what could they possibly introduce with a new iPhone,",
    "0:14": "the 23rd iPhone that's actually interesting?",
    "0:15": "Now, there is more stuff",
    "0:17": "than just the iPhone that was mentioned",
    "0:19": "at this Wonderlust event that Apple hosted",
    "0:20": "including some stuff that straight up",
    "0:24": "wasn't mentioned on stage at all, so we'll get to that.",
    "0:25": "But this is just the new iPhone stuff.",
    "0:27": "So stay tuned and get subscribed to see the rest.",
    "0:30": "But let's just talk about the new iPhone 15 and 15 Pro.",
    "0:32": "So here's a lens to look at all this stuff through.",
    "0:35": "Coming into this, basically everything Apple just added",
    "0:38": "to their newest flagship phones falls into two buckets.",
    "0:40": "It's either something we've already seen",
    "0:42": "in some other phone for years,",
    "0:44": "or it's some ecosystem feature",
    "0:46": "that only works with other iPhones,",
    "0:47": "which is not necessarily a bad thing,",
    "0:50": "but it's just a lens to look through this stuff at,",
    "0:51": "just to keep an eye on it.",
    "0:53": "This is the iPhone 15.",
    "0:54": "There's the same two sizes, again,",
    "0:57": "iPhone 15 and iPhone 15 Plus.",
    "1:00": "And yeah, you know there's some small changes,",
    "1:04": "like the slight soft corner radii on the aluminum rails",
    "1:06": "and the one piece glass back",
    "1:08": "fading between a lighter and darker version",
    "1:10": "of the same color, like this new pink one.",
    "1:12": "It's pretty seamless.",
    "1:13": "Also, satin soft touch backs",
    "1:15": "across the whole lineup instead of glossy.",
    "1:17": "I definitely like that.",
    "1:21": "But the big headlining feature really is its USB now.",
    "1:23": "Lightning is officially dead.",
    "1:26": "These new iPhones are all USB-C across the board.",
    "1:28": "Now on one hand, this is a huge deal,",
    "1:30": "like there's only ever been one port change",
    "1:35": "in the iPhone ever.",
    "1:38": "Back in 2012, it went from that 30-pin connector thing",
    "1:41": "to this new lightning thing, which we've had ever since.",
    "1:43": "And now the second one ever is USB type C.",
    "1:46": "But on the other hand it's, I don't know, it's just USB.",
    "1:49": "Like it's the same port all these other laptops",
    "1:51": "and tablets all over the planet have had",
    "1:54": "for the past couple years.",
    "1:57": "I imagine that might be another year or two",
    "1:58": "before the whole lineup, like the baseline cheap iPad",
    "2:00": "and the iPhone SE and everything else gets USB-C.",
    // "2:04": "But yeah, I don't know.",
    // "2:06": "We knew it was coming, but it's still kind of surreal",
    // "2:09": "to look at an iPhone and see a USB port on it.",
    // "2:12": "So what does this enable is a real question, right?",
    // "2:14": "First of all, it's the one cable that you can ideally use",
    // "2:17": "to charge all your stuff, so your Mac, your iPad,",
    // "2:20": "your iPhone, your friend's Android phone,",
    // "2:23": "the new AirPods which just got a new USB-C case.",
    // "2:25": "All that stuff, one cable.",
    // "2:27": "Oh, and now you can charge accessories",
    // "2:29": "like the new AirPods with the wire.",
    // "2:31": "So there's no wireless reverse charging right now,",
    // "2:33": "but that C to C cable that comes in the box,",
    // "2:35": "you can like plug it into the iPhone,",
    // "2:37": "plug it into the AirPods",
    // "2:38": "and charge the AirPods up from the iPhone battery.",
    // "2:41": "So that's pretty cool.",
    // "2:42": "But they did hold back on one very key thing",
    // "2:45": "and they saved it for the iPhone 15 Pro.",
    // "2:48": "So I'll get to that in a bit, but that's the USB-C.",
    // "2:51": "Aside from that, really it's a slightly updated phone.",
    // "2:54": "It's a little bit of a new display.",
    // "2:56": "You know, you get the Dynamic Island here, of course,",
    // "2:58": "on these baseline iPhones",
    // "3:00": "and there's also now a higher peak brightness,",
    // "3:02": "2,000 nits now",
    // "3:03": "which is twice as bright as the iPhone 14s.",
    // "3:07": "And there's a new camera.",
    // "3:08": "The primary camera is now a 48-megapixel chip,",
    // "3:12": "presumably the same one",
    // "3:13": "that was in the iPhone 14 Pro last year",
    // "3:16": "and all the benefits that come with that.",
    // "3:18": "And then the rest of the phone",
    // "3:20": "really follows that same formula.",
    // "3:22": "They do this thing where the new baseline phone",
    // "3:24": "is basically last year's Pro phone repackaged,",
    // "3:27": "so it inherits the same A16 Bionic chip",
    // "3:30": "from last year's Pro phone.",
    // "3:32": "The coolest feature of this phone though,",
    // "3:34": "and you know, it's also on the Pro phone",
    // "3:35": "but I still think it's pretty solid,",
    // "3:37": "is the camera has this new next-generation portrait mode",
    // "3:41": "but basically it automatically detects",
    // "3:42": "when there's a subject in a photo",
    // "3:44": "and captures all of the depth information needed",
    // "3:46": "to be able to turn it into a portrait mode photo later.",
    // "3:50": "So you don't have to remember",
    // "3:51": "to switch it to portrait mode necessarily every time.",
    // "3:54": "And if you ever forget but want to add that blur later,",
    // "3:57": "you can do it with high quality results.",
    // "3:59": "So that's cool.",
    // "4:00": "Aside from that, the rest of the phone,",
    // "4:02": "I mean it's the same thing, right?",
    // "4:04": "Same sizes, guys, same ceramic shield,",
    // "4:06": "same dust and water resistance",
    // "4:09": "and same starting prices, 799 for the 15",
    // "4:12": "and 899 for the 15 Plus.",
    // "4:16": "So then there is the Pro phones,",
    // "4:18": "the iPhone 15 Pro and 15 Pro Max.",
    // "4:21": "There is some more new here.",
    // "4:22": "A lot of it, I'm actually gonna want to test",
    // "4:24": "just to see if it's actually what they say,",
    // "4:26": "but make sure you get subscribed to see those full reviews",
    // "4:29": "when they come out later this month and we can figure out",
    // "4:32": "if the phones are worth it.",
    // "4:34": "But basically it's not bleeding edge stuff",
    // "4:36": "that we've never seen before.",
    // "4:37": "It's just welcome stuff.",
    // "4:39": "And those are mostly in build quality,",
    // "4:42": "the chip inside, and the cameras.",
    // "4:44": "So let's just start with the chip inside.",
    // "4:46": "First of all, it's a brand new chip",
    // "4:48": "that's called the A17 Pro.",
    // "4:50": "It's the first time they've used the word Pro",
    // "4:52": "in an iPhone chip,",
    // "4:54": "and it's their first three nanometer chip,",
    // "4:56": "so it promises some performance",
    // "4:58": "and efficiency improvements as a result.",
    // "5:00": "I think they said it's like 10% faster",
    // "5:02": "high performance cores and the neural engines",
    // "5:05": "up to twice as fast, bunch of other stuff.",
    // "5:07": "Not sure how much of this you'll actually notice",
    // "5:09": "in everyday use, but hey,",
    // "5:11": "future proofing and headroom is never a bad thing,",
    // "5:13": "so this is clearly a powerful chip.",
    // "5:16": "They showed a demo of a game with like faster ray tracing",
    // "5:18": "which isn't new, but you know, it helped make their point.",
    // "5:21": "But the interesting thing to note here with this chip",
    // "5:23": "is they mentioned the chip has a new USB 3 controller on it,",
    // "5:29": "which means the 15 and 15 Plus don't have that.",
    // "5:33": "So basically that means the Pro iPhones USB-C port",
    // "5:36": "actually gets upgraded USB 3 speeds,",
    // "5:40": "the faster data transfer speeds",
    // "5:42": "up to 10 gigabits per second,",
    // "5:44": "but the base iPhones without that controller,",
    // "5:47": "they get USB-C,",
    // "5:48": "but they're gonna be stuck at USB 2.0 speeds.",
    // "5:52": "Basically the same we've always had with lightning,",
    // "5:55": "like 480 megabits per second.",
    // "5:58": "Now this probably won't make a real difference",
    // "6:00": "to most people.",
    // "6:01": "Like I don't know when the last time",
    // "6:03": "you plugged your phone in was,",
    // "6:05": "but it's kind of a bummer that not all of the benefits",
    // "6:08": "of USB-C come to all of the phones, but for the Pro phones",
    // "6:12": "that are gonna be shooting more ProRes video",
    // "6:14": "or ProRaw photos, I mean it takes forever.",
    // "6:18": "If you've shot this stuff like I have,",
    // "6:20": "you know it takes forever to get those off of the phone",
    // "6:23": "'cause they're big files.",
    // "6:25": "So I kind of wish they'd gone all the way.",
    // "6:27": "I wish they'd done Thunderbolt speeds,",
    // "6:30": "20, 30, 40 gigabits per second.",
    // "6:34": "But yeah, it's just gonna be USB 3 on the Pro iPhones",
    // "6:39": "and USB 2 on the base iPhones.",
    // "6:42": "You know what is disappointing, though?",
    // "6:44": "No fast charging.",
    // "6:47": "I talked about this on the podcast on 'Waveform.'",
    // "6:51": "I'll try to link the episode below,",
    // "6:52": "but like switching to USB-C, you'd think,",
    // "6:54": "oh, this is a huge opportunity for Apple",
    // "6:56": "to like explain why they're doing it,",
    // "6:58": "and we know why they're doing it,",
    // "7:01": "but oh, why are you giving us this new port",
    // "7:03": "and all this big new USB-C deal",
    // "7:05": "and it's just the same 20 or so watt charging we've had",
    // "7:10": "for the iPhone for forever, no new fast charging.",
    // "7:14": "Kind of figured they would try to do that better.",
    // "7:17": "But yeah, this will still take an hour and a half,",
    // "7:20": "two hours to charge.",
    // "7:21": "But anyway, the new design",
    // "7:23": "is what most people are fawning over",
    // "7:25": "at the moment with the pros.",
    // "7:26": "So they have switched the rails",
    // "7:28": "from that shiny fingerprint stainless steel",
    // "7:31": "to this new grade 5 titanium alloy",
    // "7:33": "with a brushed texture.",
    // "7:36": "And it's nice.",
    // "7:38": "First of all, it's noticeably lighter in the hand,",
    // "7:41": "which I love and it seems like it's also enabled them",
    // "7:44": "to shrink the body of the Pro iPhones just a little bit.",
    // "7:47": "So they have the same screen sizes,",
    // "7:50": "but the screens now get even closer to the edges",
    // "7:53": "and there's even slightly thinner bezels.",
    // "7:56": "And I actually do notice that.",
    // "7:58": "Now, a lot of people are also quoting stronger",
    // "8:01": "as one of the benefits too, but I really don't think",
    // "8:03": "this is gonna make as much of a difference",
    // "8:05": "as people are thinking.",
    // "8:07": "Like the Pro iPhones have had this stainless steel rails",
    // "8:10": "for a while now.",
    // "8:12": "I've dropped this phone,",
    // "8:14": "as you know, I don't have a case, on the ground.",
    // "8:16": "I've dented the stainless steel rails.",
    // "8:18": "It's fine, it doesn't break.",
    // "8:20": "It's not the stainless steel that breaks,",
    // "8:22": "it's the glass that breaks.",
    // "8:25": "And as far as we can tell,",
    // "8:27": "it's the same ceramic shield glass on the iPhone 15 Pro.",
    // "8:31": "That hasn't changed.",
    // "8:32": "So if you drop it on the glass,",
    // "8:34": "you're still gonna have not great results.",
    // "8:37": "But yeah, technically, sure, titanium is stronger.",
    // "8:41": "Either way, the new colors are black,",
    // "8:44": "white and this new blue which is really subtle,",
    // "8:48": "and then natural which I guess, it kind of embraces",
    // "8:51": "the raw titanium feel.",
    // "8:53": "Reminds me of 'Starlight,' if you're curious.",
    // "8:56": "Kinda like this warm tone.",
    // "8:58": "Weirdly, I think I like it the most.",
    // "9:01": "But also something else Apple set on stage,",
    // "9:04": "and this was pretty quick",
    // "9:05": "so you might not have even picked it up,",
    // "9:07": "but they did mention that they have redesigned",
    // "9:10": "a bit of the interior of the chassis",
    // "9:13": "to make the back glass more replaceable.",
    // "9:16": "So it's a more repairable iPhone design.",
    // "9:19": "Technically.",
    // "9:20": "It's a small thing, it's just one little step,",
    // "9:22": "but it's a step in the right direction",
    // "9:25": "for a more repairable iPhone.",
    // "9:27": "But my favorite feature,",
    // "9:28": "and before we get to any of the cameras,",
    // "9:30": "I honestly think this is my favorite feature,",
    // "9:32": "is the new action button, a new customizable button",
    // "9:38": "on the side of the iPhone, just the Pro iPhone.",
    // "9:40": "So it replaces the mute switch, which is pretty iconic,",
    // "9:44": "but it's in the same spot as the mute switch",
    // "9:46": "and it's actually customizable.",
    // "9:48": "So it's a pretty small button,",
    // "9:50": "basically about the same size as the switch.",
    // "9:53": "And by default, it actually behaves",
    // "9:55": "just like the mute switch did.",
    // "9:57": "So you actually hold it down",
    // "9:58": "to switch between muted or ringer on, great.",
}
// Instead of joining all the values, format it more clearly
const formattedTranscript = Object.entries(timestamps_and_text).map(([time, text]) => `${time}: ${text}`).join("\n");

const prompt_text = `
Likes: 1000
Title: Sample Title
Description: Sample Description
Transcript:
${formattedTranscript}
`;

// Middleware variables
app.use(bodyParser.json());
app.use(cors());

//List to save the conversation history into
let conversationHistory = [];

//======================================================================================================================================================

//Method to query the openAI API
app.post('/askGPT', async (req, res) => {
    try {
        console.log("Received request for /askGPT:", req.body);
        const userMessage = req.body.prompt;

        // If it's the initial context setup (first time the video is analyzed)
        if (conversationHistory.length === 0) {
            const introMessage = { 
                "role": "system", 
                "content": "You will receive data about a video including likes, title, description, and a transcript. Answer questions based on this information." 
            };
            
            const documentMessage = { "role": "user", "content": prompt_text };
            
            // Reset conversation history
            conversationHistory = [introMessage, documentMessage];
        } 
        const queryMessage = { "role": "user", "content": userMessage };
        conversationHistory.push(queryMessage);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
        });

        console.log("OpenAI API Response:", response); 
        const answer = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content;
        if (answer) {
            // response from GPT is added to the history of the convo
            conversationHistory.push({ "role": "assistant", "content": answer });
            
            // Check for token limit and manage the conversationHistory if needed
            if (response.usage && response.usage.total_tokens > 4000) {
                // If the total tokens exceed a threshold pop old messages
                conversationHistory.shift();
                console.warn("Token usage exceeded threshold. Removing oldest message.");
            }
            res.json({ answer: answer });
        } else {
            res.json({ error: "Failed to get an answer from GPT." });
        }
    } catch (error) {
        console.error("Error while processing /askGPT:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//======================================================================================================================================================

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
