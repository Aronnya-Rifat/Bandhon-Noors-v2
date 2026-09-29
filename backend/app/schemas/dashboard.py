from pydantic import BaseModel


class DashboardResponse(BaseModel):
    """
    Admin dashboard statistics.
    """


    total_customers: int

    total_products: int

    total_orders: int

    pending_orders: int

    total_sales: float

    low_stock_count: int