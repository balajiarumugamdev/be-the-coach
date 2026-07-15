/* Mock data for the prototype. In the real build this comes from the
   content files (roadmap.json + content.md + quiz.json) and the Google Sheet. */

window.APP_DATA = {
  // ---- Roster: the token is the "login". Each maps to a person + role + track. ----
  roster: [
    { token: "nontech-nina",  name: "Nina",   role: "trainee-nontech", track: "non-technical" },
    { token: "tech-tara",     name: "Tara",   role: "trainee-tech",    track: "technical" },
    { token: "coach-carlos",  name: "Carlos", role: "coach" },
    { token: "manager-maya",  name: "Maya",   role: "manager" },
  ],

  roleLabels: {
    "trainee-nontech": "Non-Technical Trainee",
    "trainee-tech":    "Technical Trainee",
    "coach":           "Coach",
    "manager":         "Program Manager",
  },

  // ---- Courses (roadmaps). A trainee sees courses matching their track. ----
  courses: {
    "gform-app": {
      id: "gform-app",
      track: "non-technical",
      title: "Building a Google-Form-like App with Claude",
      description: "Build a real teacher-info app — React + Microsoft sign-in, storing to an Excel sheet — entirely by prompting Claude.",
      modules: [
        {
          id: "m0",
          title: "Orientation & setup",
          minutes: 15,
          content: `
            <h2>Module 0 — Orientation & setup</h2>
            <p>By the end of this course you will have built a working web app that collects
            teacher information and stores each submission as a row in an Excel sheet on your
            organisation's OneDrive — and you'll have built it <strong>without writing code
            yourself</strong>. You direct Claude; Claude writes the code.</p>

            <h3>The one loop you'll use the whole way</h3>
            <p>Every module uses the same rhythm:</p>
            <pre>Describe what you want  →  let Claude build it  →  run it  →  paste any error back  →  repeat</pre>
            <p>You don't need to understand every line Claude writes. You need to describe
            clearly, run what it gives you, and report back what happened.</p>

            <h3>Set up your tools</h3>
            <ul>
              <li>Install <strong>Node.js</strong> (the thing that runs the app on your computer).</li>
              <li>Install <strong>VS Code</strong> (where the project files live).</li>
              <li>Open <strong>Claude</strong> and sign in.</li>
              <li>Sign in once to your <strong>Microsoft 365</strong> work account.</li>
            </ul>

            <div class="prompt-box">
              <div class="label">Try this prompt in Claude</div>
              <p>"I'm on Windows and completely new to this. Walk me through installing Node.js
              and VS Code step by step, and tell me how to check they installed correctly."</p>
            </div>

            <p>When your tools are ready, take the quick check below to unlock Module 1.</p>
          `,
          quiz: {
            passThreshold: 0.5,
            questions: [
              { q: "In this course, who writes the actual code?", options: ["You, by hand", "Claude, guided by your prompts", "Nobody — it's no-code"], answer: 1 },
              { q: "What is the core build loop?", options: ["Describe → let Claude build → run → paste errors back → repeat", "Memorise syntax → type code → compile", "Copy from a tutorial"], answer: 0 },
            ],
          },
        },
        {
          id: "m1",
          title: "Prompting Claude to build software",
          minutes: 20,
          content: `
            <h2>Module 1 — Prompting Claude to build software</h2>
            <p>Good output starts with a good prompt. A strong prompt says <em>what</em> you
            want, <em>for whom</em>, and <em>what to do next</em>.</p>
            <h3>The shape of a good prompt</h3>
            <ul>
              <li><strong>Context:</strong> "I'm building a form app for teachers."</li>
              <li><strong>Goal:</strong> "I need a page that collects name, subject and email."</li>
              <li><strong>Constraint:</strong> "Keep it simple; I'm not a developer."</li>
              <li><strong>Next step:</strong> "Give me the exact commands to run it."</li>
            </ul>
            <h3>When something breaks</h3>
            <p>Copy the <em>entire</em> error message and paste it back with: "I got this error
            when I ran the app — what does it mean and how do I fix it?" Errors are normal and
            expected; pasting them back is how you make progress.</p>
            <div class="prompt-box">
              <div class="label">Try this prompt</div>
              <p>"Rewrite this vague request into a clear prompt: 'make me a form'. Assume it's
              for collecting teacher info and I'm a beginner."</p>
            </div>
          `,
          quiz: {
            passThreshold: 0.5,
            questions: [
              { q: "When the app shows an error, what should you do?", options: ["Give up and start over", "Paste the full error back to Claude and ask how to fix it", "Ignore it"], answer: 1 },
              { q: "A good prompt usually includes…", options: ["Only the word 'help'", "Context, goal, a constraint, and the next step you want", "As many technical terms as possible"], answer: 1 },
            ],
          },
        },
        {
          id: "m2",
          title: "Scaffold the React app",
          minutes: 20,
          content: `
            <h2>Module 2 — Scaffold the React app</h2>
            <p>"Scaffolding" means creating the empty project that everything else is built on.
            Claude will generate it and give you commands to run.</p>
            <div class="prompt-box">
              <div class="label">Try this prompt</div>
              <p>"Create a new React app using Vite called 'teacher-form'. Give me the exact
              terminal commands to create it, install everything, and start it — one step at a
              time, and tell me what I should see in the browser."</p>
            </div>
            <p>You'll typically run something like:</p>
            <pre>npm create vite@latest teacher-form
cd teacher-form
npm install
npm run dev</pre>
            <p>When the browser shows the starter page at <code>http://localhost:5173</code>,
            your app is running. That's the foundation.</p>
          `,
          quiz: {
            passThreshold: 0.5,
            questions: [
              { q: "What does 'scaffolding the app' mean?", options: ["Writing the final feature", "Creating the empty starter project to build on", "Deploying to the internet"], answer: 1 },
              { q: "Which command starts the app locally?", options: ["npm run dev", "npm delete", "git push"], answer: 0 },
            ],
          },
        },
        { id: "m3", title: "Build the teacher form UI", minutes: 25,
          content: `<h2>Module 3 — Build the teacher form UI</h2>
            <p>Now describe the fields you want and let Claude build the form.</p>
            <div class="prompt-box"><div class="label">Try this prompt</div>
            <p>"Add a form to my React app that collects a teacher's full name, email, subject
            taught, and years of experience. Make email required and validated. Keep the design
            clean and simple."</p></div>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "Who decides which fields the form has?", options: ["Claude picks randomly", "You describe them in the prompt", "They're fixed and cannot change"], answer: 1 },
            { q: "Why validate the email field?", options: ["To make the form longer", "So bad/empty emails aren't submitted", "It's not needed"], answer: 1 } ] } },

        { id: "m4", title: "Microsoft setup: register the app", minutes: 25,
          content: `<h2>Module 4 — Microsoft setup: register the app</h2>
            <p>This is a <strong>portal-clicks</strong> module, not code. In Microsoft Entra ID
            you register your app so Microsoft trusts it. You'll copy a <em>Client ID</em> and
            set a <em>redirect URI</em>. Claude gives you the exact click path.</p>
            <div class="notice">Some steps may need a tenant admin — have your coach available.</div>
            <div class="prompt-box"><div class="label">Try this prompt</div>
            <p>"Walk me through registering a Single-Page App in Microsoft Entra ID, step by
            step, so I can get a Client ID and set http://localhost:5173 as the redirect URI."</p></div>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "What is the Client ID used for?", options: ["It's your password", "It identifies your app to Microsoft", "It stores the form data"], answer: 1 },
            { q: "The redirect URI must…", options: ["Be left blank", "Match where your app runs (e.g. localhost during dev)", "Be a random value"], answer: 1 } ] } },

        { id: "m5", title: "Add Microsoft sign-in (MSAL)", minutes: 25,
          content: `<h2>Module 5 — Add Microsoft sign-in (MSAL)</h2>
            <p>MSAL is Microsoft's sign-in library. Claude adds it and wires a "Sign in with
            Microsoft" button using the Client ID from Module 4.</p>
            <div class="prompt-box"><div class="label">Try this prompt</div>
            <p>"Add Microsoft sign-in to my React app using @azure/msal-react. Here's my Client
            ID: &lt;paste&gt;. Add a Sign in / Sign out button and only show the form after login."</p></div>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "Why does the app need the user to sign in?", options: ["For decoration", "To get a token proving who they are, so it can write to their Excel sheet", "To slow things down"], answer: 1 },
            { q: "MSAL is…", options: ["A spreadsheet", "Microsoft's sign-in library", "A programming language"], answer: 1 } ] } },

        { id: "m6", title: "Grant Graph permissions", minutes: 15,
          content: `<h2>Module 6 — Grant Graph permissions</h2>
            <p>Your app must be allowed to write files on the user's behalf. You add the
            <code>Files.ReadWrite</code> permission and consent to it. Claude tells you exactly
            where to click.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "What does the Files.ReadWrite permission allow?", options: ["Reading your email", "The app to read/write files for the signed-in user", "Nothing"], answer: 1 },
            { q: "A permission that needs an admin to approve is called…", options: ["Admin consent", "A redirect", "A token"], answer: 0 } ] } },

        { id: "m7", title: "Prepare the Excel workbook", minutes: 15,
          content: `<h2>Module 7 — Prepare the Excel workbook</h2>
            <p>Graph writes rows into an existing <strong>table</strong>, not a blank sheet.
            Create an Excel file on OneDrive, add headers (Name, Email, Subject, Experience),
            and format them as a named Table.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "Graph adds a new row to…", options: ["Any blank cell", "An existing named table", "A Word document"], answer: 1 },
            { q: "What should the table headers match?", options: ["Nothing in particular", "The fields your form collects", "Random words"], answer: 1 } ] } },

        { id: "m8", title: "Write data with Microsoft Graph", minutes: 30,
          content: `<h2>Module 8 — Write data with Microsoft Graph</h2>
            <p>This is the payoff: when the teacher submits the form, Claude's code takes the
            sign-in token and calls Microsoft Graph to add a row to your Excel table.</p>
            <div class="prompt-box"><div class="label">Try this prompt</div>
            <p>"When the form is submitted, use the signed-in user's token to call Microsoft
            Graph and add a row to the table in my Excel file. Here's the file and table name:
            &lt;paste&gt;. Show a success message when it works."</p></div>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "What triggers the row being written?", options: ["Opening the app", "Submitting the form", "Closing the browser"], answer: 1 },
            { q: "What does the app send to Graph along with the data?", options: ["Nothing", "The access token from sign-in", "A screenshot"], answer: 1 } ] } },

        { id: "m9", title: "Test end-to-end & debug with Claude", minutes: 20,
          content: `<h2>Module 9 — Test end-to-end & debug with Claude</h2>
            <p>Fill the form, submit, and check that the row appears in your Excel file. If
            anything fails, paste the error back to Claude — that's the loop from Module 1.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "How do you confirm it worked?", options: ["Guess", "Check the row appeared in the Excel table", "Restart the computer"], answer: 1 },
            { q: "If you hit an error while testing, you…", options: ["Delete the project", "Paste the error to Claude and ask for a fix", "Ignore it"], answer: 1 } ] } },

        { id: "m10", title: "Publish the app", minutes: 20,
          content: `<h2>Module 10 — Publish the app</h2>
            <p>Finally, deploy the app so teachers can reach it. When the app moves to a real
            URL, remember to add that URL as a redirect URI in Entra ID (from Module 4).</p>
            <p><strong>Capstone:</strong> extend your app — add a confirmation message, an extra
            field, or a thank-you screen — using only prompts.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "After deploying to a real URL, what must you update?", options: ["Nothing", "Add the new URL as a redirect URI in Entra ID", "Reinstall Node"], answer: 1 },
            { q: "The capstone asks you to…", options: ["Rewrite everything by hand", "Extend the app using prompts", "Delete the app"], answer: 1 } ] } },
      ],
    },

    "reports-python": {
      id: "reports-python",
      track: "technical",
      title: "Automating Reports with Claude + Python",
      description: "A placeholder technical track so the Technical Trainee role has something to open in this prototype.",
      modules: [
        { id: "t0", title: "Set up Python & Claude Code", minutes: 15,
          content: `<h2>Module 0 — Set up Python & Claude Code</h2><p>Placeholder content for the technical track.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "This track is aimed at…", options: ["Technical trainees", "Coaches only", "Nobody"], answer: 0 },
            { q: "Placeholder question — pick the first option.", options: ["Correct", "Wrong", "Wrong"], answer: 0 } ] } },
        { id: "t1", title: "Read data with a script", minutes: 20,
          content: `<h2>Module 1 — Read data with a script</h2><p>Placeholder content.</p>`,
          quiz: { passThreshold: 0.5, questions: [
            { q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong"], answer: 0 },
            { q: "Placeholder — pick the first option.", options: ["Correct", "Wrong", "Wrong"], answer: 0 } ] } },
      ],
    },
  },
};
