from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config: ConfigDict = ConfigDict(
        extra="ignore",
        validate_by_alias=True,
        validate_by_name=True,
        alias_generator=to_camel,
    )
