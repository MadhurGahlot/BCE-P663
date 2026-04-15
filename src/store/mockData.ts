import type { User, Assignment, Submission, SimilarityResult } from './types';

export const MOCK_USERS: User[] = [
  { id: 'teacher-1', name: 'Prof. Arjun Sharma', email: 'sharma@uni.edu', password: 'teacher123', role: 'teacher', department: 'CSE' },
  { id: 'teacher-2', name: 'Prof. Priya Mehta', email: 'mehta@uni.edu', password: 'teacher123', role: 'teacher', department: 'EE' },
  { id: 'teacher-3', name: 'Prof. Rajesh Patel', email: 'patel@uni.edu', password: 'teacher123', role: 'teacher', department: 'ME' },
  { id: 'student-1', name: 'Rahul Verma', email: 'rahul@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-2', name: 'Priya Singh', email: 'priya@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-3', name: 'Amit Kumar', email: 'amit@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-4', name: 'Deepa Nair', email: 'deepa@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-5', name: 'Vikram Rao', email: 'vikram@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-6', name: 'Anita Gupta', email: 'anita@student.edu', password: 'student123', role: 'student', department: 'CSE' },
  { id: 'student-7', name: 'Suresh Iyer', email: 'suresh@student.edu', password: 'student123', role: 'student', department: 'EE' },
  { id: 'student-8', name: 'Meera Shah', email: 'meera@student.edu', password: 'student123', role: 'student', department: 'EE' },
  { id: 'student-9', name: 'Kiran Desai', email: 'kiran@student.edu', password: 'student123', role: 'student', department: 'ME' },
  { id: 'student-10', name: 'Ravi Krishnan', email: 'ravi@student.edu', password: 'student123', role: 'student', department: 'ME' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Analysis of Sorting Algorithms',
    subject: 'CSE',
    description: 'Write a comprehensive report analyzing at least 4 sorting algorithms. Include time complexity, space complexity, best/worst case analysis, and provide working code implementations in C++/Python.',
    deadline: '2026-03-15',
    totalMarks: 100,
    teacherId: 'teacher-1',
    createdAt: '2026-02-10',
    allowedFileTypes: ['.pdf', '.docx', '.txt', '.py', '.cpp', '.java'],
    rubric: [
      { id: 'r1', criterion: 'Algorithm Coverage', maxMarks: 20, description: 'Covers at least 4 sorting algorithms with correct descriptions' },
      { id: 'r2', criterion: 'Time & Space Complexity', maxMarks: 25, description: 'Correct complexity analysis for all algorithms' },
      { id: 'r3', criterion: 'Code Implementation', maxMarks: 30, description: 'Working, well-commented code implementations' },
      { id: 'r4', criterion: 'Comparative Analysis', maxMarks: 15, description: 'Meaningful comparison and use-case discussion' },
      { id: 'r5', criterion: 'Report Quality', maxMarks: 10, description: 'Clear writing, formatting, and references' },
    ],
  },
  {
    id: 'assign-2',
    title: 'DC Circuit Analysis Lab Report',
    subject: 'EE',
    description: 'Analyze the given DC circuit using Kirchhoff\'s Laws, Thevenin\'s theorem, and Norton\'s theorem. Include simulation results and compare with theoretical values.',
    deadline: '2026-03-20',
    totalMarks: 80,
    teacherId: 'teacher-2',
    createdAt: '2026-02-12',
    allowedFileTypes: ['.pdf', '.docx', '.txt'],
    rubric: [
      { id: 'r1', criterion: 'Kirchhoff\'s Laws Application', maxMarks: 25, description: 'Correctly applies KVL and KCL' },
      { id: 'r2', criterion: 'Thevenin/Norton Theorem', maxMarks: 25, description: 'Correct equivalent circuit derivation' },
      { id: 'r3', criterion: 'Simulation Results', maxMarks: 20, description: 'Accurate simulation with proper analysis' },
      { id: 'r4', criterion: 'Conclusion & Discussion', maxMarks: 10, description: 'Meaningful comparison and error analysis' },
    ],
  },
  {
    id: 'assign-3',
    title: 'Heat Transfer in Extended Surfaces',
    subject: 'ME',
    description: 'Analyze heat transfer in fins and extended surfaces. Derive the fin equation, solve for temperature distribution, and calculate fin efficiency for different fin geometries.',
    deadline: '2026-03-25',
    totalMarks: 90,
    teacherId: 'teacher-3',
    createdAt: '2026-02-15',
    allowedFileTypes: ['.pdf', '.docx', '.txt'],
    rubric: [
      { id: 'r1', criterion: 'Fin Equation Derivation', maxMarks: 30, description: 'Correct derivation of the fin equation from first principles' },
      { id: 'r2', criterion: 'Temperature Distribution', maxMarks: 25, description: 'Correct temperature profile for given boundary conditions' },
      { id: 'r3', criterion: 'Fin Efficiency Calculation', maxMarks: 25, description: 'Accurate efficiency for rectangular, triangular, and annular fins' },
      { id: 'r4', criterion: 'Conclusions', maxMarks: 10, description: 'Engineering insights and practical applications' },
    ],
  },
];

