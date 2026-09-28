import {Router} from "express";

import todo from "./todos";

const router = Router();
router.use("/todos",todo);
export default router;