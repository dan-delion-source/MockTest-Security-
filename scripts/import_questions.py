"""Import the supplied PDF using pdftotext; fail on incomplete question records."""
import json, re, subprocess, sys
from pathlib import Path
pdf = sys.argv[1] if len(sys.argv)>1 else '/home/dandadan/Documents/Security+/CompTIA_Security+_SY0-701_Combined_Exam_Prep_QA (1).pdf'
text = subprocess.check_output(['pdftotext', '-layout', pdf, '-'], text=True).replace('\f', '\n')
topic = None
questions = []
parts = re.split(r'(?m)^(Set \d+ — [^\n]+|Q\d+\.)', text)
for i in range(1,len(parts),2):
    marker, body = parts[i:i+2]
    if marker.startswith('Set '):
        topic = marker.split(' — ',1)[1]
        continue
    qid = int(marker[1:-1])
    prompt_options, explanation = body.split('Explanation:',1)
    segments = re.split(r'(?m)^([A-H])\.\s+', prompt_options)
    clean = lambda s: re.sub(r'\s+', ' ', s).strip()
    options=[]
    correct=[]
    for j in range(1,len(segments),2):
        key, value = segments[j:j+2]
        if '✔' in value:
            correct.append(key)
        options.append({'id':key,'text':clean(re.sub(r'✔\s*Correct', '', value))})
    q={'id':qid,'topic':topic,'prompt':clean(segments[0]),'options':options,'correct':correct,'explanation':clean(explanation)}
    assert len(options)>=2 and correct and q['explanation'] and q['prompt'], q
    assert all('✔' not in x['text'] and 'Explanation:' not in x['text'] for x in options), q
    questions.append(q)
assert [q['id'] for q in questions]==list(range(1,415))
Path('public/questions.json').write_text(json.dumps(questions,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {len(questions)} questions; {sum(len(q["correct"])>1 for q in questions)} multi-answer; sets: 90, 90, 90, 90, 54')
