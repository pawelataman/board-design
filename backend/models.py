from pydantic import BaseModel, Field


class Person(BaseModel):
    name: str = Field(..., min_length=1)
    age: int
    email: str
