
import sys
import numpy
import subprocess


# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'wget'])
# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'langchain'])
# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'faiss-cpu'])
# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'tiktoken'])
# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'PyPDF2'])
# subprocess.check_call([sys.executable, '-m', 'pip', 'install', 
# 'openai'])



import wget
from langchain.embeddings.openai import OpenAIEmbeddings
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
import wget
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI


text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1,  # thousand charctere
        chunk_overlap=1,
        length_function=len,
    )

    # Apply splitting


# Press the green button in the gutter to run the script.
arg1="Hello My Name is Aly"
text_chunks = text_splitter.split_text(arg1)
print(len(text_chunks))
print(len((text_chunks[0])))
# return len(text_chunks)
# output = splitText(arg1)
# print(output)
# return output

print('hello')
# sys.stdout.flush()



# See PyCharm help at https://www.jetbrains.com/help/pycharm/