const s1Content = `Sorting algorithms are essential tools in computer science for organizing data efficiently. This report examines several key sorting algorithms and their time complexities. Bubble sort is the simplest sorting algorithm that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The time complexity of bubble sort is O(n²) in both average and worst cases, making it inefficient for large datasets. Quick sort is a highly efficient comparison-based sorting algorithm that uses divide-and-conquer strategy. Developed by Tony Hoare in 1959, quick sort selects a pivot element and partitions the array into two sub-arrays around the pivot. Elements less than the pivot go to the left partition, and elements greater than the pivot go to the right partition. The average time complexity of quick sort is O(n log n), making it one of the fastest sorting algorithms in practice. Merge sort is another divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge function is the key operation that combines two sorted arrays into one. Merge sort has a time complexity of O(n log n) in all cases.

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`;

const s2Content = `Sorting algorithms are essential tools in computer science for organizing and managing data efficiently. This report examines several important sorting algorithms and their time complexities. Bubble sort is the simplest sorting algorithm that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The time complexity of bubble sort is O(n²) in both average and worst cases, which makes it inefficient for large datasets. Quick sort is a highly efficient comparison-based sorting algorithm that uses divide-and-conquer strategy. Developed by Tony Hoare in 1959, quick sort selects a pivot element and partitions the array into two sub-arrays around the pivot. Elements smaller than the pivot go to the left partition, and elements larger than the pivot go to the right partition. The average time complexity of quick sort is O(n log n), making it one of the fastest sorting algorithms in practice. Merge sort is also a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves. The merge function is the key operation that combines two sorted arrays. Merge sort has a time complexity of O(n log n) in all cases making it predictable.

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

def mergesort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    L = mergesort(arr[:mid])
    R = mergesort(arr[mid:])
    return merge(L, R)`;

const s3Content = `In this assignment, I will discuss and compare sorting algorithms and analyze their performance characteristics. Insertion sort works by building the final sorted array one item at a time. It iterates through an input array, consuming one input element at each repetition, and growing a sorted output list. Sorting algorithms are essential tools in computer science for organizing data efficiently. Quick sort selects a pivot element and partitions the array into two sub-arrays around the pivot. The average time complexity of quick sort is O(n log n). Heap sort uses a binary heap data structure and has O(n log n) time complexity. It is not a stable sort and uses O(1) auxiliary space. Selection sort has a time complexity of O(n²) and works by finding the minimum element repeatedly. The advantage of insertion sort over bubble sort is that it performs fewer comparisons in the average case. Counting sort achieves O(n+k) time complexity where k is the range of input values.`;

const s4Content = `This report provides an analysis of fundamental sorting algorithms used in computer science and software engineering. Selection sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly selects the smallest element from the unsorted sublist and swaps it with the leftmost unsorted element. This process is repeated until the entire list is sorted. The time complexity of selection sort is O(n²) in all cases. Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, insertion sort provides several advantages: it is simple to implement, efficient for small data sets, and adaptive. Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value. Shell sort is a generalization of insertion sort that allows the exchange of items that are far apart. The time complexity of shell sort depends on the gap sequence used.

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`;

