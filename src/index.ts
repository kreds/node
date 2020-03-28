import 'isomorphic-fetch';

export interface KredsOptions {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AuthorizationCodeGrant {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

export interface RefreshAccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export default class Kreds {
  constructor(private options: KredsOptions) {
    if (!this.options.instanceUrl.endsWith('/')) {
      this.options.instanceUrl += '/';
    }
  }

  authorizeUrl(state: string) {
    return (
      this.options.instanceUrl +
      '/v1/oauth2/authorize?client_id=' +
      encodeURIComponent(this.options.clientId) +
      '&response_type=code&state=' +
      encodeURIComponent(state) +
      '&redirect_uri=' +
      encodeURIComponent(this.options.redirectUri)
    );
  }

  async authorizationCodeGrant(code: string): Promise<AuthorizationCodeGrant> {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', this.options.redirectUri);
    formData.append('code', code);
    formData.append('client_id', this.options.clientId);
    formData.append('client_secret', this.options.clientSecret);

    const response = await fetch(
      this.options.instanceUrl + '/v1/oauth2/token',
      {
        method: 'POST',
        body: formData,
      }
    );

    const json = await response.json();

    if ('error' in json) {
      throw new Error(
        'Kreds, error during OAuth: ' +
          (json['error_description'] || json['error'])
      );
    }

    return {
      accessToken: json['access_token'],
      refreshToken: json['refresh_token'],
      tokenType: json['token_type'],
      scope: json['scope'],
      expiresIn: json['expires_in'],
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshAccessToken> {
    const formData = new FormData();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);

    const response = await fetch(
      this.options.instanceUrl + '/v1/oauth2/token',
      {
        method: 'POST',
        body: formData,
      }
    );

    const json = await response.json();

    if ('error' in json) {
      throw new Error(
        'Kreds, error during OAuth: ' +
          (json['error_description'] || json['error'])
      );
    }

    return {
      accessToken: json['access_token'],
      tokenType: json['token_type'],
      expiresIn: json['expires_in'],
    };
  }
}
