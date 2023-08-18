import './welcome.css';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import boostsCarouselUrl from '../assets/features/boosts-carousel.jpg';
import luvr from '../assets/features/luvr.png';
import blue from '../assets/features/blue.png';
import groupedNotificationsUrl from '../assets/features/grouped-notifications.jpg';
import multiColumnUrl from '../assets/features/multi-column.jpg';
import multiHashtagTimelineUrl from '../assets/features/multi-hashtag-timeline.jpg';
import nestedCommentsThreadUrl from '../assets/features/nested-comments-thread.jpg';
import logoText from '../assets/logo-text.svg';
import logo from '../assets/logo.svg';
import useTitle from '../utils/useTitle';

function Welcome() {
  useTitle(null, ['/', '/welcome']);
  
  return (
    <main id="welcome">
      <div className="hero-container">
        <h1>
          <Image
            src={logo}
            alt=""
            width={200}
            height={200}
            style={{
              aspectRatio: '1/1',
              marginBlockEnd: -16,
            }}
          />
          <Image src={logoText} alt="LUV NFT" width={250} />
        </h1>
        <p>
          <big>
            <b>
              <Link href="/login">
                <a className="button">Log in</a>
              </Link>
            </b>
          </big>
        </p>
        <p className="desc">A positive vibes only social media platform.</p>
      </div>
      <div id="why-container">
        <div className="sections">
          <section>
            <img
              src={luvr}
              alt="id"
              loading="lazy"
            />
            <h4>LUVR</h4>
            <p>
              Your LUV NFT tribe 🆔 (<a href="https://luvr.luvnft.com">Claim it</a>)
            </p>
          </section>
          <section>
            <img
              src={blue}
              alt="blue"
              loading="lazy"
            />
            <h4>Verified</h4>
            <p>
              Your verified Blue Check 🔵 (<a href="https://verified.luvnft.com">Claim it</a>)
            </p>
          </section>
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
        <a href="https://luvnft.com" target="_blank" rel="noopener noreferrer">
          Created
        </a>{' '}
        by{' '}
        <a
          href="https://universeodon.com/@luv"
          target="_blank"
          rel="noopener noreferrer"
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
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}

export default Welcome;
