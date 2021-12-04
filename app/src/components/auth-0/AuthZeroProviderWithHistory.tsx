import { useHistory } from 'react-router-dom'
import { AppState, Auth0Provider } from '@auth0/auth0-react'

function Auth0ProviderWithHistory({ children }: React.HTMLAttributes<Element>) {
  const clientId = `${process.env.REACT_APP_AUTH0_CLIENT_ID}`;
  const domain = `${process.env.REACT_APP_AUTH0_DOMAIN}`;
  const audience = `${process.env.REACT_APP_AUTH0_AUDIENCE}`;

  const history = useHistory();

  const onRedirectCallback = (appState: AppState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      clientId={ clientId }
      domain={ domain }
      onRedirectCallback={ onRedirectCallback }
      redirectUri={ window.location.origin }
      audience={ audience }
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
