"""
Step 11: Create Course Material Tool using @tool.

LangChain / Agent Concept:
--------------------------
What is @tool?
The `@tool` decorator converts a standard Python function into a LangChain Tool that an LLM agent can call.

Why is the docstring critical?
LLMs (agents) do not read your Python logic—they only read:
1. The tool's name (`retrieve_course_material`).
2. The docstring (description of what it does and when to call it).
3. The arguments and type hints.

To satisfy Hackathon Requirement 7:
The docstring MUST explicitly distinguish course content queries from external job/internship queries,
so the future agent knows exactly which tool to trigger.
"""

from langchain_core.tools import tool
from retriever_test import get_retriever

# Cached retriever instance
_retriever = None

def _get_or_create_retriever():
    global _retriever
    if _retriever is None:
        _retriever = get_retriever(k=3)
    return _retriever

@tool
def retrieve_course_material(query: str) -> str:
    """
    Search and retrieve relevant text excerpts from the student's uploaded course materials,
    including lecture notes, textbooks, syllabi, and academic definitions.
    
    USE THIS TOOL WHEN:
    - The user asks about academic concepts, course topics, definitions, or syllabus contents
      (e.g., "What is a text splitter?", "Explain how RAG works", "What topics are on the exam?").
    - Determining what skills or topics the student has studied in their course notes.
    
    DO NOT USE THIS TOOL FOR:
    - Searching for jobs, internships, company vacancies, or career opportunities
      (use the job/internship search tool for those queries).
      
    Args:
        query: The academic question, topic, or concept to search for in the course documents.
        
    Returns:
        Formatted text excerpts with source filenames and page numbers.
    """
    retriever = _get_or_create_retriever()
    docs = retriever.invoke(query)
    
    if not docs:
        return "No relevant course material found for this query in the uploaded documents."
        
    results = []
    for i, doc in enumerate(docs):
        page = doc.metadata.get("page", 0) + 1
        source = doc.metadata.get("source", "course_material")
        results.append(
            f"--- Excerpt {i+1} [Source: {source}, Page: {page}] ---\n"
            f"{doc.page_content.strip()}"
        )
        
    return "\n\n".join(results)

def main():
    print("Testing retrieve_course_material tool...")
    print(f"Tool Name        : {retrieve_course_material.name}")
    print(f"Tool Description : {retrieve_course_material.description[:120]}...")
    print(f"Tool Arguments   : {retrieve_course_material.args}")
    print("=" * 65)
    
    # Test invoking the tool directly (as an agent would)
    test_query = "What is a text splitter?"
    print(f"\nInvoking tool with query: \"{test_query}\" ...\n")
    output = retrieve_course_material.invoke({"query": test_query})
    
    print("Tool Output:")
    print(output)
    print("=" * 65)
    print("\nStep 11 is COMPLETE: Course material tool ready for agent integration!")

if __name__ == "__main__":
    main()
