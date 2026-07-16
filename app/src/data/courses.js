/* Mock data for the React rebuild. In production this is replaced by:
   - roster/roles  -> Google Sheet `Roster` tab
   - lesson content -> content/<track>/<module>/content.md in the repo
   - quiz questions  -> quiz.json (questions only)
   - quiz answers    -> Google Sheet `AnswerKeys` (server-side grading)
   Here everything is inline so the UI runs from mock data with no backend. */

export const ROLE_LABELS = {
  "trainee-nontech": "Non-Technical Trainee",
  "trainee-tech": "Technical Trainee",
  "coach": "Coach",
  "manager": "Program Manager",
};

// The token is the unique key -> resolves to one person + role + track.
export const ROSTER = [
  { token: "nontech-nina", name: "Nina", email: "nina@org.com", role: "trainee-nontech", track: "non-technical" },
  { token: "tech-tara", name: "Tara", email: "tara@org.com", role: "trainee-tech", track: "technical" },
  { token: "coach-carlos", name: "Carlos", email: "carlos@org.com", role: "coach" },
  { token: "manager-maya", name: "Maya", email: "maya@org.com", role: "manager" },
];

export const PASS_THRESHOLD = 0.8; // 80% to advance
export const DELIVER_COUNT = 5;    // questions shown per attempt (drawn from bank)

// helper to keep quiz objects terse
const quiz = (bank) => ({ deliverCount: DELIVER_COUNT, passThreshold: PASS_THRESHOLD, bank });

