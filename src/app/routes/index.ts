import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: "a",
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
