
const express = require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAIApi = require('openai');
const app = express();
const port = 3000;
const path = require('path');

// Configuration
const CONFIG = {
    API_ENDPOINT: 'http://13.58.229.43:3000'
};

// Middleware variables
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'Vieworthy' directory
app.use(express.static(path.join(__dirname, '../../')));

//API Key for OpenAI
process.env.OPENAI_API_KEY = 'aaaa';
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });

timestamps_and_text = `
0:00; - All right, so today I got a hold of
0:01; and got to poke around the new iPhone 15
0:04; and the iPhone 15 Pros.
0:05; I do remember flying here and I'm thinking
0:07; what could Apple possibly do?
0:09; Like what could they possibly
introduce with a new iPhone,
0:11; the 23rd iPhone that's
actually interesting?
0:14; Now, there is more stuff
0:15; than just the iPhone that was mentioned
0:17; at this Wonderlust event that Apple hosted
0:19; including some stuff that straight up
0:20; wasn't mentioned on stage at
all, so we'll get to that.
0:24; But this is just the new iPhone stuff.
0:25; So stay tuned and get
subscribed to see the rest.
0:27; But let's just talk about
the new iPhone 15 and 15 Pro.
0:30; So here's a lens to look
at all this stuff through.
0:32; Coming into this, basically
everything Apple just added
0:35; to their newest flagship
phones falls into two buckets.
0:38; It's either something we've already seen
0:40; in some other phone for years,
0:42; or it's some ecosystem feature
0:44; that only works with other iPhones,
0:46; which is not necessarily a bad thing,
0:47; but it's just a lens to
look through this stuff at,
0:50; just to keep an eye on it.
0:51; So this is the iPhone 15.
0:53; There's the same two sizes, again,
0:54; iPhone 15 and iPhone 15 Plus.
0:57; And yeah, you know there's
some small changes,
1:00; like the slight soft corner
radii on the aluminum rails
1:04; and the one piece glass back
1:06; fading between a lighter
and darker version
1:08; of the same color, like this new pink one.
1:10; It's pretty seamless.
1:12; Also, satin soft touch backs
1:13; across the whole lineup instead of glossy.
1:15; I definitely like that.
1:17; But the big headlining
feature really is its USB now.
1:21; Lightning is officially dead.
1:23; These new iPhones are all
USB-C across the board.
1:26; Now on one hand, this is a huge deal,
1:28; like there's only ever
been one port change
1:30; in the iPhone ever.
1:31; Back in 2012, it went from
that 30-pin connector thing
1:35; to this new lightning thing,
which we've had ever since.
1:38; And now the second one ever is USB type C.
1:41; But on the other hand it's,
I don't know, it's just USB.
1:43; Like it's the same port
all these other laptops
1:46; and tablets all over the planet have had
1:48; for the past couple years.
1:49; I imagine that might
be another year or two
1:51; before the whole lineup,
like the baseline cheap iPad
1:54; and the iPhone SE and
everything else gets USB-C.
1:57; But yeah, I don't know.
1:58; We knew it was coming, but
it's still kind of surreal
2:00; to look at an iPhone and
see a USB port on it.
2:04; So what does this enable
is a real question, right?
2:06; First of all, it's the one
cable that you can ideally use
2:09; to charge all your stuff,
so your Mac, your iPad,
2:13; your iPhone, your friend's Android phone,
2:16; the new AirPods which
just got a new USB-C case.
2:19; All that stuff, one cable.
2:21; Oh, and now you can charge accessories
2:23; like the new AirPods with the wire.
2:25; So there's no wireless
reverse charging right now,
2:27; but that C to C cable
that comes in the box,
2:30; you can like plug it into the iPhone,
2:31; plug it into the AirPods
2:32; and charge the AirPods up
from the iPhone battery.
2:35; So that's pretty cool.
2:36; But they did hold back
on one very key thing
2:39; and they saved it for the iPhone 15 Pro.
2:42; So I'll get to that in a
bit, but that's the USB-C.
2:45; Aside from that, really it's
a slightly updated phone.
2:48; It's a little bit of a new display.
2:49; You know, you get the Dynamic
Island here, of course,
2:51; on these baseline iPhones
2:52; and there's also now a
higher peak brightness,
2:54; 2,000 nits now
2:55; which is twice as bright
as the iPhone 14s.
2:58; And there's a new camera.
2:59; The primary camera is
now a 48-megapixel chip,
3:02; presumably the same one
3:03; that was in the iPhone 14 Pro last year
3:06; and all the benefits that come with that.
3:07; And then the rest of the phone
3:08; really follows that same formula.
3:10; They do this thing where
the new baseline phone
3:12; is basically last year's
Pro phone repackaged,
3:15; so it inherits the same A16 Bionic chip
3:18; from last year's Pro phone.
3:20; The coolest feature of this phone though,
3:22; and you know, it's also on the Pro phone
3:23; but I still think it's pretty solid,
3:25; is the camera has this new
next-generation portrait mode
3:29; but basically it automatically detects
3:31; when there's a subject in a photo
3:32; and captures all of the
depth information needed
3:35; to be able to turn it into
a portrait mode photo later.
3:39; So you don't have to remember
3:40; to switch it to portrait
mode necessarily every time.
3:43; And if you ever forget but
want to add that blur later,
3:46; you can do it with high quality results.
3:48; So that's cool.
3:49; Aside from that, the rest of the phone,
3:50; I mean it's the same thing, right?
3:52; Same sizes, guys, same ceramic shield,
3:54; same dust and water resistance
3:57; and same starting prices, 799 for the 15
4:00; and 899 for the 15 Plus.
4:02; So then there is the Pro phones,
4:04; the iPhone 15 Pro and 15 Pro Max.
4:08; There is some more new here.
4:09; A lot of it, I'm actually
gonna want to test
4:11; just to see if it's
actually what they say,
4:13; but make sure you get subscribed
to see those full reviews
4:16; when they come out later this
month and we can figure out
4:18; if the phones are worth it.
4:18; But basically it's not bleeding edge stuff
4:21; that we've never seen before.
4:22; It's just welcome stuff.
4:24; And those are mostly in build quality,
4:27; the chip inside, and the cameras.
4:29; So let's just start with the chip inside.
4:30; First of all, it's a brand new chip
4:32; that's called the A17 Pro.
4:34; It's the first time
they've used the word Pro
4:36; in an iPhone chip,
4:37; and it's their first three nanometer chip,
4:39; so it promises some performance
4:40; and efficiency improvements as a result.
4:42; I think they said it's like 10% faster
4:44; high performance cores
and the neural engines
4:47; up to twice as fast, bunch of other stuff.
4:48; Not sure how much of this
you'll actually notice
4:50; in everyday use, but hey,
4:51; future proofing and headroom
is never a bad thing,
4:53; so this is clearly a powerful chip.
4:56; They showed a demo of a game
with like faster ray tracing
4:58; which isn't new, but you know,
it helped make their point.
5:00; But the interesting thing
to note here with this chip
5:03; is they mentioned the chip has
a new USB 3 controller on it,
5:09; which means the 15 and
15 Plus don't have that.
5:14; So basically that means
the Pro iPhones USB-C port
5:17; actually gets upgraded USB 3 speeds,
5:20; the faster data transfer speeds
5:22; up to 10 gigabits per second,
5:24; but the base iPhones
without that controller,
5:26; they get USB-C,
5:27; but they're gonna be
stuck at USB 2.0 speeds.
5:31; Basically the same we've
always had with lightning,
5:33; like 480 megabits per second.
5:35; Now this probably won't
make a real difference
5:38; to most people.
5:39; Like I don't know when the last time
5:40; you plugged your phone in was,
5:41; but it's kind of a bummer
that not all of the benefits
5:44; of USB-C come to all of the
phones, but for the Pro phones
5:48; that are gonna be
shooting more ProRes video
5:50; or ProRaw photos, I mean it takes forever.
5:54; If you've shot this stuff like I have,
5:56; you know it takes forever to
get those off of the phone
5:58; 'cause they're big files.
6:00; So I kind of wish they'd gone all the way.
6:01; I wish they'd done Thunderbolt speeds,
6:03; 20, 30, 40 gigabits per second.
6:07; But yeah, it's just gonna
be USB 3 on the Pro iPhones
6:12; and USB 2 on the base iPhones.
6:15; You know what is disappointing, though?
6:16; No fast charging.
6:19; I talked about this on
the podcast on "Waveform."
6:21; I'll try to link the episode below,
6:22; but like switching to USB-C, you'd think,
6:24; oh, this is a huge opportunity for Apple
6:26; to like explain why they're doing it,
6:28; and we know why they're doing it,
6:31; but oh, why are you
giving us this new port
6:33; and all this big new USB-C deal
6:35; and it's just the same 20 or
so watt charging we've had
6:40; for the iPhone for forever,
no new fast charging.
6:43; Kind of figured they would
try to do that better.
6:45; But yeah, this will still
take an hour and a half,
6:47; two hours to charge.
6:48; But anyway, the new design
6:49; is what most people are fawning over
6:51; at the moment with the pros.
6:52; So they have switched the rails
6:54; from that shiny
fingerprint stainless steel
6:56; to this new grade 5 titanium alloy
6:59; with a brushed texture.
7:01; And it's nice.
7:03; First of all, it's noticeably
lighter in the hand,
7:05; which I love and it seems
like it's also enabled them
7:08; to shrink the body of the Pro
iPhones just a little bit.
7:10; So they have the same screen sizes,
7:12; but the screens now get
even closer to the edges
7:14; and there's even slightly thinner bezels.
7:17; And I actually do notice that.
7:18; Now, a lot of people are
also quoting stronger
7:20; as one of the benefits too,
but I really don't think
7:22; this is gonna make as much of a difference
7:24; as people are thinking.
7:25; Like the Pro iPhones have had
this stainless steel rails
7:28; for a while now.
7:29; I've dropped this phone,
7:31; as you know, I don't have
a case, on the ground.
7:33; I've dented the stainless steel rails.
7:35; It's fine, it doesn't break.
7:36; It's not the stainless steel that breaks,
7:38; it's the glass that breaks.
7:40; And as far as we can tell,
7:41; it's the same ceramic shield
glass on the iPhone 15 Pro.
7:45; That hasn't changed.
7:46; So if you drop it on the glass,
7:48; you're still gonna have not great results.
7:51; But yeah, technically,
sure, titanium is stronger.
7:54; Either way, the new colors are black,
7:56; white and this new blue
which is really subtle,
7:59; and then natural which I
guess, it kind of embraces
8:03; the raw titanium feel.
8:04; Reminds me of "Starlight,"
if you're curious.
8:06; Kinda like this warm tone.
8:08; Weirdly, I think I like it the most.
8:09; But also something else
Apple set on stage,
8:11; and this was pretty quick
8:12; so you might not have even picked it up,
8:13; but they did mention
that they have redesigned
8:15; a bit of the interior of the chassis
8:18; to make the back glass more replaceable.
8:21; So it's a more repairable iPhone design.
8:23; Technically.
8:24; It's a small thing, it's
just one little step,
8:25; but it's a step in the right direction
8:27; for a more repairable iPhone.
8:29; But my favorite feature,
8:30; and before we get to any of the cameras,
8:31; I honestly think this
is my favorite feature,
8:33; is the new action button,
a new customizable button
8:39; on the side of the iPhone,
just the Pro iPhone.
8:41; So it replaces the mute
switch, which is pretty iconic,
8:45; but it's in the same
spot as the mute switch
8:47; and it's actually customizable.
8:49; So it's a pretty small button,
8:50; basically about the
same size as the switch.
8:53; And by default, it actually behaves
8:54; just like the mute switch did.
8:56; So you actually hold it down
8:57; to switch between muted
or ringer on, great.
9:01; But if you dive into the settings,
9:02; there's actually a section
for this action button
9:05; and it's actually really
in depth and super solid.
9:08; It basically lets you go through and pick
9:10; the function of the button,
9:11; and there's way more here than I expected.
9:13; So you can keep the mute switch on,
9:15; or you can have it switch you
9:17; in and out of a certain focus
mode, like do not disturb,
9:20; or you could pick whichever
other one you want.
9:22; You could also have it
auto launch the camera
9:24; and pick whichever camera mode it opens.
9:27; You could also do flashlight turning on
9:29; or opening up voice memos, or
it can toggle the magnifier.
9:34; Or the last option actually
is you can have it trigger
9:36; a series shortcut, which as you know,
9:37; can technically do almost anything,
9:39; including basically launching
any app on your phone.
9:42; I think there may be a bit of
a delay from the button press
9:46; to the app opening, if I'm
thinking about this correctly,
9:49; like it's done in the past
9:49; but I'll have to test
that for the full review.
9:51; But theoretically, you can map this button
9:53; to open whatever, your calendar
app, your to-do list app,
9:56; whatever app you want
9:57; which is totally not what I expected
9:59; to be on the list of things you could do
10:00; with a new button on
the side of the iPhone.
10:02; But now you can.
10:03; But then last but not least,
10:04; the new cameras across the board here.
10:06; There's a new larger 48-megapixel
main sensor for the Pros
10:09; and improved ultra wide.
10:11; And then the Pro Max, just the Pro Max
10:14; gets a new intricate
folding 5X telephoto camera.
10:19; I'm guessing if I asked Apple,
10:20; they would say that
there is only enough room
10:22; in the bigger Pro Max to
fit this folding lens.
10:26; I'll ask, we'll see what they say.
10:27; But until then, the regular 15 Pro
10:29; is gonna still have the 3X telephoto,
10:32; the regular 3X from last year.
10:33; And then we found this
seemingly random feature,
10:35; it's in the settings,
10:36; they also talked about it in the keynote,
10:38; but where you can change
your default focal length
10:42; to be either 1X or 1.2X
or 1.5X, for some reason.
10:49; So it's buried in the middle
of the camera settings,
10:51; but you can tell it to default
10:53; to one of these specific
three focal lengths.
10:56; So if you switch back to the camera app,
10:59; that 1X button is now
always going to take you
11:01; to the new focal length
that you've chosen.
11:03; And you can still get to 1X
11:05; or whatever other focal length you want,
11:07; but I just found that interesting.
11:10; If you're someone that
takes 1.2X photos so often
11:13; that you want a button to
get there as fast as possible
11:16; 'cause it's the perfect focal
length for you, then sure.
11:19; Maybe if you're a photographer,
11:20; you don't wanna do the
work of digital cropping,
11:22; just hit that focal
length every time, sure.
11:25; But there's been a lot of comments
11:26; that at the end of the
day, it feels like USB
11:28; is literally the biggest
headlining new feature
11:30; of this year's new iPhone, which is crazy.
11:34; I can't quite get rid of
my lightning cable yet.
11:38; There's still some accessories,
there's like MagSafe Duo
11:41; there's AirPods Max, there's
like the Magic Trackpad,
11:44; there's a couple things that
still are lightning now,
11:46; maybe they'll switch that
in the next couple months.
11:48; But now I'm genuinely curious
if there's going to be
11:49; a bunch of new USB-C phone accessories
11:52; because of of the iPhone getting USB-C,
11:55; similar to our sponsor
of this video, Anker.
11:57; So they've made a whole
new lineup of products
11:59; for the iPhone 15
headlined by the Anker Nano
12:02; which is like this little small
but mighty USB-C power bank
12:05; that can crank out 30 watts
with the built-in USB-C cable
12:09; and it can also charge it up 30 watts.
12:10; And if you have that little
button up at the top here,
12:12; it'll actually show a literal percentage
12:13; of how much battery you have
left, or if you're plugged in,
12:16; it'll show you a time which
counts down so you really know
12:19; exactly how much of the 10,000
milliamp-hours you have left.
12:22; Plus there's some other
stuff in the lineup.
12:24; There's a wall charger,
braided USB-C cables galore.
12:27; So feel free to learn more
about Anker's new lineup
12:29; at the link below
12:30; and shout out to Anker
for sponsoring this video.
12:31; So iPhone 15 Pro will start at
the same price as last year,
12:34; which is 999,
12:35; but they've bumped up
iPhone 15 Pro Max sneakily.
12:39; Interestingly, it will start at 1,199
12:42; but it's also the only
one with the 5X camera
12:44; and it's the only one
that starts at 256 gigs.
12:48; And last year, the price of
the 256 gig Pro was the same,
12:52; so you're kind of matching.
12:54; It's just like getting
rid of the $1,100 phone,
12:56; for some reason.
12:58; Either way, let me know
if you're interested
13:00; in these new iPhones at all.
13:02; You're either in camp don't care at all,
13:04; or you're in camp like
totally getting one of these.
13:06; Or maybe you're watching
to see if the reviews
13:08; prove that the new features are worth it.
13:10; Let me know what you're thinking.
13:12; Comment section's always open.
13:13; Thanks for watching, and I'll
catch you in the next one.
13:16; Get subscribed.
13:17; See you later.
13:18; Peace.
13:18; (cool music)`

// Instead of joining all the values, format it more clearly
const formattedTranscript = timestamps_and_text;

const prompt_text = `
Likes: 1000
Title: Sample Title
Description: Sample Description
Transcript:
${formattedTranscript}
`;

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

function extractAndFormatTranscript(transcript) {
    // Splitting the transcript into lines
    const lines = transcript.split("\n");

    // Dictionary to hold the formatted content
    let formattedContent = {};

    // Helper function to format a line into the desired dictionary style
    function formatLine(line) {
        const parts = line.split(" seconds");
        if (parts.length >= 2) {
            const totalSeconds = parseInt(parts[0]);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const timeStr = minutes + ":" + String(seconds).padStart(2, '0');
            return [timeStr, parts[1].trim()];
        }
        return null;
    }

    for (let line of lines) {
        const formattedLine = formatLine(line);
        if (formattedLine) {
            formattedContent[formattedLine[0]] = formattedLine[1];
        }
    }

    return formattedContent;
}

//======================================================================================================================================================

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
