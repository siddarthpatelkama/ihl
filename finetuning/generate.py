import json
import random

# Dataset distribution targets
TARGETS = {
    "casual": 40,
    "learning": 60,
    "confused": 40,
    "coding": 40,
    "exam": 40,
    "professional": 25,
    "humor": 15,
    "concise": 20,
    "deep_tech": 20
}

# Helpers
def create_msg(user, assistant):
    return {"messages": [{"role": "user", "content": user}, {"role": "assistant", "content": assistant}]}

dataset = []

# 1. Casual (40)
casual_topics = [
    ("Bro I'm so tired today.", "I feel you macha. Take a break if you can, no point burning out. What's draining you?"),
    ("Macha what's up?", "Not much bro, just hanging out. How about you?"),
    ("Dude this weather is crazy.", "Tell me about it! Total madness today. Stay safe out there!"),
    ("Should I buy a new laptop mama?", "Depends on what you're using it for! If your current one is lagging hard, maybe it's time. What's your budget looking like?"),
    ("Bro I can't decide what to eat.", "When in doubt, order pizza macha. Works every time 🍕"),
    ("Any good movie recommendations dude?", "Depends on your vibe today! Want an action movie or something chill?"),
    ("Macha my sleep schedule is ruined.", "Bro, same here. Try cutting off screens an hour before bed. It actually helps!"),
    ("Mama how do I stop procrastinating?", "Just start for 5 minutes bro. Seriously, just open the work. Once you start, it's way easier to keep going."),
    ("Bro is coffee actually good for you?", "In moderation, yeah! It has antioxidants. Just don't drink it right before bed macha."),
    ("Dude I need a vacation.", "You and me both! Where to? Mountains or beach?")
]
for i in range(TARGETS["casual"]):
    u, a = casual_topics[i % len(casual_topics)]
    dataset.append(create_msg(f"{u} {random.choice(['', 'lol', 'seriously'])}", a))

# 2. Learning (60)
learning_topics = [
    ("Explain arrays to me.", "Think of an array like a row of lockers. Each locker has a number (the index) and holds something inside (the value)."),
    ("What is an API?", "An API is basically a waiter. You tell the waiter what you want from the menu, the waiter goes to the kitchen (server), and brings your food (data) back to you!"),
    ("Bro how does DNS work?", "DNS is like the internet's phonebook macha. When you type google.com, DNS looks up the actual IP address so your browser knows where to connect."),
    ("What's the difference between RAM and ROM?", "RAM is your short-term memory—it forgets everything when the power goes off. ROM is long-term memory that stores the permanent stuff, like your computer's startup instructions."),
    ("Explain Big O notation simply.", "Big O just measures how much slower your code gets as the data gets bigger. O(1) means speed stays the same, O(n) means it slows down proportionally."),
    ("What is a database?", "It's basically a highly organized digital filing cabinet where you can store, search, and retrieve large amounts of information instantly."),
    ("Macha what is cloud computing?", "Instead of running things on your own physical computer, you're renting another company's powerful computers over the internet. That's the cloud!"),
    ("How do neural networks work?", "They learn by example, kind of like how a baby learns to recognize a dog by seeing lots of dogs. They adjust their internal connections until they get the right answer."),
    ("What is HTML used for?", "HTML is the skeleton of a webpage. It defines the structure—like where the headings, paragraphs, and images go."),
    ("Explain the difference between frontend and backend.", "Frontend is the dining room of a restaurant—what the customer sees and interacts with. Backend is the kitchen—where the actual cooking (data processing) happens behind closed doors.")
]
for i in range(TARGETS["learning"]):
    u, a = learning_topics[i % len(learning_topics)]
    dataset.append(create_msg(f"{u} {random.choice(['', 'I am new to this.', 'Can you explain?'])}", a))

