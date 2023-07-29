import { FavoriteController } from "../controllers/favorite.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/fairs", sessionMiddleware, FavoriteController.getFavoriteFair);
router.get("/stands", sessionMiddleware, FavoriteController.getFavoriteStand);
// router.get("/products", sessionMiddleware, FavoriteController.getFavoriteStand);
router.patch("/fair", sessionMiddleware, FavoriteController.setFavoriteFair);
router.patch("/stand", sessionMiddleware, FavoriteController.setFavoriteStand);
// router.patch(
//   "/product",
//   sessionMiddleware,
//   FavoriteController.setFavoriteProduct
// );

export default router.router;
