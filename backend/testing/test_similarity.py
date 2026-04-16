from sentence_transformers import SentenceTransformer, util

# load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_similarity(text1, text2):
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)

    score = util.cos_sim(emb1, emb2)
    return float(score)


# 🔥 Replace with your extracted text
text1 = """PageDateAssignment - 1
Q-1 Define Operating system services with Diagram
2-1 Operating System Service: 
An OS serviceis a system-provided functionality thatenables users and applications to interactwith the hardware efficiently. These serviceshelp in process management, file handlingsecurity, I/O operation, networking and resou-rce allocation.OS Services:-
User and other system programs
GUI Batchcommandlineuser interface
System calls
programexecution
errordetection
I/O operation, file resourceprotection system allocation& security communicationservices accountingoperating SystemHardware"""
text2 = """ i am madhur """

score = get_similarity(text1, text2)

print(f"\n🔍 Similarity Score: {score:.2f}")

if score > 0.8:
    print("⚠️ Highly Similar (Possible Copy)")
elif score > 0.5:
    print("⚠️ Moderate Similarity")
else:
    print("✅ Different Content")