from pydantic import BaseModel


class SSLCommerzInitiateResponse(BaseModel):
    gateway_url: str
    transaction_id: str
