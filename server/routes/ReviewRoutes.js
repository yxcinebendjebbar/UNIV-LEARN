import express from 'express';
import Review from '../models/ReviewModel.js'; 

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    next();
  };
  
// Route to create a new review
router.post('/',isLoggedIn, async (req, res) => {
  try {
    const { course, content } = req.body;
    const review = new Review({ course, writerId:req.session.user.id , content });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all reviews for a specific course
router.get('/:courseId',isLoggedIn ,async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const reviews = await Review.find({ course: courseId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a review by its ID
router.put('/:reviewId', isLoggedIn, async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const { content } = req.body;
      
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (req.session.user.id !== review.writerId.toString()) {
        return res.status(403).json({ error: 'Unauthorized access: You are not authorized to update this review' });
      }

      review.content = content;
      const updatedReview = await review.save();
      
      res.status(200).json(updatedReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Route to delete a review by its ID
router.delete('/:reviewId', isLoggedIn ,async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (req.session.user.id !== review.writerId.toString()) {
        return res.status(403).json({ error: 'Unauthorized access: You are not authorized to delete this review' });
      }
  
      const deletedReview = await Review.findByIdAndDelete(reviewId);
      if (!deletedReview) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default router;
