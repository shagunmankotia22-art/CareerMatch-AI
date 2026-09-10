"""
Step 6: Split Documents with RecursiveCharacterTextSplitter.

LangChain Concept:
------------------
Why not embed an entire page?
1. Embedding an entire page dilutes the semantic meaning of individual paragraphs.
2. An LLM context window can get filled with irrelevant text from the rest of the page.
3. Chunks allow the vector search to find the *exact* paragraph answering the student's question.

How RecursiveCharacterTextSplitter works:
- It splits text hierarchically using separators: ["\n\n", "\n", " ", ""]
  1. Tries to split on paragraphs first ("\n\n").
  2. If a paragraph is still too long, splits on line breaks ("\n").
  3. If still too long, splits on words (" ").
- `chunk_size`: The maximum number of characters per chunk.
- `chunk_overlap`: The number of characters shared between consecutive chunks,
  ensuring semantic context isn't sliced in half at boundary edges.
- `split_documents()` preserves all metadata (e.g., source file and page number)!
"""

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_course_documents(docs, chunk_size: int = 250, chunk_overlap: int = 50):
    print(f"\nInitializing RecursiveCharacterTextSplitter...")
    print(f"  - chunk_size: {chunk_size} characters")
    print(f"  - chunk_overlap: {chunk_overlap} characters")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = splitter.split_documents(docs)
    
    print(f"\nSuccessfully split {len(docs)} document page(s) into {len(chunks)} chunks.")
    print("=" * 65)
    
    for i, chunk in enumerate(chunks):
        page_num = chunk.metadata.get("page", 0) + 1
        source = chunk.metadata.get("source", "unknown")
        print(f"\n[CHUNK {i + 1}] | Length: {len(chunk.page_content)} chars | Page: {page_num} | Source: {source}")
        print(f"Content: \"{chunk.page_content.strip()}\"")
        print("-" * 65)
        
    return chunks

def main():
    pdf_path = os.path.join("data", "sample_course.pdf")
    
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found. Please run pdf_loader_test.py first.")
        return
        
    print(f"Loading {pdf_path} for splitting...")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    
    chunks = split_course_documents(docs, chunk_size=250, chunk_overlap=50)
    
    print("\nVerification Checklist:")
    print(f"  [x] Total chunks created: {len(chunks)}")
    print(f"  [x] Chunks inherit page metadata: {all('page' in c.metadata for c in chunks)}")
    print("\nStep 6 is COMPLETE: Documents successfully chunked with metadata preserved!")

if __name__ == "__main__":
    main()
