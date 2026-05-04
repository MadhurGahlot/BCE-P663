from sentence_transformers import SentenceTransformer, util

# load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_similarity(text1, text2):
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)
    #emb3 = model.encode(text3, convert_to_tensor=True)
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
I/O operation, file resourceprotection system allocation& security communicationservices accountingoperating SystemHardware
if (dictarr[i].key == key) break;
}
if (i == Size) {
cout << "Key not found!\n";
return;
}
// shift left
for (int j = i; j < Size - 1; j++) {
dictarr[j] = dictarr[j + 1];
}
Size--;
cout << "Deleted key " << key << "\n";
}
void find(int key) {
for (int i = 0; i < Size; i++) {
if (dictarr[i].key == key) {
cout << "Found: (" << dictarr[i].key << ", " <<
dictarr[i].value << ")\n";
return;
}
}
cout << "Key not found!\n";
}
void display() {
if (Size == 0) {
cout << "Dictionary is empty.\n";
return;
}
cout << "Ordered Dictionary:\n";
for (int i = 0; i < Size; i++) {
cout << "(" << dictarr[i].key << ", " << dictarr[i].value << ") ";
}
cout << "\n";
}
int main() {
int choice;
int key, value;
do {
cout << "\n--- Ordered Dictionary Menu ---\n";
cout << "1. Insert\n2. Delete\n3. Find\n4. Display\n5. Exit\n";
cout << "Enter choice: ";
cin >> choice;
switch (choice) {
case 1:
cout << "Enter key: ";
cin >> key ;
cout<<"Enter value: ";
"""



text2 = """ Q1. Write a program for implemen(cid:415)ng an ordered dic(cid:415)onary to hold a key value pair (both
integer values) using array with inser(cid:415)ons, dele(cid:415)on, display and find opera(cid:415)ons
Ans. #include <iostream>
using namespace std;
struct Pair {
int key;
int value;
};
const int Max_size =100;
Pair dictarr[Max_size];
int Size=0;
void insert(int key, int value) {
if (Size >= Max_size) {
cout << "Dictionary is full!\n";
return;
}
for (int i = 0; i < Size; i++) {
if (dictarr[i].key == key) {
dictarr[i].value = value;
cout << "Key already exists. Value updated.\n";
return;
}
}
int pos = Size - 1;
while (pos >= 0 && dictarr[pos].key > key) {
dictarr[pos + 1] = dictarr[pos];
pos--;
}
dictarr[pos + 1] = {key, value};
Size++;
cout << "Inserted (" << key << ", " << value << ")\n";
}
void remove(int key) {
int i;
for (i = 0; i < Size; i++) {
}
void findKey(int key) {
Node* temp = head;
while (temp != nullptr) {
if (temp->key == key) {
cout << "Found: (" << temp->key << ", " << temp->value << ")\n";
return;
}
temp = temp->next;
}
cout << "Key not found!\n";
}
void display() {
if (head == nullptr) {
cout << "Dictionary is empty.\n";
return;
}
cout << "Ordered Dictionary:\n";
Node* temp = head;
while (temp != nullptr) {
cout << "(" << temp->key << ", " << temp->value << ") ";
temp = temp->next;
}
cout << "\n";
}
int main() {
int choice, key, value;
do {
cout << "\n--- Ordered Dictionary (Linked List) Menu ---\n";
cout << "1. Insert\n2. Delete\n3. Find\n4. Display\n5. Exit\n";
cout << "Enter choice: ";
cin >> choice;
switch (choice) {
case 1:
cout << "Enter key : ";
cin >> key ;
cout<<"Enter value: ";
cin>> value;
insert(key, value);
break;
case 2:
cout << "Enter key to delete: ";
cin >> key;
removeKey(key);
break;
case 3:
cout << "Enter key to find: ";
cin >> key;
findKey(key);
break;
case 4:
display();
break;
case 5:
cout << "Exiting...\n";
break;
default:
cout << "Invalid choice!\n";
}
} while (choice != 5);
return 0;
}
Output: --- Ordered Dictionary (Linked List) Menu ---
1. Insert
2. Delete
3. Find
4. Display
5. Exit
Enter choice: 1
Enter key and value: 23
45
Inserted (23, 45)
--- Ordered Dictionary Menu ---
1. Insert
2. Delete
3. Find
4. Display
5. Exit
Enter choice: 1
Enter key: 23
Enter value: 45
Inserted (23, 45)
--- Ordered Dictionary Menu ---
1. Insert
2. Delete
3. Find
4. Display
5. Exit
Enter choice: 1
Enter key: 23
Enter value: 46
Key already exists. Value updated.
--- Ordered Dictionary Menu ---
1. Insert
2. Delete
3. Find
4. Display
5. Exit
Enter choice: 1
Enter key: 45
Enter value: 67
Inserted (45, 67)
--- Ordered Dictionary Menu ---
1. Insert
2. Delete
3. Find
4. Display
5. Exit
Enter choice: 1
Enter key: 2
 """



score = get_similarity(text1, text2)

print(f"\n🔍 Similarity Score: {score:.2f}")

if score > 0.8:
    print("⚠️ Highly Similar (Possible Copy)")
elif score > 0.5:
    print("⚠️ Moderate Similarity")
else:
    print("✅ Different Content")