const s5Content = `This report provides an analysis of fundamental sorting algorithms used in computer science and software engineering applications. Selection sort is an in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly selects the smallest element from the unsorted sublist and swaps it with the leftmost unsorted element. This process continues until the entire list is sorted. The time complexity of selection sort is O(n²) in all cases, making it inefficient for large inputs. Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, insertion sort provides several advantages: it is simple to implement, efficient for small data sets, and adaptive to partially sorted data. Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value. Shell sort is a generalization of insertion sort allowing exchange of items that are far apart in the array.

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`;

const s6Content = `The study of sorting algorithms is a core topic in computer science education. This report explores the theoretical and practical aspects of various sorting algorithms. Comparison-based sorting algorithms can be categorized by their time complexity. O(n²) algorithms include bubble sort, selection sort, and insertion sort. O(n log n) algorithms include merge sort, heap sort, and quick sort. Among O(n²) algorithms, insertion sort is the most practical for nearly sorted arrays due to its adaptive nature. Among O(n log n) algorithms, quick sort is typically the fastest in practice due to cache efficiency and low constant factors. Non-comparison based sorting algorithms like counting sort, radix sort, and bucket sort can achieve linear time complexity O(n) under certain conditions by exploiting the structure of the keys. Timsort, used in Python and Java, is a hybrid algorithm derived from merge sort and insertion sort, designed to perform well on real-world data. It runs in O(n log n) time and uses O(n) space.`;

const eeS1Content = `This lab report analyzes the DC circuit provided in the assignment using Kirchhoff's Voltage Law (KVL) and Kirchhoff's Current Law (KCL). The circuit consists of a 12V source with three resistors: R1=100Ω, R2=220Ω, and R3=470Ω in a mixed configuration. Applying KVL to loop 1: V1 - I1*R1 - (I1-I2)*R2 = 0, giving 12 - 100*I1 - 220*(I1-I2) = 0. Applying KVL to loop 2: (I1-I2)*R2 - I2*R3 = 0, giving 220*(I1-I2) - 470*I2 = 0. Solving the system of equations: I1 = 67.2mA, I2 = 21.5mA. The voltage across R2 is V_R2 = 220*(I1-I2) = 220*0.0457 = 10.05V. Using Thevenin's theorem, the equivalent resistance R_th = R1||(R2+R3) = 100||690 = 87.3Ω. The Thevenin voltage V_th = 12 * (R2+R3)/(R1+R2+R3) = 12 * 690/790 = 10.48V. Norton current I_N = V_th/R_th = 10.48/87.3 = 0.120A = 120mA. The simulation results using LTSpice matched theoretical values within 2% error margin.`;

const eeS2Content = `This laboratory report presents the analysis of the DC circuit using fundamental circuit analysis techniques. Kirchhoff's Voltage Law states that the algebraic sum of all voltages around any closed loop is zero. Kirchhoff's Current Law states that the algebraic sum of currents entering a node equals zero. For the given circuit with 12V source and resistors R1=100Ω, R2=220Ω, R3=470Ω: Applying KVL to loop 1: 12 - 100*I1 - 220*(I1-I2) = 0, which simplifies to 12 = 320*I1 - 220*I2. Applying KVL to loop 2: 220*(I1-I2) - 470*I2 = 0, giving 220*I1 = 690*I2. Solving: I1 = 67.2mA, I2 = 21.4mA. These results confirm the theoretical predictions. The Thevenin equivalent circuit was derived by removing the load and finding the open circuit voltage V_oc = 10.48V. The equivalent resistance was calculated as R_th = 87.3Ω by deactivating independent sources. The Norton equivalent current I_N = V_oc/R_th = 120mA.`;

