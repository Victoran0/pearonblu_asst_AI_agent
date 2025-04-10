This is an AI Agent Chatbot built with Langchain, Langgraph, Llama 3 via Groq API, Chroma Vector Database, Google Embedding Model and Django Rest Framework.

## Description

Developed an AI-powered email assistant for Pearon Blu Hotel using LangChain, LangGraph, and Llama 3 70B on Groq. The Django (DRF) backend, secured by Simple JWT, authenticates staff before routing customer emails to the agent. A secure Next.js frontend handles user authentication (Auth.js) and secures access to the chat interface to interact with the AI. Leveraging advanced prompt engineering, a robust graph-based architecture (LangGraph), Agentic RAG & conditional edge logic, the agent generates professional & context-aware email responses, enhancing staff efficiency & customer satisfaction.

## Walkthrough

- Paste the customer's Email to Pearon Blu Assistant and get the response email.
  <br>
  ![Landing Page after staff authentication](./public/pb/pearon%20blu%20asst%20chat%20page%20light%20mode.png)
  <br>
- Dynamic chat for each customer with persistent history while getting real-time information like pricing, amenities etc about Pearon Blu from the Agentic RAG.
  <br>
  ![persistent chat](./public//pb/dynamic%20chat%20for%20each%20customer%20with%20persistent%20history.png)
  <br>
- Modify RAG document to add and update informations about the hotel policies, pricing, amenities, availability, services and packages etc.
  ![RAG Document page](./public//pb/Modify%20and%20add%20DOC%20for%20the%20Agentic%20RAG.png)
  <br>
  <br>
- When A staff draft's an email suggesting it best suits the customer's request, A quick rephrasal can be done to ensure tone consistency and clarity.
  ![Rephrase emails](./public/pb/Rephrase%20emails%20profesionally%20before%20replying.png)
  <br>
  <br>
- View all past chats with respect to the customer in the Chats Page, select any to continue the conversation with the Memory enhanced agent, addressing concerns across multiple requests independent to the customer. Staffs can also delete the conversation linked to a customer or start a new one.
  ![Chats Page](./public/pb/Chats%20page.png)
  <br>
- Staff Log in Page
  ![Login Page](./public/pb/pearon%20blu%20asst%20login%20page.png)
  <br>
- Select from light and dark mode to ensure visual compatibility.
  ![Toggle Dark Mode](./public/pb/pearon%20blu%20asst%20home%20page%20toggle%20dark%20mode.png)
  <br>
- All Mobile Responsive  
  ![Mobile page](./public/pb/Mobile%20page%20for%20Agentic%20RAG%20doc.png)
  ![Mobile page](./public/pb/Mobile%20responsive.png)

## What tech stacks and libraries are used in this project?

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- Langchain
- Langgraph
- Chroma Database
- [Tailwind CSS](https://tailwindcss.com)
- Shadcn-UI: For the UI components
- GoogleGenerativeAI: As the Embedding Model
- Vercel AI sdk: To stream AI response
- Next-Themes: To toggle light and dark mode
- framer-motion: For interesting animations
- DomPurify: For protecting dangerously set innerHtml
- Django rest framework
- Groq API
- etc
