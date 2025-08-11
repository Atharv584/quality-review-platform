class ReviewApp {
  constructor() {
    this.reviews = this.loadReviews()
    this.currentRating = 0
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.renderReviews()
    this.updateStats()
    this.setupNavigation()
  }

  setupEventListeners() {
    // Form submission
    document.getElementById("review-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })

    // Star rating
    document.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", (e) => {
        this.setRating(Number.parseInt(e.target.dataset.rating))
      })

      star.addEventListener("mouseover", (e) => {
        this.highlightStars(Number.parseInt(e.target.dataset.rating))
      })
    })

    document.querySelector(".rating-input").addEventListener("mouseleave", () => {
      this.highlightStars(this.currentRating)
    })

    // Search and filters
    document.getElementById("search-input").addEventListener("input", () => {
      this.filterReviews()
    })

    document.getElementById("category-filter").addEventListener("change", () => {
      this.filterReviews()
    })

    document.getElementById("rating-filter").addEventListener("change", () => {
      this.filterReviews()
    })
  }

  setupNavigation() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const target = e.target.getAttribute("href")

        // Update active nav link
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
        e.target.classList.add("active")

        // Smooth scroll to section
        document.querySelector(target).scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    })
  }

  handleFormSubmit() {
    const formData = {
      productName: document.getElementById("product-name").value,
      category: document.getElementById("category").value,
      reviewerName: document.getElementById("reviewer-name").value,
      rating: this.currentRating,
      reviewText: document.getElementById("review-text").value,
      date: new Date().toLocaleDateString(),
    }

    if (!formData.rating) {
      alert("Please select a rating")
      return
    }

    this.addReview(formData)
    this.resetForm()

    // Show success message and scroll to reviews
    alert("Review submitted successfully!")
    document.querySelector("#reviews").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  addReview(reviewData) {
    const review = {
      id: Date.now(),
      ...reviewData,
    }

    this.reviews.unshift(review)
    this.saveReviews()
    this.renderReviews()
    this.updateStats()
  }

  setRating(rating) {
    this.currentRating = rating
    document.getElementById("rating").value = rating
    this.highlightStars(rating)
  }

  highlightStars(rating) {
    document.querySelectorAll(".star").forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active")
      } else {
        star.classList.remove("active")
      }
    })
  }

  resetForm() {
    document.getElementById("review-form").reset()
    this.currentRating = 0
    this.highlightStars(0)
  }

  filterReviews() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase()
    const categoryFilter = document.getElementById("category-filter").value
    const ratingFilter = document.getElementById("rating-filter").value

    const filteredReviews = this.reviews.filter((review) => {
      const matchesSearch =
        review.productName.toLowerCase().includes(searchTerm) ||
        review.reviewText.toLowerCase().includes(searchTerm) ||
        review.reviewerName.toLowerCase().includes(searchTerm)

      const matchesCategory = !categoryFilter || review.category === categoryFilter

      const matchesRating = !ratingFilter || review.rating >= Number.parseInt(ratingFilter)

      return matchesSearch && matchesCategory && matchesRating
    })

    this.renderReviews(filteredReviews)
  }

  renderReviews(reviewsToRender = this.reviews) {
    const reviewsGrid = document.getElementById("reviews-grid")
    const noReviewsMessage = document.getElementById("no-reviews")

    if (reviewsToRender.length === 0) {
      reviewsGrid.style.display = "none"
      noReviewsMessage.style.display = "block"
      return
    }

    reviewsGrid.style.display = "grid"
    noReviewsMessage.style.display = "none"

    reviewsGrid.innerHTML = reviewsToRender
      .map(
        (review) => `
            <div class="review-card">
                <div class="review-header">
                    <div>
                        <h4 class="review-title">${review.productName}</h4>
                        <span class="review-category">${this.formatCategory(review.category)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    <span class="stars">${this.generateStars(review.rating)}</span>
                    <span class="rating-number">${review.rating}/5</span>
                </div>
                <p class="review-text">${review.reviewText}</p>
                <div class="review-meta">
                    <span class="reviewer-name">By ${review.reviewerName}</span>
                    <span class="review-date">${review.date}</span>
                </div>
            </div>
        `,
      )
      .join("")
  }

  generateStars(rating) {
    let stars = ""
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? "★" : "☆"
    }
    return stars
  }

  formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
  }

  updateStats() {
    const totalReviews = this.reviews.length
    const avgRating =
      totalReviews > 0
        ? (this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : "0.0"

    document.getElementById("total-reviews").textContent = totalReviews
    document.getElementById("avg-rating").textContent = avgRating
  }

  loadReviews() {
    const saved = localStorage.getItem("reviewhub-reviews")
    if (saved) {
      return JSON.parse(saved)
    }

    // Default sample reviews
    return [
      {
        id: 1,
        productName: "iPhone 15 Pro",
        category: "technology",
        reviewerName: "Sarah Johnson",
        rating: 5,
        reviewText:
          "Absolutely amazing phone! The camera quality is outstanding and the performance is incredibly smooth. The titanium build feels premium and the battery life easily lasts a full day of heavy usage.",
        date: "2024-01-15",
      },
      {
        id: 2,
        productName: "The Italian Corner Restaurant",
        category: "food",
        reviewerName: "Mike Chen",
        rating: 4,
        reviewText:
          "Great authentic Italian food with a cozy atmosphere. The pasta was perfectly cooked and the service was friendly. Only downside was the wait time, but it was worth it!",
        date: "2024-01-12",
      },
      {
        id: 3,
        productName: "Netflix Premium",
        category: "entertainment",
        reviewerName: "Emily Davis",
        rating: 4,
        reviewText:
          "Excellent content library with great original series. The 4K streaming quality is superb. Wish they had more recent movies, but overall very satisfied with the service.",
        date: "2024-01-10",
      },
    ]
  }

  saveReviews() {
    localStorage.setItem("reviewhub-reviews", JSON.stringify(this.reviews))
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReviewApp()
})
