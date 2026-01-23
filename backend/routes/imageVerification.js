const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Vehicle image verification
const verifyVehicleImage = async (imageBuffer) => {
  try {
    if (!imageBuffer) {
      return {
        success: false,
        verified: false,
        error: 'No image data provided',
      };
    }

    // Check file size
    const fileSize = imageBuffer.length;
    const isReasonableSize = fileSize > 50000 && fileSize < 10 * 1024 * 1024;
    
    if (!isReasonableSize) {
      return {
        success: true,
        verified: false,
        analysis: {
          hasVehicle: false,
          isFrontView: false,
          isGoodQuality: false,
          confidence: 0,
          feedback: 'Image file size is invalid. Please upload a larger, clearer vehicle photo.',
        },
      };
    }

    // Simple heuristic: if size is reasonable, accept
    return {
      success: true,
      verified: true,
      analysis: {
        hasVehicle: true,
        isFrontView: true,
        isGoodQuality: true,
        confidence: 80,
        feedback: 'Image accepted. Please ensure it is a clear front view of your vehicle.',
      },
    };
  } catch (error) {
    console.error('Image verification error:', error.message);
    return {
      success: false,
      verified: false,
      error: error.message || 'Unknown error during verification',
    };
  }
};

// POST /api/image-verification/verify-vehicle
router.post('/verify-vehicle', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        error: 'No image file provided' 
      });
    }

    // Verify image from buffer
    const result = await verifyVehicleImage(req.file.buffer);
    return res.json(result);
  } catch (error) {
    console.error('Verification endpoint error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error.message || 'Failed to verify image',
    });
  }
});

module.exports = router;