const meS1Content = `Heat transfer through extended surfaces (fins) is an important mechanism for enhancing heat dissipation in engineering applications. The fin equation is derived from energy balance on a differential element. For a fin of uniform cross-section A_c with perimeter P in a fluid at temperature T_∞: d²θ/dx² - m²θ = 0, where θ = T - T_∞ and m² = hP/(kA_c). The general solution is θ(x) = C1*cosh(mx) + C2*sinh(mx). For a fin with insulated tip: θ(x)/θ_b = cosh(m(L-x))/cosh(mL). The fin efficiency η_f = tanh(mL)/(mL) for a rectangular fin with insulated tip. For a fin with h=50 W/m²K, k=200 W/mK, L=0.05m, width=0.02m, thickness=0.002m: m = sqrt(50*2*(0.02+0.002)/(200*0.02*0.002)) = sqrt(50*0.044/0.008) = sqrt(275) = 16.58 m⁻¹. mL = 16.58*0.05 = 0.829. η_f = tanh(0.829)/0.829 = 0.682/0.829 = 0.823 = 82.3%.`;

const meS2Content = `Extended surfaces or fins are used extensively in engineering to increase heat transfer rate between a surface and its surrounding fluid. The analysis begins with deriving the governing fin equation using energy balance. Consider a differential fin element of thickness dx at position x. Energy balance: Q_in - Q_out - Q_conv = 0. This yields the fin equation: d²T/dx² - (hP/kA_c)(T - T_∞) = 0. Substituting θ = T - T_∞: d²θ/dx² - m²θ = 0 where m = sqrt(hP/kA_c). The general solution is θ(x) = C1*exp(mx) + C2*exp(-mx) or equivalently θ(x) = C1*cosh(mx) + C2*sinh(mx). Applying boundary conditions for insulated tip: at x=0, θ=θ_b; at x=L, dθ/dx=0. This gives θ(x)/θ_b = cosh(m(L-x))/cosh(mL). The fin efficiency η_f = Q_fin/Q_max = tanh(mL)/(mL). For the given fin parameters with h=50 W/m²K and k=200 W/mK, the efficiency is calculated as 82.3%.`;

