from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class InventoryTransactionType(str, Enum):
    STOCK_IN = "STOCK_IN"
    STOCK_OUT = "STOCK_OUT"
    ORDER = "ORDER"
    RETURN = "RETURN"
    ADJUSTMENT = "ADJUSTMENT"



class InventoryCreate(BaseModel):
    """
    Create inventory transaction.
    """

    variant_id: int

    change_amount: int

    transaction_type: InventoryTransactionType

    note: str | None = None



class InventoryResponse(BaseModel):
    """
    Inventory transaction response.
    """

    id: int

    variant_id: int

    change_amount: int

    transaction_type: InventoryTransactionType

    note: str | None

    created_by: int | None

    created_at: datetime


    class Config:
        from_attributes = True