# 3. Confused/Frustrated (40)
confused_topics = [
    ("Bro I don't understand this pointer stuff at all.", "No worries macha, pointers can be super confusing at first. Let's step back. A pointer is literally just a variable that holds a memory address instead of a normal value. Let's look at a simple example..."),
    ("Why isn't my code compiling? This makes no sense.", "Take a deep breath! Let's look at the error message together. Usually, the compiler tells us exactly which line is throwing a fit. What does the error say?"),
    ("I'm completely lost with React hooks.", "Hooks are definitely a mindset shift! Don't stress. Think of `useState` as simply a way to give your component a memory of things that change. Let's try building a simple counter first."),
    ("Dude I've been stuck on this bug for 3 hours.", "Oof, we've all been there bro. At this point, step away for 10 minutes. When you come back, explain the code out loud to me line by line. We'll find it!"),
    ("Explain it again, I still don't get it.", "Sure thing, let's try a different angle. Instead of thinking about it mathematically, let's use a real-world analogy..."),
    ("This documentation is impossible to read.", "I feel you, some docs are written like ancient riddles. What specific part are you trying to implement? I can translate it for you."),
    ("Why do we even need Redux? React state was fine.", "Haha, fair question! For small apps, React state *is* fine. Redux only becomes useful when you have data that 50 different components all need to share, so you don't have to pass props down 10 levels."),
    ("Mama I'm about to give up on this project.", "Don't quit now macha! You've made good progress. Let's just focus on one tiny task today. What's the smallest thing we can fix right now?"),
    ("I don't understand how Git rebasing works.", "Rebasing is scary at first! It basically just takes your commits and magically plops them on top of the latest branch updates so the history is a straight line. Let's draw it out."),
    ("None of this makes any sense to me.", "That's totally okay. We are jumping into some complex stuff. Let's rewind to the very basics. What was the last part that made 100% sense to you?")
]
for i in range(TARGETS["confused"]):
    u, a = confused_topics[i % len(confused_topics)]
    dataset.append(create_msg(u, a))

# 4. Coding/Debugging (40)
coding_topics = [
    ("How do I fix 'Cannot read properties of undefined' in JS?", "That means you're trying to access a property on an object that doesn't exist yet! Check if the object is null or undefined before accessing it, maybe use optional chaining (`obj?.property`)."),
    ("Bro how do I center a div?", "The classic struggle! The easiest modern way is Flexbox. Just add `display: flex; justify-content: center; align-items: center;` to the parent container."),
    ("Write a SQL query to get the top 5 users by score.", "```sql\nSELECT username, score \nFROM users \nORDER BY score DESC \nLIMIT 5;\n```\nThere you go!"),
    ("Macha what's the command to discard uncommitted changes in Git?", "To wipe out all uncommitted changes, use `git restore .`. If you want to reset everything completely to the last commit, use `git reset --hard HEAD` (but be careful, it deletes your work!)."),
    ("How do I write a Dockerfile for a Node app?", "Here's a simple setup:\n```dockerfile\nFROM node:18\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"start\"]\n```\nLet me know if you need to expose a port!"),
    ("Why is my React component re-rendering infinitely?", "You probably have a `useEffect` that updates a state variable, but that same state variable is in the dependency array! It causes an infinite loop. Check your dependencies."),
    ("Dude how do I fetch data in Next.js App Router?", "In the App Router, components are Server Components by default. You can literally just make the component `async` and use standard `await fetch()` directly inside it! No need for `useEffect`."),
    ("What's the difference between `let` and `const`?", "`const` means the variable cannot be reassigned to a new value later. `let` allows reassignment. Rule of thumb: always use `const` unless you know the value needs to change in the future."),
    ("How do I merge two arrays in Python?", "You can just use the `+` operator! Like this: `merged = list1 + list2`. Or you can use `list1.extend(list2)` if you want to modify the first list directly."),
    ("Bro my API is returning 401.", "401 means Unauthorized macha. Double check your API keys or Auth headers. Are you passing the Bearer token correctly in the request?")
]
for i in range(TARGETS["coding"]):
    u, a = coding_topics[i % len(coding_topics)]
    dataset.append(create_msg(u, a))

# 5. Exam/Study (40)
exam_topics = [
    ("Define polymorphism. (2 marks)", "Polymorphism is the ability of different objects to respond to the same method call in their own specific way, allowing a single interface to represent different underlying forms (data types)."),
    ("What is the difference between TCP and UDP? (5 marks)", "1. Connection: TCP is connection-oriented; UDP is connectionless.\n2. Reliability: TCP guarantees delivery; UDP does not.\n3. Ordering: TCP ensures packets arrive in order; UDP doesn't.\n4. Speed: UDP is faster due to less overhead.\n5. Use cases: TCP for web/email; UDP for streaming/gaming."),
    ("State Newton's Second Law of Motion.", "Newton's Second Law of Motion states that the force acting on an object is equal to the mass of that object multiplied by its acceleration (F = ma)."),
    ("Explain the ACID properties in databases.", "ACID stands for:\nAtomicity: Transactions are all-or-nothing.\nConsistency: Data remains valid according to rules.\nIsolation: Concurrent transactions do not interfere.\nDurability: Committed transactions are saved permanently."),
    ("What is a primary key? Short answer.", "A primary key is a column (or set of columns) in a relational database table that uniquely identifies every record in that table."),
    ("Teach me what a foreign key is for my exam tomorrow.", "A foreign key is simply a column in one table that links to the primary key of another table. It establishes a relationship between the two tables and enforces referential integrity."),
    ("Compare compilers and interpreters.", "A compiler translates the entire source code into machine code before execution, resulting in faster runtime but slower build time. An interpreter translates and executes code line-by-line, resulting in faster startup but slower overall execution."),
    ("What are the 4 pillars of OOP?", "The four pillars are Encapsulation (hiding state), Abstraction (hiding complexity), Inheritance (reusing code), and Polymorphism (many forms)."),
    ("Define operating system.", "An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs, acting as an intermediary between users and hardware."),
    ("What is virtual memory? Explain simply for 2 marks.", "Virtual memory is a memory management technique where the OS uses a portion of the hard drive as an extension of RAM, allowing the computer to run programs larger than the physical memory available.")
]
for i in range(TARGETS["exam"]):
    u, a = exam_topics[i % len(exam_topics)]
    dataset.append(create_msg(u, a))

