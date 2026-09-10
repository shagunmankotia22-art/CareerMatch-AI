"""
Step 5: Load Course Material PDF using PyPDFLoader.

LangChain Concept:
------------------
PyPDFLoader loads a PDF file and converts each physical page into a LangChain `Document` object.
Each Document contains:
  - `page_content`: The extracted plain text of that page.
  - `metadata`: A dictionary containing document metadata, such as:
      - `source`: The filepath of the PDF.
      - `page`: The 0-indexed page number.
Preserving this metadata is critical for showing citations (e.g., 'Source: page 2') to students!
"""

import os
from langchain_community.document_loaders import PyPDFLoader

def load_course_pdf(file_path: str):
    print(f"Loading PDF document from: {file_path} ...")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at '{file_path}'. Please check the path.")
        
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    print(f"\n Successfully loaded {len(docs)} page(s) from PDF.")
    print("=" * 60)
    
    for i, doc in enumerate(docs):
        print(f"\n--- [PAGE {i + 1}] ---")
        print(f"Metadata: {doc.metadata}")
        preview = doc.page_content.strip()
        print(f"Content Preview:\n{preview}")
        print("-" * 60)
        
    return docs

def main():
    sample_pdf_path = os.path.join("data", "sample_course.pdf")
    
    if not os.path.exists(sample_pdf_path):
        print(f"Sample PDF not found at {sample_pdf_path}.")
        print("Generating a sample course PDF first...")
        from create_sample_pdf import create_sample_course_pdf
        create_sample_course_pdf(sample_pdf_path)
        
    docs = load_course_pdf(sample_pdf_path)
    print("\nStep 5 is COMPLETE: PDF loaded and converted into LangChain Documents!")

if __name__ == "__main__":
    main()
