const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
    userById,
    // readAll,
    readOne,
    update,
    purchaseHistory
} = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

// router.get("/users", requireSignin, isAuth, readAll);
router.get("/user/:userId", requireSignin, isAuth, readOne);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);

router.param("userId", userById);

module.exports = router;
