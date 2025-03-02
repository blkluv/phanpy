import './welcome.css';

import boostsCarouselUrl from '../assets/features/boosts-carousel.jpg';
import groupedNotificationsUrl from '../assets/features/grouped-notifications.jpg';
import multiColumnUrl from '../assets/features/multi-column.jpg';
import multiHashtagTimelineUrl from '../assets/features/multi-hashtag-timeline.jpg';
import nestedCommentsThreadUrl from '../assets/features/nested-comments-thread.jpg';
import logoText from '../assets/logo-text.svg';
import logo from '../assets/logo.svg';
import Link from '../components/link';
import states from '../utils/states';
import useTitle from '../utils/useTitle';

function Welcome() {
  useTitle(null, ['/', '/welcome']);
  return (
    <main id="welcome">
      <div class="hero-container">
        <h1>
          <img
            src={logo}
            alt=""
            width="200"
            height="200"
            style={{
              aspectRatio: '1/1',
              marginBlockEnd: -16,
            }}
          />
          <img src={logoText} alt="Phanpy" width="250" />
        </h1>
        <p>
          <big>
            <b>
              <Link to="/login" class="button">
                Log in
              </Link>
            </b>
          </big>
        </p>
        <p class="desc">A positive vibes only social media donate-to-earn tokenopoly game. Learn more <b><a href="https://app.charmverse.io/luv-nft/getting-started">here.</a></b></p>
      </div>
      <div id="why-container">
        <div class="sections">
          <section>
            <img
              src={boostsCarouselUrl}
              alt="Screenshot of Boosts Carousel"
              loading="lazy"
            />
            <h4>Boosts Carousel</h4>
            <p>
              Visually separate original posts and re-shared posts (boosted
              posts).
            </p>
          </section>
          <section>
            <img
              src={nestedCommentsThreadUrl}
              alt="Screenshot of nested comments thread"
              loading="lazy"
            />
            <h4>Nested comments thread</h4>
            <p>Effortlessly follow conversations. Semi-collapsible replies.</p>
          </section>
          <section>
            <img
              src={groupedNotificationsUrl}
              alt="Screenshot of grouped notifications"
              loading="lazy"
            />
            <h4>Grouped notifications</h4>
            <p>
              Similar notifications are grouped and collapsed to reduce clutter.
            </p>
          </section>
          <section>
            <img
              src={multiColumnUrl}
              alt="Screenshot of multi-column UI"
              loading="lazy"
            />
            <h4>Single or multi-column</h4>
            <p>
              By default, single column for zen-mode seekers. Configurable
              multi-column for power users.
            </p>
          </section>
          <section>
            <img
              src={multiHashtagTimelineUrl}
              alt="Screenshot of multi-hashtag timeline with a form to add more hashtags"
              loading="lazy"
            />
            <h4>Multi-hashtag timeline</h4>
            <p>Up to 5 hashtags combined into a single timeline.</p>
          </section>
        </div>
      </div>
      <hr />
      <p>
        <a href="https://github.com/blkluv/phanpy" target="_blank">
          Made
        </a>{' '}
        with{' '}
        <a
          href="https://universeodon.com/@luv"
          target="_blank"
          onClick={(e) => {
            e.preventDefault();
            states.showAccount = 'luv@universeodon.com';
          }}
        >
          @luv
        </a>
        .{' '}
        <a
          href="https://github.com/blkluv/phanpy/blob/main/PRIVACY.MD"
          target="_blank"
        >
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}

export default Welcome;
