FROM python:3.12.5

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5041

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5041"]