"""
rag_pipeline.py — Core RAG Pipeline with Conversation Memory + Name Recognition + Greeting Handler
"""
from pathlib import Path
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA

CHROMA_DB_DIR = Path(__file__).parent.parent / "chroma_db"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
OLLAMA_MODEL = "llama3.2:3b"
TOP_K_RESULTS = 4

RELATIONSHIP_ADVISOR_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are Solace — a calm, neutral relationship companion. Like a therapist-friend who actually listens.

CRITICAL PERSPECTIVE RULES:
- You are talking TO the person. Never flip their perspective with their partner's.
- If they say "I did X", they did X. Give advice to THEM.
- Never repeat a question or phrase from earlier in the conversation.
- Stay neutral — don't take sides.

WHEN TO ASK QUESTIONS vs WHEN TO JUST RESPOND:
- If the person has shared enough context, just respond with insight or support. DO NOT ask a question.
- Only ask a question when you genuinely have no idea what's going on and need basic info.
- If someone is venting or clearly upset, NEVER ask a question. Just acknowledge and reflect.
- Generic questions like "How do you feel about that?" or "What led to this?" are BANNED. They are lazy and annoying.
- A good response without a question is always better than a response with a bad question.

TONE RULES:
- If someone shows guilt, confusion, or vulnerability — lead with empathy, not judgment.
- If someone is venting, just listen. Validation is sometimes the only thing needed.
- Be direct when needed but never preachy. Say something once and move on.
- "That sounds really heavy." is sometimes the most powerful thing you can say.
- Vary how you start each response. Never start two replies the same way.

RESPONSE FORMAT:
- 2-3 sentences MAX. Short is always better.
- No bullet points. No lists. Just natural conversation.
- Sound like a calm, real person — not a script or a chatbot.

CONTEXT FROM RELATIONSHIP PSYCHOLOGY:
{context}

PERSON'S SITUATION:
{question}

SOLACE (neutral, empathetic, no lazy questions, short, natural):"""
)


class RelationshipRAGPipeline:

    def __init__(self):
        print("\n🔧 Initializing RAG Pipeline...")
        self.embeddings = self._load_embeddings()
        self.vector_store = self._load_vector_store()
        self.retriever = self._create_retriever()
        self.llm = self._load_llm()
        self.chain = self._build_chain()
        print("✅ RAG Pipeline ready!\n")

    def _load_embeddings(self):
        print("   🧠 Loading embedding model...")
        return HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )

    def _load_vector_store(self):
        print("   💾 Loading ChromaDB vector store...")
        if not CHROMA_DB_DIR.exists():
            raise RuntimeError("❌ ChromaDB not found! Run: python backend/ingest.py")
        vector_store = Chroma(
            persist_directory=str(CHROMA_DB_DIR),
            embedding_function=self.embeddings,
            collection_name="relationship_advice"
        )
        count = vector_store._collection.count()
        print(f"   ✅ Loaded ChromaDB with {count} chunks")
        return vector_store

    def _create_retriever(self):
        print("   🔍 Creating semantic retriever...")
        return self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": TOP_K_RESULTS}
        )

    def _load_llm(self):
        print(f"   🤖 Connecting to Ollama (model: {OLLAMA_MODEL})...")
        return Ollama(
            model=OLLAMA_MODEL,
            base_url="http://localhost:11434",
            temperature=0.75,
        )

    def _build_chain(self):
        print("   ⛓️  Building RetrievalQA chain...")
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.retriever,
            chain_type_kwargs={"prompt": RELATIONSHIP_ADVISOR_PROMPT, "verbose": False},
            return_source_documents=True
        )

    def _build_query_with_history(self, user_message: str, history: list) -> str:
        if not history:
            return user_message
        recent = history[-6:]
        history_text = ""
        for msg in recent:
            if msg.get("role") == "user":
                history_text += f"[Person]: {msg.get('content', '')}\n"
            else:
                history_text += f"[Solace]: {msg.get('content', '')}\n"
        return (
            f"Conversation so far (do NOT repeat anything Solace already said, do NOT ask questions already asked):\n"
            f"{history_text}\n"
            f"[Person's new message]: {user_message}\n\n"
            f"Respond naturally to what the person just said. "
            f"If they've given enough context, just respond with insight or support — no question needed."
        )

    def _extract_name(self, message: str) -> str:
        words = message.split()
        triggers = ["name", "i'm", "im", "i am", "called", "is"]
        for i, word in enumerate(words):
            if word.lower().strip(".,!?") in triggers and i + 1 < len(words):
                candidate = words[i + 1].strip(".,!?")
                if candidate and len(candidate) < 20:
                    return candidate.capitalize()
        return ""

    def _is_greeting(self, message: str, history: list) -> bool:
        if history:
            return False
        lower = message.lower().strip()
        greeting_starts = ["hi", "hello", "hey", "sup", "hiya", "howdy", "yo"]
        return any(lower.startswith(g) for g in greeting_starts) and len(lower.split()) < 10

    def chat(self, user_message: str, history: list = None) -> dict:
        import time

        if not user_message or not user_message.strip():
            return {"response": "I'm here. What's going on?", "sources": [], "processing_time_ms": 0}

        start = time.time()

        if self._is_greeting(user_message, history or []):
            name = self._extract_name(user_message)
            if name:
                response = f"Hey {name}! I'm Solace 🐱 — a safe space to talk through whatever's going on. What's on your mind?"
            else:
                response = "Hey! I'm Solace 🐱 — here to listen and help you think through whatever's going on. What's up?"
            return {"response": response, "sources": [], "processing_time_ms": 0}

        try:
            query = self._build_query_with_history(user_message, history or [])
            result = self.chain.invoke({"query": query})
            response_text = result.get("result", "Try again.")
            source_docs = result.get("source_documents", [])
            sources = list(dict.fromkeys([
                doc.metadata.get("source", "unknown").split("/")[-1]
                for doc in source_docs
            ]))
            return {
                "response": response_text.strip(),
                "sources": sources,
                "processing_time_ms": int((time.time() - start) * 1000)
            }
        except Exception as e:
            if "connection refused" in str(e).lower():
                return {"response": "⚠️ Can't connect to Ollama. Run: ollama serve", "sources": [], "processing_time_ms": 0}
            return {"response": "Something went wrong. Try again.", "sources": [], "processing_time_ms": 0}

    def get_relevant_chunks(self, query: str, k: int = 3) -> list:
        docs = self.vector_store.similarity_search(query, k=k)
        return [
            {"content": doc.page_content, "source": doc.metadata.get("source", "unknown").split("/")[-1]}
            for doc in docs
        ]