export const MOCK_SUBMISSIONS: Submission[] = [
  // Assignment 1 submissions
  { id: 'sub-1', assignmentId: 'assign-1', studentId: 'student-1', fileName: 'sorting_analysis.txt', fileType: 'txt', content: s1Content, submittedAt: '2026-03-12T09:15:00Z', grade: 88, feedback: 'Excellent analysis with good code examples. Complexity analysis is accurate. Minor improvement needed in comparative analysis section.', rubricGrades: [{criterionId:'r1',marks:18,comment:'Good coverage'},{criterionId:'r2',marks:23,comment:'Mostly correct'},{criterionId:'r3',marks:28,comment:'Well implemented'},{criterionId:'r4',marks:12,comment:'Decent comparison'},{criterionId:'r5',marks:7,comment:'Good formatting'}], maxSimilarity: 0.71 },
  { id: 'sub-2', assignmentId: 'assign-1', studentId: 'student-2', fileName: 'sorting_report.txt', fileType: 'txt', content: s2Content, submittedAt: '2026-03-13T14:30:00Z', grade: undefined, feedback: undefined, rubricGrades: [], maxSimilarity: 0.71 },
  { id: 'sub-3', assignmentId: 'assign-1', studentId: 'student-3', fileName: 'sort_algorithms.txt', fileType: 'txt', content: s3Content, submittedAt: '2026-03-11T11:00:00Z', grade: 72, feedback: 'Good effort. The analysis covers the required algorithms but lacks depth in complexity proof. Code examples are missing.', rubricGrades: [{criterionId:'r1',marks:16,comment:'Covered'},{criterionId:'r2',marks:18,comment:'Mostly right'},{criterionId:'r3',marks:20,comment:'Missing some code'},{criterionId:'r4',marks:11,comment:'Average'},{criterionId:'r5',marks:7,comment:'OK'}], maxSimilarity: 0.38 },
  { id: 'sub-4', assignmentId: 'assign-1', studentId: 'student-4', fileName: 'algorithms_report.pdf', fileType: 'pdf', content: s4Content, submittedAt: '2026-03-14T16:45:00Z', grade: undefined, feedback: undefined, rubricGrades: [], maxSimilarity: 0.79 },
  { id: 'sub-5', assignmentId: 'assign-1', studentId: 'student-5', fileName: 'sorting_hw.txt', fileType: 'txt', content: s5Content, submittedAt: '2026-03-14T20:00:00Z', grade: undefined, feedback: undefined, rubricGrades: [], maxSimilarity: 0.79 },
  { id: 'sub-6', assignmentId: 'assign-1', studentId: 'student-6', fileName: 'sort_analysis.docx', fileType: 'docx', content: s6Content, submittedAt: '2026-03-10T08:30:00Z', grade: 81, feedback: 'Well-written and original work. Good coverage of advanced algorithms like Timsort. Could improve on code implementations.', rubricGrades: [{criterionId:'r1',marks:17,comment:'Good'},{criterionId:'r2',marks:21,comment:'Solid'},{criterionId:'r3',marks:24,comment:'Limited code'},{criterionId:'r4',marks:13,comment:'Good'},{criterionId:'r5',marks:6,comment:'Could be better'}], maxSimilarity: 0.19 },
  // Assignment 2 submissions
  { id: 'sub-7', assignmentId: 'assign-2', studentId: 'student-7', fileName: 'circuit_lab.txt', fileType: 'txt', content: eeS1Content, submittedAt: '2026-03-18T10:00:00Z', grade: 74, feedback: 'Good application of KVL and KCL. Thevenin analysis is correct. Simulation results need more discussion.', rubricGrades: [{criterionId:'r1',marks:22,comment:'Correct'},{criterionId:'r2',marks:21,comment:'Good'},{criterionId:'r3',marks:22,comment:'Could elaborate'},{criterionId:'r4',marks:7,comment:'Average'}], maxSimilarity: 0.65 },
  { id: 'sub-8', assignmentId: 'assign-2', studentId: 'student-8', fileName: 'dc_analysis.txt', fileType: 'txt', content: eeS2Content, submittedAt: '2026-03-19T15:20:00Z', grade: undefined, feedback: undefined, rubricGrades: [], maxSimilarity: 0.65 },
  // Assignment 3 submissions
  { id: 'sub-9', assignmentId: 'assign-3', studentId: 'student-9', fileName: 'fin_analysis.txt', fileType: 'txt', content: meS1Content, submittedAt: '2026-03-22T09:00:00Z', grade: 82, feedback: 'Excellent derivation and numerical analysis. All fin geometries covered correctly. Good conclusions.', rubricGrades: [{criterionId:'r1',marks:28,comment:'Excellent'},{criterionId:'r2',marks:22,comment:'Good'},{criterionId:'r3',marks:23,comment:'Accurate'},{criterionId:'r4',marks:9,comment:'Good insights'}], maxSimilarity: 0.62 },
  { id: 'sub-10', assignmentId: 'assign-3', studentId: 'student-10', fileName: 'heat_transfer.txt', fileType: 'txt', content: meS2Content, submittedAt: '2026-03-23T11:30:00Z', grade: undefined, feedback: undefined, rubricGrades: [], maxSimilarity: 0.62 },
];

