To Develope this project i gave the exact following prompts to the AI and it did the rest of the work.
I used Antigravity AI editor for this project. Where i used claude 4.6 and gemini 3.1 AI models.

**1st Prompt**
-according to following prompt that given below you have to design and develope followed by the best practice and best folder structure, You are a senior mern stack developer.

Your task is to create a minimal app

- Ingest a sample excel file
- Build a simple web UI that lets a user view, add, edit, and delete those values
-Show a list of situation (cell) from excel 
Button to add new dilemma 
Basic styling (clean cards/tables, responsive)

You have to create only frontend parts later we will move to backend


**2nd Prompt**
Now yoou have to developed backend for the database use postgres along with the prisma, To You have to do the following task followed by best practices and best structure. 
-Ingest a sample excel file with 6 rows and 6 columns
-Expose secure, well-documented CRUD APIs
- Choose and create a simple schema 
- Use JSON column/array

Endpoints (all JSON):
GET /situation — list all
GET /situation/{id}
POST /situation — create new (validate input)
PUT /situation/{id} — update
DELETE /situation/{id}
Bonus (nice-to-have): GET /health

Situation refers to a cell in the excel

At the end  make sync both frontend and backend it has to deploed on production, remove dummy data, when i upload the excel then the file should imports all rows into a database. also handle basic validations. 


