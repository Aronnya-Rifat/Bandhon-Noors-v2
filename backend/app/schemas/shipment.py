from pydantic import (
    BaseModel,
    Field,
)


class ShipmentUpdate(BaseModel):
    courier_name: str = Field(
        min_length=2,
        max_length=100,
    )

    tracking_number: str = Field(
        min_length=2,
        max_length=150,
    )
