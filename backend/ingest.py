"""
=============================================================
PHASE 2 + 3 + 4: ingest.py — Document Loader, Chunker, and Vector DB Builder
=============================================================

WHAT THIS FILE DOES (in plain English):
1. Reads our relationship advice text files from the /data folder
2. Splits them into small chunks (like cutting a book into index cards)
3. Converts each chunk into an "embedding" (a list of numbers representing meaning)
4. Stores everything in ChromaDB (our searchable database)

WHY THIS MATTERS:
- LLMs have a "context window" — they can only read a limited amount of text at once
- We can't dump ALL our knowledge documents into every query
- Instead, we find just the RELEVANT pieces and send those
- This is the core idea behind RAG (Retrieval Augmented Generation)

RUN THIS ONCE before starting the backend server:
    python backend/ingest.py
=============================================================
"""

import os
import sys
from pathlib import Path

# LangChain document loaders — these read files and convert them to a standard format
from langchain_community.document_loaders import DirectoryLoader, TextLoader

# Text splitter — this is what "chunks" our documents
from langchain_text_splitters import RecursiveCharacterTextSplitter

# HuggingFace Embeddings — converts text to numerical vectors
from langchain_huggingface import HuggingFaceEmbeddings

# ChromaDB integration — our vector database
from langchain_community.vectorstores import Chroma


# ─────────────────────────────────────────────────────────────
# CONFIGURATION
# These are the key settings we can tweak
# ─────────────────────────────────────────────────────────────

# Where our knowledge documents live
DATA_DIR = Path(__file__).parent.parent / "data"

# Where ChromaDB will save its files (persistent storage)
CHROMA_DB_DIR = Path(__file__).parent.parent / "chroma_db"

# The embedding model we'll use
# "all-MiniLM-L6-v2" is small, fast, and great for semantic similarity
# It converts text into 384-dimensional vectors
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Chunk size: how many characters per chunk
# Too large = too much irrelevant info per chunk
# Too small = not enough context per chunk
CHUNK_SIZE = 500

# Chunk overlap: how many characters chunks share at their edges
# This prevents losing meaning at chunk boundaries
# Example: If chunk 1 ends mid-sentence, chunk 2 starts a bit earlier
CHUNK_OVERLAP = 100


# ─────────────────────────────────────────────────────────────
# STEP 1: LOAD DOCUMENTS
# ─────────────────────────────────────────────────────────────

def load_documents():
    """
    Reads all .txt files from the /data folder.
    
    LangChain's DirectoryLoader handles this automatically.
    It returns a list of "Document" objects, each containing:
    - page_content: the text content
    - metadata: information about the source file
    
    WHY: We need our knowledge in a format LangChain can work with.
    """
    print("\n📂 Step 1: Loading documents from /data folder...")
    
    if not DATA_DIR.exists():
        print(f"❌ Error: Data directory not found at {DATA_DIR}")
        sys.exit(1)
    
    # Load all .txt files in the data directory
    loader = DirectoryLoader(
        str(DATA_DIR),
        glob="**/*.txt",           # Match all .txt files, even in subdirectories
        loader_cls=TextLoader,      # Use TextLoader for .txt files
        loader_kwargs={"encoding": "utf-8"}  # Handle special characters
    )
    
    documents = loader.load()
    
    if not documents:
        print("❌ No documents found in /data folder. Add .txt files and try again.")
        sys.exit(1)
    
    print(f"✅ Loaded {len(documents)} document(s)")
    for doc in documents:
        print(f"   • {doc.metadata.get('source', 'unknown')} "
              f"({len(doc.page_content)} characters)")
    
    return documents


# ─────────────────────────────────────────────────────────────
# STEP 2: SPLIT INTO CHUNKS
# ─────────────────────────────────────────────────────────────

def split_documents(documents):
    """
    Splits large documents into smaller, manageable chunks.
    
    SIMPLE ANALOGY:
    Imagine you have a 500-page psychology textbook.
    Instead of giving the whole book to someone asking one question,
    you cut it into index cards — each card covers one specific topic.
    When someone asks a question, you find the 3 most relevant cards.
    
    WHY RecursiveCharacterTextSplitter?
    It tries to split at natural boundaries: paragraphs → sentences → words
    This preserves meaning better than just cutting at character 500.
    """
    print("\n✂️  Step 2: Splitting documents into chunks...")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,          # Max characters per chunk
        chunk_overlap=CHUNK_OVERLAP,    # Overlap to preserve context
        length_function=len,            # How to measure "size" (character count)
        separators=[
            "\n\nTOPIC:",  # Split on our custom topic markers first
            "\n\n",        # Then paragraph breaks
            "\n",          # Then line breaks
            ". ",          # Then sentence boundaries
            " ",           # Then word boundaries (last resort)
        ]
    )
    
    chunks = splitter.split_documents(documents)
    
    print(f"✅ Created {len(chunks)} chunks from {len(documents)} document(s)")
    print(f"   Average chunk size: ~{sum(len(c.page_content) for c in chunks) // len(chunks)} characters")
    
    # Show a sample chunk so you understand what's being stored
    print(f"\n📋 Sample chunk preview:")
    print(f"   {chunks[0].page_content[:200]}...")
    
    return chunks