export const COURSES = {
  "gform-app": {
    id: "gform-app",
    track: "non-technical",
    title: "Building a Google-Form-like App with Claude",
    description: "Build a real teacher-info app — React + Microsoft sign-in, storing to an Excel sheet — entirely by prompting Claude.",
    intro: {
      about: `This course teaches you to build a working web application <strong>without writing code yourself</strong>.
        You'll describe what you want, and Claude writes the code. Along the way you'll learn the
        one skill that matters most: how to direct an AI assistant to build software for you.`,
      passing: `Each module ends with a short quiz. You need <strong>80%</strong> to pass and unlock the next module —
        each quiz has at least <strong>5 questions</strong>, drawn at random so you can't memorise answers.
        You must complete modules <strong>in order</strong>.`,
      capstone: `<strong>Your final project:</strong> a "Teacher Information" web app. Teachers sign in with their
        Microsoft account, fill in a form (name, subject, email, experience), and every submission is saved as a
        row in an Excel sheet on your organisation's OneDrive — built end to end, by you, using Claude.`,
    },
    helpNote: `<strong>Stuck or unsure?</strong> Don't push through confusion. Stop, and reach out to your
      coach for clarification before moving on — that's exactly what they're here for.`,
    modules: [
      {
        id: "m0", title: "Orientation & setup", minutes: 15, approved: true,
        content: `
          <h2>Module 0 — Orientation & setup</h2>
          <p>By the end of this course you'll have built a working app that collects teacher information and
          stores each submission in an Excel sheet — built <strong>without writing code yourself</strong>.
          You direct Claude; Claude writes the code.</p>
          <h3>The one loop you'll use the whole way</h3>
          <pre>Describe what you want  →  let Claude build it  →  run it  →  paste any error back  →  repeat</pre>
          <p>You don't need to understand every line. You need to describe clearly, run what you're given, and
          report back what happened.</p>
          <h3>Set up your tools</h3>
          <ul>
            <li>Install <strong>Node.js</strong> (runs the app on your computer).</li>
            <li>Install <strong>VS Code</strong> (where the project files live).</li>
            <li>Open <strong>Claude</strong> and sign in.</li>
            <li>Sign in once to your <strong>Microsoft 365</strong> work account.</li>
          </ul>
          <div class="prompt-box"><div class="label">Try this prompt in Claude</div>
          <p>"I'm on Windows and completely new to this. Walk me through installing Node.js and VS Code step by
          step, and tell me how to check they installed correctly."</p></div>`,
        quiz: quiz([
          { id: "m0q1", q: "In this course, who writes the actual code?", options: ["You, by hand", "Claude, guided by your prompts", "Nobody — it's fully automatic", "A hired developer"] },
          { id: "m0q2", q: "What is the core build loop?", options: ["Describe → let Claude build → run → paste errors back → repeat", "Memorise syntax, then type code", "Copy a finished tutorial", "Wait for IT to do it"] },
          { id: "m0q3", q: "Do you need to understand every line Claude writes?", options: ["Yes, all of it", "No — describe clearly, run it, report back", "Only the CSS", "Only on weekends"] },
          { id: "m0q4", q: "Which tool runs the app on your computer?", options: ["Excel", "Node.js", "PowerPoint", "Outlook"] },
          { id: "m0q5", q: "Where do the project files live while you build?", options: ["In your email", "In VS Code", "On a whiteboard", "In OneNote"] },
          { id: "m0q6", q: "What should you do when a step is confusing?", options: ["Skip it silently", "Stop and reach out to your coach", "Delete the project", "Guess and hope"] },
        ]),
      },
      {
        id: "m1", title: "Prompting Claude to build software", minutes: 20, approved: true,
        content: `
          <h2>Module 1 — Prompting Claude to build software</h2>
          <p>Good output starts with a good prompt. A strong prompt states <em>what</em> you want,
          <em>for whom</em>, and <em>what to do next</em>.</p>
          <h3>The shape of a good prompt</h3>
          <ul>
            <li><strong>Context:</strong> "I'm building a form app for teachers."</li>
            <li><strong>Goal:</strong> "I need a page that collects name, subject and email."</li>
            <li><strong>Constraint:</strong> "Keep it simple; I'm not a developer."</li>
            <li><strong>Next step:</strong> "Give me the exact commands to run it."</li>
          </ul>
          <h3>When something breaks</h3>
          <p>Copy the <em>entire</em> error and paste it back: "I got this error when I ran the app — what does it
          mean and how do I fix it?" Errors are normal; pasting them back is how you progress.</p>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"Rewrite this vague request into a clear prompt: 'make me a form'. Assume it's for collecting teacher
          info and I'm a beginner."</p></div>`,
        quiz: quiz([
          { id: "m1q1", q: "When the app shows an error, you should…", options: ["Give up", "Paste the full error to Claude and ask how to fix it", "Ignore it", "Restart Windows"] },
          { id: "m1q2", q: "A good prompt usually includes…", options: ["Just the word 'help'", "Context, goal, a constraint, and the next step", "As many technical terms as possible", "An apology"] },
          { id: "m1q3", q: "Why state a constraint like 'I'm not a developer'?", options: ["It's polite filler", "So Claude tailors the answer to your level", "It's required syntax", "To make the prompt longer"] },
          { id: "m1q4", q: "Errors while building are…", options: ["A sign you failed", "Normal and expected", "Always unfixable", "A virus"] },
          { id: "m1q5", q: "What makes Claude's output more useful?", options: ["Vaguer prompts", "Clear context and a specific goal", "Typing in ALL CAPS", "Fewer details"] },
        ]),
      },
      {
        id: "m2", title: "Scaffold the React app", minutes: 20, approved: true,
        content: `
          <h2>Module 2 — Scaffold the React app</h2>
          <p>"Scaffolding" means creating the empty project everything else builds on. Claude generates it and
          gives you commands to run.</p>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"Create a new React app using Vite called 'teacher-form'. Give me the exact terminal commands to
          create it, install everything, and start it — one step at a time — and tell me what I should see."</p></div>
          <p>You'll typically run:</p>
          <pre>npm create vite@latest teacher-form
cd teacher-form
npm install
npm run dev</pre>
          <p>When the browser shows the starter page at <code>http://localhost:5173</code>, your app is running.</p>`,
        quiz: quiz([
          { id: "m2q1", q: "What does 'scaffolding the app' mean?", options: ["Writing the final feature", "Creating the empty starter project", "Deploying to the internet", "Deleting files"] },
          { id: "m2q2", q: "Which command starts the app locally?", options: ["npm run dev", "npm delete", "git push", "shutdown"] },
          { id: "m2q3", q: "What confirms the app is running?", options: ["A blue screen", "The starter page at localhost:5173", "An email", "Nothing visible"] },
          { id: "m2q4", q: "Who gives you the exact commands to run?", options: ["You memorise them", "Claude, from your prompt", "The printer", "A colleague"] },
          { id: "m2q5", q: "'npm install' does what?", options: ["Uninstalls Windows", "Downloads the pieces the app needs", "Sends an email", "Prints the code"] },
        ]),
      },
      {
        id: "m3", title: "Build the teacher form UI", minutes: 25, approved: true,
        content: `<h2>Module 3 — Build the teacher form UI</h2>
          <p>Describe the fields you want and let Claude build the form.</p>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"Add a form to my React app that collects a teacher's full name, email, subject taught, and years of
          experience. Make email required and validated. Keep the design clean and simple."</p></div>`,
        quiz: quiz([
          { id: "m3q1", q: "Who decides the form's fields?", options: ["Claude picks randomly", "You describe them in the prompt", "They're fixed forever", "The browser"] },
          { id: "m3q2", q: "Why validate the email field?", options: ["To make the form longer", "So bad/empty emails aren't submitted", "It's decorative", "To slow users down"] },
          { id: "m3q3", q: "A clean, simple design helps because…", options: ["It looks more complex", "Teachers can fill it in easily", "It uses more code", "It's required by law"] },
          { id: "m3q4", q: "To change a field later, you…", options: ["Rebuild from scratch", "Ask Claude to adjust it", "Can't change it", "Email support"] },
          { id: "m3q5", q: "'Required' on a field means…", options: ["Optional", "It must be filled before submitting", "It's hidden", "It repeats"] },
        ]),
      },
      {
        id: "m4", title: "Microsoft setup: register the app", minutes: 25, approved: true,
        content: `<h2>Module 4 — Microsoft setup: register the app</h2>
          <p>This is a <strong>portal-clicks</strong> module, not code. In Microsoft Entra ID you register your app
          so Microsoft trusts it. You'll copy a <em>Client ID</em> and set a <em>redirect URI</em>.</p>
          <div class="notice">Some steps may need a tenant admin — have your coach available.</div>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"Walk me through registering a Single-Page App in Microsoft Entra ID step by step, so I can get a
          Client ID and set http://localhost:5173 as the redirect URI."</p></div>`,
        quiz: quiz([
          { id: "m4q1", q: "What is the Client ID for?", options: ["It's your password", "It identifies your app to Microsoft", "It stores form data", "It's the app's name"] },
          { id: "m4q2", q: "The redirect URI must…", options: ["Be blank", "Match where your app runs", "Be random", "Be your email"] },
          { id: "m4q3", q: "This module is mostly…", options: ["Writing code", "Clicking through the Microsoft portal", "Designing logos", "Sending emails"] },
          { id: "m4q4", q: "If a step needs approval you can't give, you…", options: ["Fake it", "Ask a tenant admin / your coach", "Skip the course", "Reinstall Windows"] },
          { id: "m4q5", q: "'Register the app' means…", options: ["Pay a fee", "Tell Microsoft your app exists and can sign users in", "Publish to an app store", "Back it up"] },
        ]),
      },
      {
        id: "m5", title: "Add Microsoft sign-in (MSAL)", minutes: 25, approved: true,
        content: `<h2>Module 5 — Add Microsoft sign-in (MSAL)</h2>
          <p>MSAL is Microsoft's sign-in library. Claude adds it and wires a "Sign in with Microsoft" button using
          your Client ID from Module 4.</p>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"Add Microsoft sign-in to my React app using @azure/msal-react. Here's my Client ID: &lt;paste&gt;.
          Add a Sign in / Sign out button and only show the form after login."</p></div>`,
        quiz: quiz([
          { id: "m5q1", q: "Why does the app need sign-in?", options: ["Decoration", "To get a token proving who the user is, so it can write to their sheet", "To slow it down", "For a logo"] },
          { id: "m5q2", q: "MSAL is…", options: ["A spreadsheet", "Microsoft's sign-in library", "A programming language", "A printer driver"] },
          { id: "m5q3", q: "After sign-in the app receives a…", options: ["Sticker", "Token", "Receipt", "Password in plain text"] },
          { id: "m5q4", q: "The Client ID used here comes from…", options: ["Module 4's app registration", "Thin air", "Your email", "Excel"] },
          { id: "m5q5", q: "A good design shows the form…", options: ["Before sign-in", "Only after the user signs in", "Never", "Twice"] },
        ]),
      },
      {
        id: "m6", title: "Grant Graph permissions", minutes: 15, approved: true,
        content: `<h2>Module 6 — Grant Graph permissions</h2>
          <p>Your app must be allowed to write files on the user's behalf. You add the
          <code>Files.ReadWrite</code> permission and consent to it. Claude tells you exactly where to click.</p>`,
        quiz: quiz([
          { id: "m6q1", q: "What does Files.ReadWrite allow?", options: ["Reading your email", "The app to read/write files for the signed-in user", "Nothing", "Deleting Windows"] },
          { id: "m6q2", q: "A permission an admin must approve is called…", options: ["Admin consent", "A redirect", "A token", "A macro"] },
          { id: "m6q3", q: "Permissions exist to…", options: ["Slow apps down", "Control what an app is allowed to do", "Add colour", "Store passwords"] },
          { id: "m6q4", q: "Who performs these clicks?", options: ["Claude remotely", "You, guided by Claude", "Microsoft support", "The browser alone"] },
          { id: "m6q5", q: "Files.ReadWrite is a…", options: ["Font", "Graph permission", "File name", "Spreadsheet formula"] },
        ]),
      },
      {
        id: "m7", title: "Prepare the Excel workbook", minutes: 15, approved: true,
        content: `<h2>Module 7 — Prepare the Excel workbook</h2>
          <p>Graph writes rows into an existing <strong>table</strong>, not a blank sheet. Create an Excel file on
          OneDrive, add headers (Name, Email, Subject, Experience), and format them as a named Table.</p>`,
        quiz: quiz([
          { id: "m7q1", q: "Graph adds a new row to…", options: ["Any blank cell", "An existing named table", "A Word doc", "A slide"] },
          { id: "m7q2", q: "The table headers should match…", options: ["Random words", "The fields your form collects", "Nothing", "Your email subject"] },
          { id: "m7q3", q: "Where does the Excel file live?", options: ["On a floppy disk", "On OneDrive / SharePoint", "In the printer", "In Claude"] },
          { id: "m7q4", q: "Why prepare the table before coding?", options: ["For decoration", "Because Graph needs an existing table to write into", "It isn't needed", "To use more storage"] },
          { id: "m7q5", q: "A 'named Table' in Excel is…", options: ["A chart", "A formatted range Graph can target", "A password", "A macro"] },
        ]),
      },
      {
        id: "m8", title: "Write data with Microsoft Graph", minutes: 30, approved: true,
        content: `<h2>Module 8 — Write data with Microsoft Graph</h2>
          <p>The payoff: when the teacher submits the form, Claude's code takes the sign-in token and calls
          Microsoft Graph to add a row to your Excel table.</p>
          <div class="prompt-box"><div class="label">Try this prompt</div>
          <p>"When the form is submitted, use the signed-in user's token to call Microsoft Graph and add a row to
          the table in my Excel file. Here's the file and table name: &lt;paste&gt;. Show a success message."</p></div>`,
        quiz: quiz([
          { id: "m8q1", q: "What triggers the row being written?", options: ["Opening the app", "Submitting the form", "Closing the browser", "Signing out"] },
          { id: "m8q2", q: "What does the app send to Graph with the data?", options: ["Nothing", "The access token from sign-in", "A screenshot", "A phone number"] },
          { id: "m8q3", q: "Microsoft Graph is…", options: ["A chart type", "The API to work with Microsoft 365 data", "A spreadsheet", "A browser"] },
          { id: "m8q4", q: "A success message is useful because…", options: ["It looks nice", "The teacher knows the submission worked", "It's required by Graph", "It saves the file"] },
          { id: "m8q5", q: "If the write fails, you…", options: ["Give up", "Paste the error to Claude to fix", "Delete Excel", "Ignore it"] },
        ]),
      },
      {
        id: "m9", title: "Test end-to-end & debug with Claude", minutes: 20, approved: true,
        content: `<h2>Module 9 — Test end-to-end & debug with Claude</h2>
          <p>Fill the form, submit, and check the row appears in your Excel file. If anything fails, paste the
          error back to Claude — the loop from Module 1.</p>`,
        quiz: quiz([
          { id: "m9q1", q: "How do you confirm it worked?", options: ["Guess", "Check the row appeared in the Excel table", "Restart the PC", "Ask a friend"] },
          { id: "m9q2", q: "Hit an error while testing? You…", options: ["Delete the project", "Paste the error to Claude for a fix", "Ignore it", "Start a new career"] },
          { id: "m9q3", q: "'End-to-end' testing means…", options: ["Testing one button", "Checking the whole flow from form to saved row", "Reading the code", "Only signing in"] },
          { id: "m9q4", q: "Testing is important because…", options: ["It wastes time", "It proves the app really works for teachers", "It's optional flair", "Graph requires it"] },
          { id: "m9q5", q: "If the row is missing, likely causes include…", options: ["Wrong table name or a sign-in/permission issue", "The moon phase", "Too many teachers", "The printer"] },
        ]),
      },
      {
        id: "m10", title: "Publish the app", minutes: 20, approved: true,
        content: `<h2>Module 10 — Publish the app</h2>
          <p>Deploy the app so teachers can reach it. When it moves to a real URL, add that URL as a redirect URI
          in Entra ID (from Module 4).</p>
          <p><strong>Capstone:</strong> extend your app — add a confirmation message, an extra field, or a
          thank-you screen — using only prompts.</p>`,
        quiz: quiz([
          { id: "m10q1", q: "After deploying to a real URL, you must…", options: ["Do nothing", "Add the new URL as a redirect URI in Entra ID", "Reinstall Node", "Change your password"] },
          { id: "m10q2", q: "The capstone asks you to…", options: ["Rewrite everything by hand", "Extend the app using prompts", "Delete the app", "Take a test only"] },
          { id: "m10q3", q: "'Publish/deploy' means…", options: ["Print the code", "Put the app online so others can use it", "Email the file", "Back up to USB"] },
          { id: "m10q4", q: "Why update the redirect URI after deploy?", options: ["For fun", "Sign-in must match the app's new address", "Graph demands payment", "To add colour"] },
          { id: "m10q5", q: "By now you've learned to…", options: ["Write code from memory", "Direct Claude to build and extend a real app", "Avoid computers", "Only use Excel"] },
        ]),
      },
    ],
  },

  "reports-python": {
    id: "reports-python",
    track: "technical",
    title: "Automating Reports with Claude + Python",
    description: "Placeholder technical track so the Technical Trainee role has a course to open.",
    intro: {
      about: `A placeholder technical course. In the real build this becomes a full track for technical trainees.`,
      passing: `Each module needs <strong>80%</strong> across <strong>5+ questions</strong> to advance.`,
      capstone: `<strong>Final project:</strong> a script that reads data and produces a formatted report — built with Claude.`,
    },
    helpNote: `<strong>Stuck?</strong> Stop and reach out to your coach before moving on.`,
    modules: [
      {
        id: "t0", title: "Set up Python & Claude Code", minutes: 15, approved: true,
        content: `<h2>Module 0 — Set up Python & Claude Code</h2><p>Placeholder content for the technical track.</p>`,
        quiz: quiz([
          { id: "t0q1", q: "This track is aimed at…", options: ["Technical trainees", "Coaches only", "Nobody", "Managers"] },
          { id: "t0q2", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t0q3", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t0q4", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t0q5", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
        ]),
      },
      {
        id: "t1", title: "Read data with a script", minutes: 20, approved: true,
        content: `<h2>Module 1 — Read data with a script</h2><p>Placeholder content.</p>`,
        quiz: quiz([
          { id: "t1q1", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t1q2", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t1q3", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t1q4", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
          { id: "t1q5", q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong", "Wrong"] },
        ]),
      },
    ],
  },
};

export function findUser(token) {
  return ROSTER.find((r) => r.token === token) || null;
}
export function coursesForTrack(track) {
  return Object.values(COURSES).filter((c) => c.track === track);
}