export const MOCK_SIMILARITY_RESULTS: SimilarityResult[] = [
  {
    assignmentId: 'assign-1',
    computedAt: '2026-03-15T08:00:00Z',
    pairs: [
      {
        submission1Id: 'sub-1', submission2Id: 'sub-2', similarity: 0.71,
        matchedSections: [
          { text: 'Sorting algorithms are essential tools in computer science for organizing data efficiently.', startIn1: 0, startIn2: 0 },
          { text: 'Bubble sort is the simplest sorting algorithm that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.', startIn1: 120, startIn2: 130 },
          { text: 'Developed by Tony Hoare in 1959, quick sort selects a pivot element and partitions the array into two sub-arrays around the pivot.', startIn1: 450, startIn2: 470 },
          { text: 'The average time complexity of quick sort is O(n log n), making it one of the fastest sorting algorithms in practice.', startIn1: 590, startIn2: 620 },
          { text: 'The merge function is the key operation that combines two sorted arrays into one.', startIn1: 900, startIn2: 920 },
        ],
      },
      {
        submission1Id: 'sub-1', submission2Id: 'sub-3', similarity: 0.38,
        matchedSections: [
          { text: 'Sorting algorithms are essential tools in computer science for organizing data efficiently.', startIn1: 0, startIn2: 100 },
          { text: 'quick sort selects a pivot element and partitions the array into two sub-arrays around the pivot.', startIn1: 490, startIn2: 250 },
          { text: 'The average time complexity of quick sort is O(n log n)', startIn1: 590, startIn2: 350 },
        ],
      },
      { submission1Id: 'sub-2', submission2Id: 'sub-3', similarity: 0.35, matchedSections: [{ text: 'Sorting algorithms are essential tools in computer science', startIn1: 0, startIn2: 100 }] },
      { submission1Id: 'sub-1', submission2Id: 'sub-4', similarity: 0.08, matchedSections: [] },
      { submission1Id: 'sub-1', submission2Id: 'sub-5', similarity: 0.09, matchedSections: [] },
      { submission1Id: 'sub-1', submission2Id: 'sub-6', similarity: 0.14, matchedSections: [] },
      { submission1Id: 'sub-2', submission2Id: 'sub-4', similarity: 0.07, matchedSections: [] },
      { submission1Id: 'sub-2', submission2Id: 'sub-5', similarity: 0.08, matchedSections: [] },
      { submission1Id: 'sub-2', submission2Id: 'sub-6', similarity: 0.12, matchedSections: [] },
      { submission1Id: 'sub-3', submission2Id: 'sub-4', similarity: 0.16, matchedSections: [] },
      { submission1Id: 'sub-3', submission2Id: 'sub-5', similarity: 0.15, matchedSections: [] },
      { submission1Id: 'sub-3', submission2Id: 'sub-6', similarity: 0.22, matchedSections: [] },
      {
        submission1Id: 'sub-4', submission2Id: 'sub-5', similarity: 0.79,
        matchedSections: [
          { text: 'This report provides an analysis of fundamental sorting algorithms used in computer science and software engineering.', startIn1: 0, startIn2: 0 },
          { text: 'Selection sort is an in-place comparison sorting algorithm.', startIn1: 115, startIn2: 118 },
          { text: 'The algorithm repeatedly selects the smallest element from the unsorted sublist and swaps it with the leftmost unsorted element.', startIn1: 230, startIn2: 235 },
          { text: 'Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time.', startIn1: 450, startIn2: 460 },
          { text: 'It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.', startIn1: 550, startIn2: 565 },
          { text: 'Radix sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.', startIn1: 780, startIn2: 800 },
        ],
      },
      { submission1Id: 'sub-4', submission2Id: 'sub-6', similarity: 0.11, matchedSections: [] },
      { submission1Id: 'sub-5', submission2Id: 'sub-6', similarity: 0.10, matchedSections: [] },
    ],
  },
  {
    assignmentId: 'assign-2',
    computedAt: '2026-03-20T09:00:00Z',
    pairs: [
      {
        submission1Id: 'sub-7', submission2Id: 'sub-8', similarity: 0.65,
        matchedSections: [
          { text: 'Applying KVL to loop 1: 12 - 100*I1 - 220*(I1-I2) = 0', startIn1: 200, startIn2: 350 },
          { text: 'The Thevenin voltage V_th = 12 * (R2+R3)/(R1+R2+R3)', startIn1: 620, startIn2: 580 },
          { text: 'I1 = 67.2mA, I2 = 21.5mA', startIn1: 500, startIn2: 520 },
        ],
      },
    ],
  },
  {
    assignmentId: 'assign-3',
    computedAt: '2026-03-24T10:00:00Z',
    pairs: [
      {
        submission1Id: 'sub-9', submission2Id: 'sub-10', similarity: 0.62,
        matchedSections: [
          { text: 'The general solution is θ(x) = C1*cosh(mx) + C2*sinh(mx)', startIn1: 350, startIn2: 400 },
          { text: 'The fin efficiency η_f = tanh(mL)/(mL) for a rectangular fin', startIn1: 450, startIn2: 500 },
        ],
      },
    ],
  },
];
