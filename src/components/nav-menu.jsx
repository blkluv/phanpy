import './nav-menu.css';

import { ControlledMenu, MenuDivider, MenuItem } from '@szhsin/react-menu';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLongPress } from 'use-long-press';
import { useSnapshot } from 'valtio';

import { api } from '../utils/api';
import safeBoundingBoxPadding from '../utils/safe-bounding-box-padding';
import states from '../utils/states';
import store from '../utils/store';
import { Link } from 'react-router-dom';

import Avatar from './avatar';
import Icon from './icon';
import MenuLink from './menu-link';

function NavMenu(props) {
  const snapStates = useSnapshot(states);
  const { instance, authenticated } = api();

  const [currentAccount, setCurrentAccount] = useState();
  const [moreThanOneAccount, setMoreThanOneAccount] = useState(false);

  useEffect(() => {
    const accounts = store.local.getJSON('accounts') || [];
    const acc = accounts.find(
      (account) => account.info.id === store.session.get('currentAccount'),
    );
    if (acc) setCurrentAccount(acc);
    setMoreThanOneAccount(accounts.length > 1);
  }, []);

  // Home = Following
  // But when in multi-column mode, Home becomes columns of anything
  // User may choose pin or not to pin Following
  // If user doesn't pin Following, we show it in the menu
  const showFollowing =
    (snapStates.settings.shortcutsColumnsMode ||
      snapStates.settings.shortcutsViewMode === 'multi-column') &&
    !snapStates.shortcuts.find((pin) => pin.type === 'following');

  const bindLongPress = useLongPress(
    () => {
      states.showAccounts = true;
    },
    {
      threshold: 600,
      detect: 'touch',
      cancelOnMovement: true,
    },
  );

  const buttonRef = useRef();
  const [menuState, setMenuState] = useState(undefined);

  const boundingBoxPadding = safeBoundingBoxPadding([
    0,
    0,
    snapStates.settings.shortcutsViewMode === 'tab-menu-bar' ? 50 : 0,
    0,
  ]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        class={`button plain nav-menu-button ${
          moreThanOneAccount ? 'with-avatar' : ''
        } ${open ? 'active' : ''}`}
        style={{ position: 'relative' }}
        onClick={() => {
          setMenuState((state) => (!state ? 'open' : undefined));
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          states.showAccounts = true;
        }}
        {...bindLongPress()}
      >
        {moreThanOneAccount && (
          <Avatar
            url={
              currentAccount?.info?.avatar || currentAccount?.info?.avatarStatic
            }
            size="l"
            squircle={currentAccount?.info?.bot}
          />
        )}
        <Icon icon="menu" size={moreThanOneAccount ? 's' : 'l'} />
      </button>
      <ControlledMenu
        menuClassName="nav-menu"
        state={menuState}
        anchorRef={buttonRef}
        onClose={() => {
          setMenuState(undefined);
        }}
        containerProps={{
          style: {
            zIndex: 10,
          },
          onClick: () => {
            setMenuState(undefined);
          },
        }}
        portal={{
          target: document.body,
        }}
        {...props}
        overflow="auto"
        viewScroll="close"
        position="anchor"
        align="center"
        boundingBoxPadding={boundingBoxPadding}
        unmountOnClose
      >
        <section>
          {!!snapStates.appVersion?.commitHash &&
            __COMMIT_HASH__ !== snapStates.appVersion.commitHash && (
              <>
                <MenuItem
                  onClick={() => {
                    const yes = confirm('Reload page now to update?');
                    if (yes) {
                      (async () => {
                        try {
                          location.reload();
                        } catch (e) {}
                      })();
                    }
                  }}
                >
                  <Icon icon="sparkles" size="l" />{' '}
                  <span>New update available…</span>
                </MenuItem>
                <MenuDivider />
              </>
            )}
          <MenuLink to="/">
            <Icon icon="home" size="l" /> <span>Home</span>
          </MenuLink>
          {authenticated && (
            <>
              {showFollowing && (
                <MenuLink to="/following">
                  <Icon icon="following" size="l" /> <span>Following</span>
                </MenuLink>
              )}
              <MenuLink to="/mentions">
                <Icon icon="at" size="l" /> <span>Mentions</span>
              </MenuLink>
              <MenuLink to="/notifications">
                <Icon icon="notification" size="l" /> <span>Notifications</span>
                {snapStates.notificationsShowNew && (
                  <sup title="New" style={{ opacity: 0.5 }}>
                    {' '}
                    &bull;
                  </sup>
                )}
              </MenuLink>
              <MenuDivider />
              <MenuLink to="/l">
                <Icon icon="list" size="l" /> <span>Lists</span>
              </MenuLink>
              <MenuLink to="/ft">
                <Icon icon="hashtag" size="l" /> <span>Hashtags I Luv</span>
              </MenuLink>
              <MenuLink to="/b">
                <Icon icon="bookmark" size="l" /> <span>Bookmarks</span>
              </MenuLink>
              <MenuLink to="/f">
                <Icon icon="heart" size="l" /> <span>Luvs</span>
              </MenuLink>
            </>
          )}
          <MenuDivider />
          <MenuLink to={`/search`}>
            <Icon icon="search" size="l" /> <span>Search</span>
          </MenuLink>
          <MenuLink to={`/${instance}/p/l`}>
            <Icon icon="group" size="l" /> <span>Local</span>
          </MenuLink>
          <MenuLink to={`/${instance}/p`}>
            <Icon icon="earth" size="l" /> <span>Earth</span>
          </MenuLink>
          <MenuLink to={`/${instance}/trending`}>
            <Icon icon="chart" size="l" /> <span>Trending</span>
          </MenuLink>
        </section>
        <section>
          {authenticated ? (
            <>
              <MenuDivider />
              {currentAccount?.info?.id && (
                <MenuLink to={`/${instance}/a/${currentAccount.info.id}`}>
                  <Icon icon="user" size="l" /> <span>Profile</span>
                </MenuLink>
              )}
              <MenuItem
                onClick={() => {
                  states.showAccounts = true;
                }}
              >
                <Icon icon="group" size="l" /> <span>Accounts&hellip;</span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  states.showShortcutsSettings = true;
                }}
              >
                <Icon icon="shortcut" size="l" />{' '}
                <span>Shortcuts Settings&hellip;</span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  states.showSettings = true;
                }}
              >
                <Icon icon="gear" size="l" /> <span>Settings&hellip;</span>
              </MenuItem>
              <MenuItem>
              <Link
                to="https://luvr.luvnft.com" // Replace with your external URL
                target="_blank"          // Opens the link in a new tab
                rel="noopener noreferrer" // Security best practice for opening in a new tab
                >
              <Icon icon="luvr" size="l" /> <span>#😍🤜🏽🤛🏻 LUVR</span>
              </Link>
              </MenuItem>
              <MenuItem>
              <Link
                to="https://verified.luvnft.com" // Replace with your external URL
                target="_blank"          // Opens the link in a new tab
                rel="noopener noreferrer" // Security best practice for opening in a new tab
                >
              <Icon icon="verified" size="l" /> <span>#🔵✔️💙 Verified</span>
              </Link>
              </MenuItem>
              <MenuItem>
              <Link
                to="https://coc.luvnft.com" // Replace with your external URL
                target="_blank"          // Opens the link in a new tab
                rel="noopener noreferrer" // Security best practice for opening in a new tab
                >
              <Icon icon="coc" size="l" /> <span>#🟪🟨⬜️ Unity ID</span>
              </Link>
              </MenuItem>
              <MenuItem>
              <Link
                to="https://tip.luvnft.com" // Replace with your external URL
                target="_blank"          // Opens the link in a new tab
                rel="noopener noreferrer" // Security best practice for opening in a new tab
                >
              <Icon icon="tip" size="l" /> <span>#💲🤑🫶 Send TIP$</span>
              </Link>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuDivider />
              <MenuLink to="/login">
                <Icon icon="user" size="l" /> <span>Log in</span>
              </MenuLink>
            </>
          )}
        </section>
      </ControlledMenu>
    </>
  );
}

export default NavMenu;
