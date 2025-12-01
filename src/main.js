import './style.css'

// Simple interaction for header background on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

// Portfolio Carousel
const initCarousel = () => {
  const track = document.querySelector('.portfolio-carousel__track');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track || !prevBtn || !nextBtn) return;

  const items = Array.from(track.children);
  let currentIndex = 0;
  const itemsPerPage = 3; // デスクトップで3つ表示
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const updateCarousel = () => {
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = 40; // CSSのgapと一致
    const moveAmount = (itemWidth + gap) * itemsPerPage;
    track.style.transform = `translateX(-${moveAmount * currentIndex}px)`;

    // ドットの更新
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('carousel-dot--active');
      } else {
        dot.classList.remove('carousel-dot--active');
      }
    });

    // ボタンの有効/無効
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalPages - 1;
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex === totalPages - 1 ? '0.5' : '1';
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalPages - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // 初期化
  updateCarousel();

  // ウィンドウリサイズ時に再計算
  window.addEventListener('resize', updateCarousel);
};

// DOMロード後にカルーセルを初期化
document.addEventListener('DOMContentLoaded', initCarousel);

// Contact Form Logic
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    // Honeypot check
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
      // It's a bot, silently fail
      console.log('Spam detected');
      return;
    }

    // Basic validation
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Simulate sending
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    setTimeout(() => {
      // Success
      submitBtn.textContent = '送信完了';
      formMessage.textContent = 'お問い合わせありがとうございます。担当者よりご連絡いたします。';
      formMessage.classList.add('success');
      contactForm.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }, 5000);
    }, 1500);
  });
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other items (optional, but good for UX)
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      }
    });

    // Toggle current item
    item.classList.toggle('active');

    const answer = item.querySelector('.faq-answer');
    if (item.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});

// Portfolio video play on click (not hover)
const portfolioVideos = document.querySelectorAll('.smartphone-mockup__screen video');
portfolioVideos.forEach(video => {
  const mockup = video.closest('.smartphone-mockup');

  mockup.addEventListener('click', () => {
    if (video.paused) {
      // Pause other videos
      portfolioVideos.forEach(v => {
        if (v !== video) {
          v.pause();
        }
      });
      video.play();
    } else {
      video.pause();
    }
  });
});
