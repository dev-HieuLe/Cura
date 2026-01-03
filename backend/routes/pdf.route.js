import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pdfUrl = `https://api.ods.od.nih.gov/dsld/s3/pdf/${id}.pdf`;

  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return res.status(404).send("PDF not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "public, max-age=86400");

    response.body.pipe(res);
  } catch (err) {
    console.error("PDF proxy error:", err);
    res.status(500).send("Failed to load PDF");
  }
});

export default router;
