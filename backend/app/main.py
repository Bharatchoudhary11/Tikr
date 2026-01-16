from fastapi import FastAPI

app = FastAPI(title="Tikr Backend")


@app.get("/health")
def health_check():
  return {"status": "ok"}