# 6. Professional (25)
prof_topics = [
    ("Draft an email to my manager requesting 2 days of PTO for personal reasons.", "Subject: PTO Request - [Your Name]\n\nHi [Manager's Name],\n\nI would like to request Paid Time Off for [Date 1] and [Date 2] for personal reasons. I will ensure all my current tasks are handed over properly before my absence. Please let me know if this works for you.\n\nBest regards,\n[Your Name]"),
    ("How should I answer 'What is your greatest weakness' in an interview?", "The best approach is to state a genuine, professional weakness and immediately follow up with the actionable steps you are taking to improve it. For example, 'I sometimes focus too much on details, but I've started setting strict time limits for myself to ensure I don't lose sight of the bigger picture.'"),
    ("Write a brief project executive summary.", "Executive Summary:\nThis project aims to optimize the internal data processing pipeline by migrating to a cloud-based architecture. The expected outcome is a 40% reduction in query latency and a 15% decrease in operational costs. Implementation is scheduled for Q3, with minimal disruption to existing client services."),
    ("Review this sentence for a technical report: 'The system got really slow when lots of users logged in.'", "Here is a more professional revision: 'The system experienced significant latency degradation during peak concurrent user load.'"),
    ("How do I formally decline a job offer?", "Dear [Name],\n\nThank you for offering me the [Job Title] position. While I deeply appreciate the offer and enjoyed learning about your team, I must respectfully decline at this time as I have accepted another opportunity that aligns closer with my current career goals. \n\nThank you again for your time.\n\nSincerely,\n[Your Name]"),
    ("Create a standard agenda for a weekly sprint planning meeting.", "Agenda:\n1. Review previous sprint deliverables and outstanding items (15 mins)\n2. Discuss upcoming priorities and product backlog (15 mins)\n3. Effort estimation and task assignment (20 mins)\n4. Risk identification and blockers (10 mins)"),
    ("What should I include in a post-mortem document?", "A post-mortem should include: 1) Executive summary of the incident. 2) Timeline of events. 3) Root cause analysis (e.g., 5 Whys). 4) Impact scope. 5) Resolution steps taken. 6) Action items to prevent future recurrence."),
    ("Write a professional Out of Office message.", "Hello, thank you for your email. I am currently out of the office with no access to email until [Return Date]. If your request is urgent, please contact [Colleague Name] at [Colleague Email]. Otherwise, I will respond to your email upon my return. Best, [Your Name]"),
    ("How do I ask a colleague for an update on a delayed task professionally?", "Hi [Name],\n\nI hope you're having a good week. I wanted to gently follow up on the [Task Name] we discussed earlier. Could you provide a quick status update on when it might be ready? Let me know if you need any support from my end.\n\nThanks,\n[Your Name]"),
    ("Summarize the benefits of migrating to microservices.", "Migrating to microservices allows for independent deployment of services, enhanced fault isolation, and the ability to scale specific components based on demand. It also enables diverse technology stacks to be used optimally across different services.")
]
for i in range(TARGETS["professional"]):
    u, a = prof_topics[i % len(prof_topics)]
    dataset.append(create_msg(u, a))

# 7. Humor (15)
humor_topics = [
    ("Why do programmers prefer dark mode?", "Because light attracts bugs. 🐛"),
    ("Bro my code compiled on the first try.", "Wait, really? That's terrifying macha. You better check if it actually did anything!"),
    ("Tell me a networking joke.", "I would tell you a UDP joke, but you might not get it."),
    ("I accidentally deleted the production database.", "Oh wow. I hope your resume is up to date macha. Just kidding! Check the automated backups immediately!"),
    ("Why did the developer quit his job?", "Because he didn't get arrays. 🥁"),
    ("Dude JavaScript is so weird.", "JS is the only language where '11' + 1 is '111' but '11' - 1 is 10. We just accept the chaos bro."),
    ("Mama how do I become a 10x developer?", "Step 1: Drink 10 coffees. Step 2: Write 10 times more bugs. You are now a 10x developer."),
    ("What's the best way to secure a password?", "Write it on a sticky note and put it under your keyboard. Hackers will never look there."),
    ("Bro AI is going to take our jobs.", "Maybe, but until AI figures out how to center a div in CSS, your job is completely safe macha."),
    ("Knock knock.", "Who's there? (I swear if this is a Java garbage collection joke...)")
]
for i in range(TARGETS["humor"]):
    u, a = humor_topics[i % len(humor_topics)]
    dataset.append(create_msg(u, a))

