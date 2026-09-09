"""
Step 1: Prove that ChatOllama works before building anything else.

Run this after:
  1. Ollama is installed and running (see instructions below)
  2. You've pulled a model: `ollama pull llama3.2`
  3. You've installed the langchain-ollama package
"""

from langchain_ollama import ChatOllama

MODEL_NAME = "qwen3:latest"  # already installed locally; good general Q&A/explanation quality

def main():
    print(f"Connecting to Ollama with model: {MODEL_NAME} ...")

    llm = ChatOllama(
        model=MODEL_NAME,
        temperature=0.2,  # low temperature: we want grounded, factual answers later for RAG
    )

    response = llm.invoke("Explain RAG (Retrieval-Augmented Generation) in one sentence.")

    print("\n--- ChatOllama response ---")
    print(response.content)
    print("----------------------------\n")
    print("If you see a real sentence above (not an error), Step 1 is DONE.")

if __name__ == "__main__":
    main()
