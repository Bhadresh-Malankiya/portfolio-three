import { ArrowUpRight, Star } from "lucide-react";
import { upwork } from "@/data/upwork";
import Reveal from "@/components/Reveal";
export default function ClientReviews() {
  return (
    <section className="review-section page-shell" id="reviews">
      <div className="review-heading">
        <div>
          <p className="eyebrow">{"// from the other side"}</p>
          <h2>
            The work.
            <br />
            <em>In their words.</em>
          </h2>
        </div>
        <a
          href={upwork.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Client feedback on Upwork <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="review-grid">
        {[3, 0, 2].map((n, i) => {
          const review = upwork.testimonials[n];
          return (
            <Reveal
              key={review.job}
              delay={i * 0.07}
              className={`review-card glass-panel ${i === 0 ? "review-featured glow-border" : ""}`}
            >
              <div className="review-rating">
                <span aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} size={13} fill="currentColor" />
                  ))}
                </span>
                {i === 0 && <small>FEATURED FEEDBACK</small>}
              </div>
              <blockquote>“{review.quote}”</blockquote>
              <footer>
                <strong>{review.job}</strong>
                <span>{review.period} · Upwork client</span>
              </footer>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
