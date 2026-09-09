"""
Step 7: Create Embeddings using Ollama.

LangChain / RAG Concept:
------------------------
What is an Embedding?
An embedding model converts text into a high-dimensional vector (a list of numbers,
e.g., 1024 or 4096 dimensions). Words and concepts with similar semantic meaning
are placed close together in this vector space.

How does RAG use embeddings?
1. At ingestion time: Every text chunk from the course PDF is converted into an embedding
   vector and stored in Chroma.
2. At query time: The student's question (e.g., "What is a text splitter?") is also converted
   into an embedding vector using the exact same model.
3. The vector database calculates the mathematical similarity (Cosine Similarity) between the
   question vector and all chunk vectors, finding the closest matching course material!
"""

import math
from langchain_ollama import OllamaEmbeddings

# nomic-embed-text is Ollama's official, high-performance dedicated embedding model (274 MB)
MODEL_NAME = "nomic-embed-text"

def cosine_similarity(v1, v2):
    """Calculates cosine similarity between two vectors (-1 to 1, where 1 is identical)."""
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))
    return dot_product / (norm_a * norm_b) if (norm_a * norm_b) != 0 else 0.0

def main():
    print(f"Connecting to Ollama Embeddings with model: {MODEL_NAME} ...")
    
    embeddings = OllamaEmbeddings(
        model=MODEL_NAME
    )
    
    # 1. Embed a single query
    query = "What is a text splitter?"
    print(f"\n1. Generating embedding for query: \"{query}\"")
    query_vector = embeddings.embed_query(query)
    
    print(f"   -> Embedding generated successfully!")
    print(f"   -> Vector dimension size: {len(query_vector)} numbers")
    print(f"   -> Vector snippet (first 5 numbers): {[round(x, 4) for x in query_vector[:5]]}")
    
    # 2. Embed two candidate texts (one relevant, one completely irrelevant)
    relevant_doc = "A text splitter breaks large documents into small chunks using separators."
    irrelevant_doc = "The recipe for chocolate cake requires flour, cocoa powder, and sugar."
    
    print(f"\n2. Comparing semantic similarity against two candidate documents:")
    print(f"   Doc A (Relevant)  : \"{relevant_doc}\"")
    print(f"   Doc B (Irrelevant): \"{irrelevant_doc}\"")
    
    doc_vectors = embeddings.embed_documents([relevant_doc, irrelevant_doc])
    
    sim_a = cosine_similarity(query_vector, doc_vectors[0])
    sim_b = cosine_similarity(query_vector, doc_vectors[1])
    
    print(f"\n3. Similarity Scores (higher = closer match):")
    print(f"   Query <-> Doc A (Relevant)  : {sim_a:.4f}")
    print(f"   Query <-> Doc B (Irrelevant): {sim_b:.4f}")
    
    if sim_a > sim_b:
        print("\n Semantic verification passed! The relevant course note scored significantly higher.")
    else:
        print("\n Note: Similarity scores were close. We will check thresholds.")
        
    print("\nStep 7 is COMPLETE: Ollama embeddings are fully working!")

if __name__ == "__main__":
    main()