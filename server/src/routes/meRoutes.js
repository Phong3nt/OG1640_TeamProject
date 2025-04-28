const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middlewares/auth");
const { getMyAllocations } = require("../controllers/tutorAllocationController");
const Allocation = require("../models/TutorAllocation");

router.get("/allocations", requireSignIn, getMyAllocations);

// Get allocations for a specific tutor
router.get("/allocations/tutor/:tutorId", async (req, res) => {
    try {
      const tutorId = req.params.tutorId;
  
      // Fetch allocations for the tutor
      const allocations = await Allocation.find({ tutor: tutorId }).populate(
        "student",
        "fullName email"
      );
      // Extract student details
      const students = allocations.map((allocation) => allocation.student);
  
      res.status(200).json({ students });
    } catch (error) {
      console.error("Error fetching allocated students:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;