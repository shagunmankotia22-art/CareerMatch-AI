"""
Script to create a sample course syllabus / notes PDF for testing CareerMatch AI RAG pipeline.
Uses reportlab if available; otherwise falls back to a clean built-in PDF generator.
"""

import os

def create_sample_course_pdf(output_path="data/sample_course.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        
        title_style = styles["Title"]
        h1_style = styles["Heading1"]
        h2_style = styles["Heading2"]
        body_style = styles["BodyText"]
        body_style.fontSize = 11
        body_style.leading = 15
        
        story = []
        
        story.append(Paragraph("CS 501: Artificial Intelligence & Information Retrieval", title_style))
        story.append(Spacer(1, 15))
        
        story.append(Paragraph("Lecture 1: Introduction to Retrieval-Augmented Generation (RAG)", h1_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(
            "Retrieval-Augmented Generation (RAG) is a powerful architecture that combines an information "
            "retrieval system with a generative large language model (LLM). Instead of relying exclusively on "
            "the static parameters learned during pre-training, a RAG system retrieves authoritative external "
            "knowledge from a curated vector database and injects that context directly into the prompt.",
            body_style
        ))
        story.append(Spacer(1, 10))
        story.append(Paragraph("How RAG Works:", h2_style))
        story.append(Paragraph(
            "1. Ingestion Phase: Documents (e.g., lecture notes, syllabi, textbooks) are ingested using document loaders.<br/>"
            "2. Splitting Phase: Long documents are split into smaller chunks using text splitters to fit LLM context limits.<br/>"
            "3. Embedding Phase: Each chunk is converted into a high-dimensional dense vector representation via an embedding model.<br/>"
            "4. Storage: Embeddings and their corresponding text are stored in a persistent vector database such as Chroma.<br/>"
            "5. Retrieval & Generation: At query time, the user's question is embedded, semantically similar chunks are retrieved, "
            "and an LLM generates a grounded answer with citations.",
            body_style
        ))
        
        story.append(Spacer(1, 20))
        story.append(Paragraph("Lecture 2: Text Chunking and Text Splitters", h1_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(
            "What is a text splitter? A text splitter is an essential utility in RAG pipelines designed to break long "
            "documents into smaller, manageable chunks. Text splitters ensure that retrieved passages are cohesive, "
            "semantically focused, and fit comfortably within the LLM's context window.",
            body_style
        ))
        story.append(Spacer(1, 10))
        story.append(Paragraph("RecursiveCharacterTextSplitter:", h2_style))
        story.append(Paragraph(
            "RecursiveCharacterTextSplitter is the standard text splitter for general text documents. It attempts to split on a "
            "hierarchy of delimiters: double newlines (paragraphs), single newlines (lines), and spaces (words). This hierarchy "
            "ensures paragraphs remain intact as long as possible before falling back to individual sentences or words.<br/>"
            "Key configuration parameters:<br/>"
            "- chunk_size: Maximum number of characters in a chunk.<br/>"
            "- chunk_overlap: Number of characters shared between consecutive chunks to preserve contextual continuity.",
            body_style
        ))
        
        doc.build(story)
        print(f"Sample PDF created successfully at: {output_path} (using reportlab)")
        return True
    except ImportError:
        # Minimal standalone PDF 1.4 generator with exact byte offsets
        p1 = (
            "BT /F1 16 Tf 50 740 Td (CS 501: AI and Information Retrieval) Tj "
            "/F1 12 Tf 0 -30 Td (Lecture 1: Introduction to Retrieval-Augmented Generation - RAG) Tj "
            "0 -20 Td (Explain how RAG works: RAG combines information retrieval with an LLM.) Tj "
            "0 -15 Td (Documents are loaded, split into chunks, embedded, and stored in Chroma.) Tj "
            "0 -15 Td (When a query is asked, relevant chunks are retrieved and passed to the LLM.) Tj "
            "ET"
        )
        p2 = (
            "BT /F1 16 Tf 50 740 Td (Lecture 2: Text Chunking and Text Splitters) Tj "
            "/F1 12 Tf 0 -30 Td (What is a text splitter? A text splitter breaks large documents into small chunks.) Tj "
            "0 -20 Td (RecursiveCharacterTextSplitter splits hierarchically by paragraphs, lines, and spaces.) Tj "
            "0 -15 Td (It uses chunk_size and chunk_overlap to maintain context across adjacent chunks.) Tj "
            "ET"
        )
        
        def obj(num, body):
            return f"{num} 0 obj\n{body}\nendobj\n".encode("latin1")
            
        objs = [
            obj(1, "<< /Type /Catalog /Pages 2 0 R >>"),
            obj(2, "<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>"),
            obj(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R >> >> /Contents 4 0 R >>"),
            obj(4, f"<< /Length {len(p1)} >>\nstream\n{p1}\nendstream"),
            obj(5, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R >> >> /Contents 6 0 R >>"),
            obj(6, f"<< /Length {len(p2)} >>\nstream\n{p2}\nendstream"),
            obj(7, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
        ]
        
        header = b"%PDF-1.4\n"
        offsets = []
        pos = len(header)
        body = b""
        for o in objs:
            offsets.append(pos)
            body += o
            pos += len(o)
            
        xref = f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode("latin1")
        for off in offsets:
            xref += f"{off:010d} 00000 n \n".encode("latin1")
            
        trailer = f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{pos}\n%%EOF\n".encode("latin1")
        
        with open(output_path, "wb") as f:
            f.write(header + body + xref + trailer)
            
        print(f"Sample PDF created successfully at: {output_path} (using built-in generator)")
        return True

if __name__ == "__main__":
    create_sample_course_pdf()
