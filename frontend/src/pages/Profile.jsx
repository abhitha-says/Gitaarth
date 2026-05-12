import { User, BookmarkIcon, History, Settings, LogIn } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const isLoggedIn = false; // Will be connected to AuthContext later

  if (!isLoggedIn) {
    return (
      <main className="profile profile--guest" id="profile-page">
        <div className="container">
          <div className="profile__login-card card-glass">
            <div className="profile__login-icon">
              <User size={40} />
            </div>
            <h2 className="profile__login-title">
              Sign in to <span className="text-gradient-gold">Unlock</span>
            </h2>
            <p className="profile__login-desc">
              Sign in with Google to save your bookmarks, access conversation
              history, and personalize your experience.
            </p>

            <div className="profile__features-list">
              <div className="profile__feature-item">
                <BookmarkIcon size={18} className="profile__feature-icon" />
                <span>Save shlokas and responses that resonate</span>
              </div>
              <div className="profile__feature-item">
                <History size={18} className="profile__feature-icon" />
                <span>Revisit past conversations with the divine</span>
              </div>
              <div className="profile__feature-item">
                <Settings size={18} className="profile__feature-icon" />
                <span>Customize language and preferences</span>
              </div>
            </div>

            <button className="btn-divine profile__login-btn" id="profile-signin">
              <LogIn size={18} />
              Sign in with Google
            </button>

            <p className="profile__login-note">
              Guest mode is always available for chatting.
              Signing in just unlocks extra features.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile" id="profile-page">
      <div className="container">
        <h1>Profile</h1>
        {/* Full profile will be built when auth is connected */}
      </div>
    </main>
  );
}