# ─────────────────────────────────────────────────────────────
# STEP 3: CREATE EMBEDDINGS
# ─────────────────────────────────────────────────────────────

def load_embedding_model():
    """
    Loads the sentence transformer model that converts text to vectors.
    
    WHAT ARE EMBEDDINGS? (Plain English)
    Imagine a map where similar concepts live close together.
    "I feel lonely" and "I feel isolated" would be placed very close on this map.
    "I feel lonely" and "pasta recipe" would be far apart.
    
    An embedding converts text into coordinates on this map.
    Example: "I feel lonely" → [0.23, -0.87, 0.41, ... 384 numbers total]
    
    WHY THIS IS POWERFUL:
    We don't need to teach the model anything new!
    These models are already pre-trained on billions of sentences.
    They already "understand" that loneliness and isolation are similar.
    
    WHY THIS REPLACES TRADITIONAL ML TRAINING:
    In old ML, you'd need labeled data and weeks of training.
    Here, we use a pre-trained model and skip all that work.
    This is called "transfer learning" — borrowing someone else's training.
    """
    print(f"\n🧠 Step 3: Loading embedding model '{EMBEDDING_MODEL}'...")
    print("   (First run will download ~90MB model — this is normal)")
    
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},   # Use CPU (change to "cuda" if you have GPU)
        encode_kwargs={"normalize_embeddings": True}  # Normalize for better similarity
    )
    
    print("✅ Embedding model loaded!")
    return embeddings


# ─────────────────────────────────────────────────────────────
# STEP 4: STORE IN CHROMADB
# ─────────────────────────────────────────────────────────────

def create_vector_store(chunks, embeddings):
    """
    Stores our chunks + their embeddings in ChromaDB.
    
    WHAT IS A VECTOR DATABASE? (Simple Analogy)
    Regular database: stores rows of data, searched with exact keywords.
    Vector database: stores data + its "meaning coordinates", searched by similarity.
    
    Example:
    - You ask: "My boyfriend won't talk to me"
    - ChromaDB converts that to a vector: [0.12, -0.34, ...]
    - It finds chunks whose vectors are CLOSEST to your query's vector
    - It returns: the "Communication Breakdown" chunk and "Stonewalling" chunk
    
    ChromaDB saves everything to disk, so we only run this ONCE.
    Next time we start the server, we just LOAD the existing database.
    """
    print(f"\n💾 Step 4: Creating ChromaDB vector store at '{CHROMA_DB_DIR}'...")
    
    # If database already exists, delete and recreate
    # (useful when you add new documents)
    if CHROMA_DB_DIR.exists():
        import shutil
        print("   ⚠️  Existing database found. Deleting and recreating...")
        shutil.rmtree(CHROMA_DB_DIR)
    
    # Create the vector store
    # This does THREE things at once:
    # 1. Converts each chunk to an embedding using our model
    # 2. Stores the embedding + original text in ChromaDB  
    # 3. Saves everything to disk at CHROMA_DB_DIR
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DB_DIR),
        collection_name="relationship_advice"  # Name our collection
    )
    
    print(f"✅ Vector store created with {len(chunks)} chunks!")
    print(f"   Database saved to: {CHROMA_DB_DIR}")
    
    return vector_store


# ─────────────────────────────────────────────────────────────
# STEP 5: VERIFY IT WORKS
# ─────────────────────────────────────────────────────────────

def test_retrieval(vector_store):
    """
    Quick test to make sure our vector store is working correctly.
    We'll ask a test question and see what gets retrieved.
    """
    print("\n🧪 Step 5: Testing retrieval with a sample query...")
    
    test_query = "I feel my partner is ignoring me and I feel abandoned"
    
    # Perform similarity search — finds top 3 most relevant chunks
    results = vector_store.similarity_search(test_query, k=3)
    
    print(f"\n   Query: '{test_query}'")
    print(f"\n   Top {len(results)} retrieved chunks:")
    
    for i, doc in enumerate(results, 1):
        source = doc.metadata.get("source", "unknown").split("/")[-1]
        preview = doc.page_content[:150].replace("\n", " ")
        print(f"\n   [{i}] Source: {source}")
        print(f"       Content: {preview}...")
    
    print("\n✅ Retrieval is working correctly!")


# ─────────────────────────────────────────────────────────────
# MAIN FUNCTION — Run all steps in order
# ─────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("🚀 RELATIONSHIP RAG AI — Document Ingestion Pipeline")
    print("=" * 60)
    
    # Step 1: Load documents from /data folder
    documents = load_documents()
    
    # Step 2: Split into manageable chunks
    chunks = split_documents(documents)
    
    # Step 3: Load the embedding model
    embeddings = load_embedding_model()
    
    # Step 4: Create and save the vector store
    vector_store = create_vector_store(chunks, embeddings)
    
    # Step 5: Test that retrieval works
    test_retrieval(vector_store)
    
    print("\n" + "=" * 60)
    print("✅ INGESTION COMPLETE!")
    print("   You can now start the backend server with:")
    print("   uvicorn backend.main:app --reload")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
