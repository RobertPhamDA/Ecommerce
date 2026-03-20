from fastapi import APIRouter

from app.api.routers import auth, bookings, categories, comments, orders, posts, products, uploads

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(posts.router)
api_router.include_router(comments.router)
api_router.include_router(bookings.router)
api_router.include_router(orders.router)
api_router.include_router(uploads.router)

