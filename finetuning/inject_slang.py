import json
import random
import re

SLANGS = [
    "Bro", "macha", "mama", "dude", "mate", "yaar", "da", "dei", "mawa", 
    "bud", "buddy", "bruh", "homie", "pal", "aliya", "guru", "machi"
]

def capitalize_first(word):
    return word[0].upper() + word[1:]

with open("v:/ihl/finetuning/dataset.jsonl", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if not line.strip():
        continue
    data = json.loads(line)
    
    # Check if assistant response already has one of the slangs
    assistant_msg = data["messages"][1]["content"]
    
    has_slang = False
    for slang in SLANGS:
        # Check whole word match, case insensitive
        if re.search(r'\b' + slang + r'\b', assistant_msg, re.IGNORECASE):
            has_slang = True
            break
            
    # Remove existing "bro", "macha", "mama" occasionally to replace with new ones for variety
    assistant_msg = re.sub(r'\b(bro|macha|mama|dude)\b', lambda match: random.choice(SLANGS) if random.random() > 0.3 else match.group(0), assistant_msg, flags=re.IGNORECASE)
    
    # If no slang was injected or existed, add one naturally at the start or end
    new_has_slang = False
    for slang in SLANGS:
        if re.search(r'\b' + slang + r'\b', assistant_msg, re.IGNORECASE):
            new_has_slang = True
            break
            
    if not new_has_slang or random.random() > 0.5: # Ensure almost every line has it
        slang_word = random.choice(SLANGS)
        
        # Decide whether to put at start or end
        if random.random() > 0.5:
            # Start
            assistant_msg = f"{capitalize_first(slang_word)}, " + assistant_msg[0].lower() + assistant_msg[1:]
        else:
            # End
            if assistant_msg.endswith('.'):
                assistant_msg = assistant_msg[:-1] + f", {slang_word}."
            elif assistant_msg.endswith('!'):
                assistant_msg = assistant_msg[:-1] + f", {slang_word}!"
            elif assistant_msg.endswith('?'):
                assistant_msg = assistant_msg[:-1] + f", {slang_word}?"
            else:
                assistant_msg += f", {slang_word}."
                
    data["messages"][1]["content"] = assistant_msg
    new_lines.append(json.dumps(data))

with open("v:/ihl/finetuning/dataset.jsonl", "w", encoding="utf-8") as f:
    f.write("\n".join(new_lines))
    
print("Updated dataset with wide variety of slangs.")
