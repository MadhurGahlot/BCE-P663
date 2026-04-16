# 📘 PostgreSQL Commands Cheat Sheet

> 🚀 Personal Notes for Quick Revision

---

## 🟢 DATABASE COMMANDS

```sql
-- Create database
CREATE DATABASE db_name;

-- Delete database
DROP DATABASE db_name;

-- Connect database (psql)
\c db_name;

-- List databases
\l
```

---

## 🔵 TABLE COMMANDS

```sql
-- Create table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    department VARCHAR(50)
);

-- View tables
\dt

-- Describe table
\d students

-- Drop table
DROP TABLE students;

-- Rename table
ALTER TABLE students RENAME TO new_students;
```

---

## 🟣 INSERT DATA

```sql
INSERT INTO students (name, age, department)
VALUES ('Madhur', 21, 'CSE');
```

---

## 🟡 READ DATA (SELECT)

```sql
SELECT * FROM students;

SELECT name, age FROM students;

SELECT * FROM students WHERE age > 20;

SELECT * FROM students ORDER BY age DESC;

SELECT * FROM students LIMIT 5;
```

---

## 🔴 UPDATE DATA

```sql
UPDATE students
SET age = 22
WHERE name = 'Madhur';
```

---

## 🟠 DELETE DATA

```sql
DELETE FROM students
WHERE name = 'Madhur';
```

---

## 🔹 ALTER TABLE

```sql
-- Add column
ALTER TABLE students ADD email VARCHAR(100);

-- Drop column
ALTER TABLE students DROP COLUMN email;

-- Rename column
ALTER TABLE students RENAME COLUMN name TO full_name;

-- Change data type
ALTER TABLE students ALTER COLUMN age TYPE BIGINT;
```

---

## 🔹 CONSTRAINTS

```sql
-- Primary Key
id SERIAL PRIMARY KEY;

-- Unique
email VARCHAR(100) UNIQUE;

-- Not Null
name VARCHAR(100) NOT NULL;

-- Default
age INT DEFAULT 18;

-- Foreign Key
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

---

## 🔥 JOINS (VERY IMPORTANT)

```sql
-- INNER JOIN
SELECT s.name, c.course_id
FROM students s
INNER JOIN courses c ON s.id = c.student_id;

-- LEFT JOIN
SELECT * FROM students
LEFT JOIN courses ON students.id = courses.student_id;

-- RIGHT JOIN
SELECT * FROM students
RIGHT JOIN courses ON students.id = courses.student_id;

-- FULL JOIN
SELECT * FROM students
FULL JOIN courses ON students.id = courses.student_id;
```

---

## 📊 AGGREGATE FUNCTIONS

```sql
SELECT COUNT(*) FROM students;

SELECT AVG(age) FROM students;

SELECT MAX(age) FROM students;

SELECT MIN(age) FROM students;

SELECT SUM(age) FROM students;
```

---

## 📈 GROUP BY & HAVING

```sql
SELECT department, COUNT(*)
FROM students
GROUP BY department;

SELECT department, COUNT(*)
FROM students
GROUP BY department
HAVING COUNT(*) > 2;
```

---

## ⚡ INDEXES (Performance)

```sql
-- Create index
CREATE INDEX idx_name ON students(name);

-- Drop index
DROP INDEX idx_name;
```

---

## 👁️ VIEWS

```sql
-- Create view
CREATE VIEW student_view AS
SELECT name, department FROM students;

-- Use view
SELECT * FROM student_view;

-- Drop view
DROP VIEW student_view;
```

---

## ⚙️ FUNCTIONS

```sql
CREATE FUNCTION add_numbers(a INT, b INT)
RETURNS INT AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;

-- Call function
SELECT add_numbers(5, 3);
```

---

## 🔔 TRIGGERS

```sql
CREATE FUNCTION log_insert()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Data Inserted';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_insert
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION log_insert();
```

---

## 🔄 TRANSACTIONS

```sql
BEGIN;

INSERT INTO students VALUES (1, 'Test', 20, 'CSE');

COMMIT;

-- Rollback
ROLLBACK;
```

---

## 🔐 USER & PERMISSIONS

```sql
-- Create user
CREATE USER user1 WITH PASSWORD 'password';

-- Grant access
GRANT ALL PRIVILEGES ON DATABASE db_name TO user1;

-- Revoke
REVOKE ALL PRIVILEGES ON DATABASE db_name FROM user1;
```

---

## 🧰 USEFUL PSQL COMMANDS

```sql
\dt        -- list tables
\d table   -- describe table
\l         -- list databases
\q         -- quit
```

---

# 🚀 FINAL TIP

> 💡 Practice these commands daily in `psql` for fmastery.