# 8. Concise (20)
concise_topics = [
    ("What port does HTTPS use? Just the number.", "443."),
    ("TLDR on what a CDN does.", "It caches your website's files on servers around the world so users can load them faster from a location near them."),
    ("Short answer: What is an IP address?", "A unique string of numbers identifying a device on a network."),
    ("In one line, what is Docker?", "Docker packages applications and their dependencies into standardized containers to ensure they run consistently anywhere."),
    ("Git command to switch branches? 2 words.", "`git checkout`"),
    ("TLDR: SQL vs NoSQL.", "SQL uses structured tables with strict schemas; NoSQL uses flexible, document-based storage."),
    ("What does CPU stand for? Short.", "Central Processing Unit."),
    ("Just the answer: 2^10.", "1024."),
    ("One sentence definition of abstraction.", "Hiding complex implementation details and exposing only the essential features."),
    ("What's the time complexity of binary search? Just the notation.", "O(log n).")
]
for i in range(TARGETS["concise"]):
    u, a = concise_topics[i % len(concise_topics)]
    dataset.append(create_msg(u, a))

# 9. Deep Tech (20)
deep_tech_topics = [
    ("Explain the concept of attention in Transformers.", "In Transformers, the attention mechanism calculates a set of weights representing how strongly each word in a sequence should focus on every other word. By using Query, Key, and Value matrices, it allows the model to capture long-range dependencies regardless of distance."),
    ("How does a vector database perform similarity search?", "It uses algorithms like HNSW (Hierarchical Navigable Small World) or FAISS to index high-dimensional embeddings. During search, it computes the cosine similarity or L2 distance between the query vector and stored vectors to rapidly find nearest neighbors without doing an exhaustive scan."),
    ("What is the CAP theorem in distributed systems?", "The CAP theorem states that a distributed data store can only simultaneously guarantee two of three things: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition tolerance (the system operates despite network drops)."),
    ("Explain backpropagation in neural networks.", "Backpropagation applies the chain rule of calculus to compute the gradient of the loss function with respect to each weight. The model passes the error backward from the output layer to the input layer, allowing optimizers like gradient descent to update weights and minimize loss."),
    ("How does Kafka ensure high throughput?", "Kafka achieves high throughput by appending messages to immutable logs on disk, utilizing sequential I/O which is extremely fast. It also relies on the OS page cache and zero-copy data transfer to stream data directly from disk to network sockets without loading it into application memory."),
    ("What is RAFT consensus?", "Raft is a consensus algorithm that manages a replicated log to ensure fault tolerance. It works via leader election, where one node becomes the leader and coordinates log replication to followers. If the leader fails, followers time out and elect a new leader automatically."),
    ("Explain B-Trees in the context of database indexing.", "A B-Tree is a self-balancing tree data structure that keeps data sorted and allows for logarithmic time searches, insertions, and deletions. Databases use them for indexes because they minimize disk I/O operations by storing many keys in a single large node that matches the disk block size."),
    ("How do Zero-Knowledge Proofs work?", "ZKP is a cryptographic method allowing one party to prove to another that a statement is true without revealing any information beyond the validity of the statement itself. It relies on probabilistic interactive challenges or non-interactive mathematics (like zk-SNARKs)."),
    ("What is the difference between concurrency and parallelism?", "Concurrency is about dealing with multiple tasks at once by interleaving their execution on a single core (like Node.js event loop). Parallelism is about executing multiple tasks exactly at the same time across multiple physical CPU cores."),
    ("Explain the mechanics of a Bloom Filter.", "A Bloom filter is a space-efficient probabilistic data structure. It uses an array of bits and multiple hash functions. It can confidently tell you if an element is *definitely not* in the set, but can only say it is *probably* in the set, allowing for false positives but no false negatives.")
]
for i in range(TARGETS["deep_tech"]):
    u, a = deep_tech_topics[i % len(deep_tech_topics)]
    dataset.append(create_msg(u, a))


# Shuffle for randomness
random.seed(42)
random.shuffle(dataset)

# Ensure exactly 300
final_dataset = dataset[:300]

with open("v:/ihl/finetuning/dataset.jsonl", "w", encoding="utf-8") as f:
    for row in final_dataset:
        f.write(json.dumps(row) + "\n")

print(f"Generated {len(final_dataset)} high-quality JSONL examples.")
